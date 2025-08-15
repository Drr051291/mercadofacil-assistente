import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { TopProducts } from "@/components/TopProducts";
import { EnhancedMetrics } from "@/components/EnhancedMetrics";
import { CompetitiveInsights } from "@/components/CompetitiveInsights";
import { TopClickedProducts } from "@/components/TopClickedProducts";
import { TimeRangeSelector, TimeRange } from "@/components/TimeRangeSelector";
import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users
} from "lucide-react";

const Index = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>();

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    console.log('Período selecionado:', range);
    // Aqui você pode implementar a lógica para filtrar os dados baseado no período
  };
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-4">
        <Header 
          title="Dashboard" 
          subtitle="Visão geral das suas vendas e performance no Mercado Livre" 
        />
        <TimeRangeSelector 
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          className="sm:ml-auto"
        />
      </div>
      
      <div className="px-6 pb-6 space-y-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Métricas Avançadas */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Métricas Avançadas</h2>
          <EnhancedMetrics />
        </div>

        {/* Gráficos e Análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <TopProducts />
        </div>

        {/* Produtos Mais Clicados e Insights Competitivos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopClickedProducts />
          <CompetitiveInsights />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
