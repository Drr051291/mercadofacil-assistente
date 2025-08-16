import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('ML_CLIENT_ID');
    
    if (!clientId) {
      console.error('ML_CLIENT_ID não configurado');
      return new Response(
        JSON.stringify({ error: 'Configuração do ML não encontrada' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obter a origem da requisição para construir a URL de redirect dinamicamente
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    const redirectUri = origin ? `${origin}/ml-callback` : 'https://pwkczhxdgivypgoxpbjz.supabase.co/ml-callback';

    console.log('Client ID solicitado:', clientId.substring(0, 4) + '...');
    console.log('Redirect URI configurado:', redirectUri);

    return new Response(
      JSON.stringify({ 
        clientId,
        redirectUri
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função ml-config:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});