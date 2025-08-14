import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { code } = await req.json();
    
    if (!code) {
      console.error('Código de autorização não fornecido');
      return new Response(
        JSON.stringify({ success: false, error: 'Código de autorização não fornecido' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obter secrets do ambiente
    const clientId = Deno.env.get('ML_CLIENT_ID');
    const clientSecret = Deno.env.get('ML_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!clientId || !clientSecret) {
      console.error('Credenciais do Mercado Livre não configuradas');
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais não configuradas' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Iniciando troca de código por token do ML...');

    // 1. Trocar código por access token
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: 'https://pwkczhxdgivypgoxpbjz--vite.web.val.run/ml-callback'
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Resposta da API do ML para token:', tokenData);

    if (!tokenResponse.ok || tokenData.error) {
      console.error('Erro ao obter token do ML:', tokenData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erro do ML: ${tokenData.error_description || tokenData.error || 'Erro desconhecido'}` 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const accessToken = tokenData.access_token;
    const userId = tokenData.user_id;

    console.log('Token obtido com sucesso, obtendo dados do usuário...');

    // 2. Obter informações do usuário
    const userResponse = await fetch(`https://api.mercadolibre.com/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();
    console.log('Dados do usuário ML:', userData);

    if (!userResponse.ok) {
      console.error('Erro ao obter dados do usuário ML:', userData);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao obter dados do usuário' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 3. Salvar no Supabase
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Token de autorização não fornecido');
      return new Response(
        JSON.stringify({ success: false, error: 'Não autenticado' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    // Obter o usuário autenticado a partir do token JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      console.error('Erro ao verificar usuário:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário não encontrado' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Salvando dados no perfil do usuário...');

    // 4. Atualizar perfil do usuário
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ml_access_token: accessToken,
        ml_user_id: userId.toString(),
        ml_nickname: userData.nickname,
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao salvar dados' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Integração ML completada com sucesso!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        nickname: userData.nickname,
        user_id: userId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função ml-auth:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});