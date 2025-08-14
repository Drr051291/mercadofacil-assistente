import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MLCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autorização...');
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        // Verificar se houve erro na autorização
        if (error) {
          setStatus('error');
          setMessage(`Erro na autorização: ${error}`);
          return;
        }

        // Verificar se o código foi recebido
        if (!code) {
          setStatus('error');
          setMessage('Código de autorização não recebido');
          return;
        }

        // Verificar state para segurança (opcional, mas recomendado)
        const savedState = localStorage.getItem('ml_auth_state');
        if (savedState && state !== savedState) {
          setStatus('error');
          setMessage('Estado de segurança inválido');
          return;
        }

        // Limpar state do localStorage
        localStorage.removeItem('ml_auth_state');

        // Chamar Edge Function para trocar código por token
        const { data, error: exchangeError } = await supabase.functions.invoke('ml-auth', {
          body: { code }
        });

        if (exchangeError) {
          console.error('Erro ao trocar código por token:', exchangeError);
          setStatus('error');
          setMessage('Erro ao completar autorização');
          return;
        }

        if (data.success) {
          setStatus('success');
          setMessage('Conta conectada com sucesso!');
          toast.success('Mercado Livre conectado com sucesso!');
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erro desconhecido');
        }

      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus('error');
        setMessage('Erro inesperado durante a autorização');
      }
    };

    processCallback();
  }, [navigate]);

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-8 w-8 animate-spin text-blue-600" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-green-600" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          <CardTitle>
            {status === 'loading' && 'Conectando...'}
            {status === 'success' && 'Sucesso!'}
            {status === 'error' && 'Erro na Conexão'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && (
            <Button onClick={handleRetry} className="w-full">
              Voltar ao Dashboard
            </Button>
          )}
          {status === 'success' && (
            <div className="text-center text-sm text-muted-foreground">
              Redirecionando em instantes...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}