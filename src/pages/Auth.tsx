import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TrendingUp, Search, Bot, Info } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Conta criada! Verifique seu email para confirmar.');
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ml-light-gray flex flex-col lg:flex-row">
      {/* Left Column - Commercial Area */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
        <div className="max-w-lg space-y-8">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="text-4xl lg:text-5xl font-bold text-ml-blue font-roboto">
              MercadoFácil
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight font-roboto">
              Seu painel inteligente para vender mais no Mercado Livre
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Veja suas vendas, anúncios, concorrentes e muito mais com apenas um login.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-ml-blue/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-ml-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Relatórios de vendas e anúncios
                </h3>
                <p className="text-muted-foreground">
                  Acompanhe suas vendas e performance dos anúncios em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-ml-blue/10 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-ml-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Comparação com concorrentes
                </h3>
                <p className="text-muted-foreground">
                  Veja como seus produtos se comparam com a concorrência
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-ml-blue/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-ml-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Recomendações baseadas em IA
                </h3>
                <p className="text-muted-foreground">
                  Receba sugestões inteligentes para otimizar suas vendas
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button variant="outline" size="lg" className="border-ml-blue text-ml-blue hover:bg-ml-blue/5">
            <Info className="w-4 h-4 mr-2" />
            Saiba mais
          </Button>
        </div>
      </div>

      {/* Right Column - Login Area */}
      <div className="flex-1 bg-background flex items-center justify-center p-8 lg:p-16 order-1 lg:order-2">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Bem-vindo de volta 👋
            </CardTitle>
            <CardDescription className="text-base">
              Entre com seu e-mail para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-medium">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="font-medium">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-ml-yellow hover:bg-ml-yellow/90 text-black font-bold" 
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Seu nome"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">E-mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="h-11"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-ml-yellow hover:bg-ml-yellow/90 text-black font-bold" 
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}