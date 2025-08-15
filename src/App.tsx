import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import MLCallback from "./pages/MLCallback";
import IntegracaoML from "./pages/IntegracaoML";
import Vendas from "./pages/Vendas";
import MercadoAds from "./pages/MercadoAds";
import Produtos from "./pages/Produtos";
import Analises from "./pages/Analises";
import Alertas from "./pages/Alertas";
import Equipe from "./pages/Equipe";
import MinhaConta from "./pages/MinhaConta";
import MonitorConcorrencia from "./pages/MonitorConcorrencia";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ml-yellow/10 to-ml-blue/10 flex items-center justify-center">
        <div className="text-2xl font-bold text-ml-blue">Carregando...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/ml-callback" element={<MLCallback />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/integracao" element={user ? <IntegracaoML /> : <Auth />} />
            <Route path="/vendas" element={user ? <Vendas /> : <Auth />} />
            <Route path="/ads" element={user ? <MercadoAds /> : <Auth />} />
            <Route path="/produtos" element={user ? <Produtos /> : <Auth />} />
            <Route path="/monitor-concorrencia" element={user ? <MonitorConcorrencia /> : <Auth />} />
            <Route path="/analises" element={user ? <Analises /> : <Auth />} />
            <Route path="/alertas" element={user ? <Alertas /> : <Auth />} />
            <Route path="/equipe" element={user ? <Equipe /> : <Auth />} />
            <Route path="/minha-conta" element={user ? <MinhaConta /> : <Auth />} />
            <Route path="/" element={user ? <Index /> : <Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
