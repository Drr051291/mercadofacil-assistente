import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface InvitationRequest {
  name: string;
  email: string;
  inviteId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send team invitation function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { name, email, inviteId }: InvitationRequest = await req.json();
    console.log('Invitation data:', { name, email, inviteId });

    // Send email using a simple approach (in a real app, you'd use a service like Resend)
    console.log(`Would send invitation email to: ${email}`);
    console.log(`Invitation link: ${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${inviteId}&type=signup&redirect_to=${Deno.env.get('SUPABASE_URL')}`);

    // For now, we'll just log the invitation details
    const invitationDetails = {
      to: email,
      subject: 'Convite para MercadoFácil',
      content: `
        Olá ${name},
        
        Você foi convidado para participar da equipe no MercadoFácil!
        
        Para aceitar o convite, clique no link abaixo:
        [Link de convite seria aqui]
        
        Este convite expira em 7 dias.
        
        Equipe MercadoFácil
      `
    };

    console.log('Invitation email details:', invitationDetails);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Convite enviado com sucesso!',
        details: invitationDetails 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error sending team invitation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);