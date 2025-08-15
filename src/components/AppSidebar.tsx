import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Eye, 
  Settings,
  BarChart3,
  Users,
  Target,
  LogOut,
  Store
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: TrendingUp },
  { title: "Vendas", url: "/vendas", icon: BarChart3 },
  { title: "Mercado Ads", url: "/ads", icon: DollarSign },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Monitor de Concorrência", url: "/monitor-concorrencia", icon: Target },
  { title: "Análises", url: "/analises", icon: BarChart3 },
  { title: "Alertas", url: "/alertas", icon: Eye },
  { title: "Equipe", url: "/equipe", icon: Users },
];

const configItems = [
  { title: "Integração ML", url: "/integracao", icon: Settings },
  { title: "Minha Conta", url: "/minha-conta", icon: Settings },
];

interface Profile {
  name?: string;
  email?: string;
  ml_nickname?: string;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const collapsed = state === "collapsed";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, ml_nickname')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
      } else {
        setProfile(data || { email: user.email });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Desconectado com sucesso");
    } catch (error) {
      toast.error("Erro ao desconectar");
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-muted text-foreground border-r-2 border-foreground font-medium" 
      : "hover:bg-muted/50 text-foreground hover:text-foreground";

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.ml_nickname) return profile.ml_nickname;
    if (profile?.name) return profile.name;
    if (profile?.email) return profile.email.split('@')[0];
    return 'Usuário';
  };

  const getStoreName = () => {
    if (profile?.ml_nickname) return profile.ml_nickname;
    return 'Loja não conectada';
  };

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-ml rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-foreground font-bold text-sm">M</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-foreground">MercadoFácil</h2>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Store className="w-3 h-3" />
                {getStoreName()}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-muted text-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        )}
      </SidebarFooter>

      <SidebarTrigger className="absolute -right-3 top-4 bg-background border shadow-md" />
    </Sidebar>
  );
}