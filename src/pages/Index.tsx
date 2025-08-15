import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { TopProducts } from "@/components/TopProducts";
import { AlertsPanel } from "@/components/AlertsPanel";
import { AdsAnalysis } from "@/components/AdsAnalysis";
import MLIntegration from "@/components/MLIntegration";
import { AppLayout } from "@/components/AppLayout";
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
    <AppLayout>
      <Header 
        title="Dashboard" 
        subtitle="Visão geral das suas vendas e performance no Mercado Livre" 
      />
      
      <div className="p-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Vendas Hoje"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={DollarSign}
          />
          <MetricCard
            title="Pedidos"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={ShoppingCart}
          />
          <MetricCard
            title="Visitantes"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={Users}
          />
          <MetricCard
            title="Taxa Conversão"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
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
                  value="--"
                  change="Conecte sua conta ML"
                  changeType="neutral"
                  icon={Package}
                />
                <MetricCard
                  title="Estoque Total"
                  value="--"
                  change="Conecte sua conta ML"
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
      </div>
    </AppLayout>
  );
};

export default Index;
