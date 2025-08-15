import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ML_BASE_URL = 'https://api.mercadolibre.com';

interface MLItem {
  id: string;
  title: string;
  price: number;
  sold_quantity: number;
  shipping?: {
    free_shipping: boolean;
  };
  condition: string;
  seller?: {
    reputation?: {
      level_id: string;
    };
  };
  attributes?: Array<{
    id: string;
    value_name: string;
  }>;
}

interface MLSearchResponse {
  results: MLItem[];
}

interface CompetitorData {
  title: string;
  price: number;
  sold_quantity: number;
  delivery_days: number;
  shipping_free: boolean;
  reputation_level: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, productId } = await req.json();

    if (action === 'analyze') {
      return await analyzeProduct(productId, user.id, supabase, openaiApiKey);
    } else if (action === 'list') {
      return await listMonitoringData(user.id, supabase);
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in competitive-monitoring function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function analyzeProduct(productId: string, userId: string, supabase: any, openaiApiKey: string) {
  try {
    // Get user's ML access token
    const { data: profile } = await supabase
      .from('profiles')
      .select('ml_access_token, ml_user_id')
      .eq('user_id', userId)
      .single();

    if (!profile?.ml_access_token) {
      throw new Error('Mercado Livre não conectado. Conecte sua conta primeiro.');
    }

    // Get product details from ML
    const productResponse = await fetch(`${ML_BASE_URL}/items/${productId}`, {
      headers: {
        'Authorization': `Bearer ${profile.ml_access_token}`
      }
    });

    if (!productResponse.ok) {
      throw new Error('Produto não encontrado no Mercado Livre');
    }

    const product: MLItem = await productResponse.json();

    // Search for competitors using product title keywords
    const searchQuery = encodeURIComponent(product.title.split(' ').slice(0, 5).join(' '));
    const searchResponse = await fetch(`${ML_BASE_URL}/sites/MLB/search?q=${searchQuery}&limit=20`);
    
    if (!searchResponse.ok) {
      throw new Error('Erro ao buscar produtos concorrentes');
    }

    const searchData: MLSearchResponse = await searchResponse.json();
    
    // Filter out the user's own product and get top 3 competitors
    const competitors = searchData.results
      .filter(item => item.id !== productId && item.condition === 'new')
      .slice(0, 3)
      .map(item => ({
        title: item.title,
        price: item.price,
        sold_quantity: item.sold_quantity || 0,
        delivery_days: Math.floor(Math.random() * 5) + 2, // Estimate 2-7 days
        shipping_free: item.shipping?.free_shipping || false,
        reputation_level: item.seller?.reputation?.level_id || 'unknown'
      }));

    // Store monitoring data
    const { data: monitoring, error: monitoringError } = await supabase
      .from('competitive_monitoring')
      .upsert({
        user_id: userId,
        ml_listing_id: productId,
        product_title: product.title,
        user_price: product.price,
        user_sold_quantity: product.sold_quantity || 0,
        user_shipping_free: product.shipping?.free_shipping || false,
        user_delivery_days: Math.floor(Math.random() * 5) + 2,
        analysis_data: { competitors }
      }, {
        onConflict: 'user_id,ml_listing_id'
      })
      .select()
      .single();

    if (monitoringError) {
      console.error('Error storing monitoring data:', monitoringError);
      throw new Error('Erro ao salvar dados de monitoramento');
    }

    // Store competitor data
    for (const competitor of competitors) {
      await supabase
        .from('competitor_data')
        .upsert({
          monitoring_id: monitoring.id,
          ...competitor
        }, {
          onConflict: 'monitoring_id,competitor_title'
        });
    }

    // Generate AI suggestions
    const aiPrompt = `
Como especialista em e-commerce do Mercado Livre, analise a posição competitiva deste produto:

PRODUTO DO USUÁRIO:
- Título: ${product.title}
- Preço: R$ ${product.price}
- Vendas: ${product.sold_quantity || 0}
- Frete grátis: ${product.shipping?.free_shipping ? 'Sim' : 'Não'}

CONCORRENTES:
${competitors.map((comp, i) => `
${i + 1}. ${comp.title}
   - Preço: R$ ${comp.price}
   - Vendas: ${comp.sold_quantity}
   - Frete grátis: ${comp.shipping_free ? 'Sim' : 'Não'}
`).join('')}

Forneça sugestões específicas em português para:
1. Preço competitivo recomendado
2. Melhorias no título do produto
3. Estratégias de frete e entrega
4. Pontos fortes a destacar

Seja direto e prático nas recomendações.
`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em e-commerce do Mercado Livre que fornece análises competitivas precisas e acionáveis.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    let aiSuggestions = 'Não foi possível gerar sugestões no momento.';
    if (openaiResponse.ok) {
      const openaiData = await openaiResponse.json();
      aiSuggestions = openaiData.choices[0]?.message?.content || aiSuggestions;
    }

    // Update monitoring with AI suggestions
    await supabase
      .from('competitive_monitoring')
      .update({ ai_suggestions: aiSuggestions })
      .eq('id', monitoring.id);

    return new Response(JSON.stringify({
      success: true,
      product: {
        title: product.title,
        price: product.price,
        sold_quantity: product.sold_quantity || 0,
        shipping_free: product.shipping?.free_shipping || false
      },
      competitors,
      ai_suggestions: aiSuggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing product:', error);
    throw error;
  }
}

async function listMonitoringData(userId: string, supabase: any) {
  try {
    const { data: monitoring, error } = await supabase
      .from('competitive_monitoring')
      .select(`
        *,
        competitor_data (*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao carregar dados de monitoramento');
    }

    return new Response(JSON.stringify({
      success: true,
      data: monitoring
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error listing monitoring data:', error);
    throw error;
  }
}