import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Users, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

interface AdminProfile {
  id: string;
  name: string | null;
  email: string | null;
  ml_user_id: string | null;
  ml_nickname: string | null;
  ml_access_token: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminPanel() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminEmail === 'contato@vivazagencia.com.br' && adminPassword === '123456') {
      setIsAuthenticated(true);
      fetchAllProfiles();
      toast.success('Acesso administrativo autorizado');
    } else {
      toast.error('Acesso restrito. Este painel é exclusivo para administradores.');
    }
  };

  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar perfis:', error);
        toast.error('Erro ao carregar dados dos sellers');
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTokenStatus = (token: string | null) => {
    if (!token) {
      return <Badge variant="destructive">Não conectado</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Conectado</Badge>;
  };

  const connectedSellers = profiles.filter(p => p.ml_access_token);
  const expiredTokens = profiles.filter(p => !p.ml_access_token && p.ml_user_id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ml-yellow/10 to-ml-blue/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-ml-blue">Painel Administrativo</CardTitle>
            <CardDescription>Acesso restrito para administradores</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">E-mail Administrativo</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Acessar Painel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-ml-blue text-white p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-ml-yellow mt-2">Monitoramento de sellers - MercadoFácil MVP</p>
            </div>
            <Button 
              variant="outline" 
              className="bg-white text-ml-blue hover:bg-gray-100"
              onClick={() => setIsAuthenticated(false)}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sellers Conectados</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedSellers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tokens Expirados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredTokens.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conexão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.length > 0 ? Math.round((connectedSellers.length / profiles.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Sellers</CardTitle>
            <CardDescription>
              {profiles.length === 0 
                ? "Nenhum seller conectado ainda. Hora de começar a validação do MVP!"
                : `${profiles.length} usuários cadastrados na plataforma`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando dados...</div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum seller conectado ainda. Hora de começar a validação do MVP!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ML User ID</TableHead>
                    <TableHead>ML Nickname</TableHead>
                    <TableHead>Status Token</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Última atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        {profile.name || 'Não informado'}
                      </TableCell>
                      <TableCell>{profile.email || 'Não informado'}</TableCell>
                      <TableCell>{profile.ml_user_id || '-'}</TableCell>
                      <TableCell>{profile.ml_nickname || '-'}</TableCell>
                      <TableCell>{getTokenStatus(profile.ml_access_token)}</TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                      <TableCell>{formatDate(profile.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Alertas e Insights */}
        {expiredTokens.length > 0 && (
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Sellers com Token Expirado
              </CardTitle>
              <CardDescription>
                Estes sellers precisam reconectar suas contas do Mercado Livre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiredTokens.map((profile) => (
                  <div key={profile.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">{profile.name || profile.email}</div>
                      <div className="text-sm text-muted-foreground">ML ID: {profile.ml_user_id}</div>
                    </div>
                    <Badge variant="destructive">Token Expirado</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}