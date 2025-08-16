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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    console.log('ML Callback recebido:', {
      hasCode: !!code,
      hasError: !!error,
      error: error,
      codePrefix: code ? code.substring(0, 8) + '...' : null
    });

    // Se houve erro na autenticação
    if (error) {
      console.error('Erro na autorização ML:', error);
      
      // Redirecionar para a aplicação com erro
      const redirectUrl = `https://preview--mercadofacil-assistente.lovable.app/integracao?error=${encodeURIComponent(error)}`;
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders
        }
      });
    }

    // Se não há código, é um erro
    if (!code) {
      console.error('Código de autorização não fornecido no callback');
      
      const redirectUrl = `https://preview--mercadofacil-assistente.lovable.app/integracao?error=no_code`;
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders
        }
      });
    }

    // Redirecionar para a aplicação com o código
    const redirectUrl = `https://preview--mercadofacil-assistente.lovable.app/integracao?code=${encodeURIComponent(code)}`;
    
    console.log('Redirecionando para aplicação com código:', {
      codePrefix: code.substring(0, 8) + '...',
      redirectUrl: redirectUrl.split('?')[0] + '?code=...'
    });

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Erro no callback ML:', error);
    
    const redirectUrl = `https://preview--mercadofacil-assistente.lovable.app/integracao?error=callback_error`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders
      }
    });
  }
});