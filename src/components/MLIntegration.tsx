import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  ml_access_token: string | null;
  ml_user_id: string | null;
  ml_nickname: string | null;
}

export default function MLIntegration() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectML = () => {
    // URL de autorização do Mercado Livre
    const clientId = '8738187321820958'; // Seu Client ID do ML
    const redirectUri = encodeURIComponent(`${window.location.origin}/ml-callback`);
    const state = Math.random().toString(36).substring(7); // Estado para segurança
    
    const authUrl = `https://auth.mercadolivre.com.br/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `state=${state}`;

    // Salvar state no localStorage para verificar depois
    localStorage.setItem('ml_auth_state', state);
    
    window.location.href = authUrl;
  };

  const handleDisconnectML = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          ml_access_token: null,
          ml_user_id: null,
          ml_nickname: null
        })
        .eq('user_id', user.id);

      if (error) {
        toast.error('Erro ao desconectar conta do Mercado Livre');
      } else {
        toast.success('Conta do Mercado Livre desconectada');
        fetchProfile();
      }
    } catch (error) {
      toast.error('Erro inesperado');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integração Mercado Livre</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isConnected = profile?.ml_access_token;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
          Integração Mercado Livre
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? 'Sua conta está conectada e sincronizada'
            : 'Conecte sua conta de seller para importar dados'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Usuário conectado:</div>
                <div className="text-sm text-muted-foreground">
                  {profile.ml_nickname || profile.ml_user_id}
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Conectado
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleDisconnectML}
                className="flex-1"
              >
                Desconectar
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => window.open('https://developers.mercadolivre.com.br/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                ML Developers
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Para começar a usar o MercadoFácil, você precisa conectar sua conta de seller do Mercado Livre.
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">O que você poderá fazer:</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Importar dados de vendas automaticamente</li>
                <li>• Analisar performance dos seus produtos</li>
                <li>• Otimizar campanhas de Mercado Ads</li>
                <li>• Receber alertas de estoque e oportunidades</li>
              </ul>
            </div>
            
            <Button onClick={handleConnectML} className="w-full">
              Conectar com Mercado Livre
            </Button>
            
            <div className="text-xs text-muted-foreground text-center">
              Você será redirecionado para o Mercado Livre para autorizar a conexão
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}