import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { TopProducts } from "@/components/TopProducts";
import { AlertsPanel } from "@/components/AlertsPanel";
import { AdsAnalysis } from "@/components/AdsAnalysis";
import MLIntegration from "@/components/MLIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  Users,
  Eye,
  Settings
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Vendas Hoje"
            value="R$ 8.547"
            change="+12% vs ontem"
            changeType="positive"
            icon={DollarSign}
          />
          <MetricCard
            title="Pedidos"
            value="23"
            change="+8% vs ontem"
            changeType="positive"
            icon={ShoppingCart}
          />
          <MetricCard
            title="Visitantes"
            value="1.429"
            change="+5% vs ontem"
            changeType="positive"
            icon={Users}
          />
          <MetricCard
            title="Taxa Conversão"
            value="3.2%"
            change="-0.5% vs ontem"
            changeType="negative"
            icon={TrendingUp}
          />
        </div>

        {/* Tabs Principais */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Mercado Ads
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart />
              <TopProducts />
            </div>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <AdsAnalysis />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProducts />
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Produtos Ativos"
                  value="156"
                  change="+3 novos esta semana"
                  changeType="positive"
                  icon={Package}
                />
                <MetricCard
                  title="Estoque Total"
                  value="2.847"
                  change="Valor: R$ 45.200"
                  changeType="neutral"
                  icon={Package}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <MLIntegration />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
