import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  title: string;
  price: number;
  sold_quantity: number;
  shipping: {
    free_shipping: boolean;
    type?: string;
  };
  permalink?: string;
  category_id?: string;
}

interface CompetitiveAnalysisRequest {
  productTitle: string;
  productPrice: number;
  productSales: number;
  productShipping: string;
  productDeliveryTime: string;
  categoryId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productTitle, productPrice, productSales, productShipping, productDeliveryTime, categoryId }: CompetitiveAnalysisRequest = await req.json();

    console.log('Starting competitive analysis for:', productTitle);

    // Search for similar products on Mercado Livre
    const searchQuery = encodeURIComponent(productTitle.split(' ').slice(0, 3).join(' '));
    const searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${searchQuery}&limit=10`;
    
    console.log('Searching competitors with URL:', searchUrl);

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      throw new Error('Nenhum produto similar encontrado');
    }

    // Filter and get top 3 competitors
    const competitors = searchData.results
      .filter((item: Product) => 
        item.price > 0 && 
        item.title.length > 10 &&
        item.id !== productTitle // Basic filter to avoid exact matches
      )
      .slice(0, 3)
      .map((item: Product) => ({
        title: item.title,
        price: item.price,
        sales: item.sold_quantity || 0,
        shipping: item.shipping?.free_shipping ? 'Frete grátis' : 'Frete pago',
        deliveryTime: 'Não informado',
        permalink: item.permalink
      }));

    console.log('Found competitors:', competitors.length);

    // Prepare data for OpenAI analysis
    const analysisPrompt = `
Você é um especialista em e-commerce e análise competitiva do Mercado Livre. 

Analise o seguinte produto do vendedor comparado com seus concorrentes:

**PRODUTO DO VENDEDOR:**
- Título: ${productTitle}
- Preço: R$ ${productPrice.toFixed(2)}
- Vendas: ${productSales}
- Frete: ${productShipping}
- Prazo de entrega: ${productDeliveryTime}

**CONCORRENTES:**
${competitors.map((comp, index) => `
${index + 1}. ${comp.title}
   - Preço: R$ ${comp.price.toFixed(2)}
   - Vendas: ${comp.sales}
   - Frete: ${comp.shipping}
   - Prazo: ${comp.deliveryTime}
`).join('')}

Por favor, forneça uma análise detalhada em formato JSON com as seguintes seções:

{
  "resumo": "Resumo executivo da posição competitiva em 2-3 frases",
  "pontos_fortes": ["lista de pontos fortes do produto analisado"],
  "pontos_fracos": ["lista de pontos fracos identificados"],
  "recomendacoes": {
    "preco": "sugestão específica sobre preço",
    "titulo": "sugestão para melhorar o título",
    "frete": "sugestão sobre estratégia de frete",
    "geral": "outras recomendações importantes"
  },
  "score_competitividade": "número de 1-10 indicando quão competitivo está o produto"
}

Responda APENAS o JSON, sem texto adicional.
`;

    // Call OpenAI API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI for analysis...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise competitiva para e-commerce. Sempre responda em JSON válido e em português brasileiro.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIData.choices || !openAIData.choices[0]) {
      throw new Error('Erro na análise da IA');
    }

    const analysisText = openAIData.choices[0].message.content.trim();
    console.log('OpenAI raw response:', analysisText);

    // Parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Error parsing OpenAI JSON:', e);
      // Fallback analysis if JSON parsing fails
      analysis = {
        resumo: "Análise competitiva realizada com base nos dados fornecidos.",
        pontos_fortes: ["Produto posicionado no mercado"],
        pontos_fracos: ["Necessário ajustar estratégia"],
        recomendacoes: {
          preco: "Revisar estratégia de preços",
          titulo: "Otimizar título do produto",
          frete: "Considerar frete grátis",
          geral: "Monitorar concorrentes regularmente"
        },
        score_competitividade: "6"
      };
    }

    const result = {
      userProduct: {
        title: productTitle,
        price: productPrice,
        sales: productSales,
        shipping: productShipping,
        deliveryTime: productDeliveryTime
      },
      competitors,
      analysis,
      timestamp: new Date().toISOString()
    };

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in competitive-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});