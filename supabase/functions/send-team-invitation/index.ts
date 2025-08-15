import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface InvitationRequest {
  name: string;
  email: string;
  invitationToken: string;
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

    const { name, email, invitationToken }: InvitationRequest = await req.json();
    console.log('Invitation data:', { name, email, invitationToken });

    // Create invitation link
    const invitationLink = `${Deno.env.get('SUPABASE_URL')}/auth/invite?token=${invitationToken}`;
    
    // Send email using Resend API
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite para MercadoFácil</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MercadoFácil</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Você foi convidado!</p>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Olá, ${name}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                Você foi convidado para fazer parte da equipe no <strong>MercadoFácil</strong>. 
                Nossa plataforma vai ajudar você a gerenciar e otimizar suas vendas no Mercado Livre de forma mais eficiente.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 6px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                  Aceitar Convite
                </a>
              </div>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                  <strong>⏰ Importante:</strong> Este convite expira em 7 dias. 
                  Se você não conseguir clicar no botão acima, copie e cole o seguinte link no seu navegador:
                </p>
                <p style="margin: 10px 0 0 0; word-break: break-all; color: #667eea; font-size: 14px;">
                  ${invitationLink}
                </p>
              </div>
              <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
                Se você não esperava este convite, pode ignorar este e-mail com segurança.
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © 2025 MercadoFácil. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'MercadoFácil <noreply@resend.dev>',
      to: [email],
      subject: 'Você foi convidado para o MercadoFácil',
      html: emailHtml,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Falha ao enviar e-mail de convite');
    }

    console.log(`Invitation email sent successfully to: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Convite enviado com sucesso!',
        invitationLink: invitationLink
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