import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('ML_CLIENT_ID');
    const clientSecret = Deno.env.get('ML_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Credenciais ML não configuradas');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Credenciais não configuradas',
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Teste simples: verificar se conseguimos fazer uma requisição básica para a API do ML
    const testResponse = await fetch('https://api.mercadolibre.com/sites/MLB', {
      headers: {
        'Accept': 'application/json',
      },
    });

    const testData = await testResponse.json();
    console.log('Teste de conectividade ML:', {
      status: testResponse.status,
      success: testResponse.ok,
      siteId: testData.id
    });

    // Obter a origem da requisição para construir a URL de redirect dinamicamente
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const redirectUri = origin ? `${origin}/ml-callback` : 'https://preview--mercadofacil-assistente.lovable.app/ml-callback';

    return new Response(
      JSON.stringify({ 
        success: true,
        credentials: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          clientIdPrefix: clientId.substring(0, 4) + '...',
        },
        mlApiConnectivity: {
          status: testResponse.status,
          working: testResponse.ok
        },
        config: {
          redirectUri,
          authUrl: `https://auth.mercadolibre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`
        },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro no teste de credenciais ML:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});