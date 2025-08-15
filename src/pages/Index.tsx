import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { TopProducts } from "@/components/TopProducts";
import { EnhancedMetrics } from "@/components/EnhancedMetrics";
import { CompetitiveInsights } from "@/components/CompetitiveInsights";
import { TopClickedProducts } from "@/components/TopClickedProducts";
import { TimeRangeSelector, TimeRange } from "@/components/TimeRangeSelector";
import { AppLayout } from "@/components/AppLayout";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users
} from "lucide-react";

const Index = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>();
  const [isConnected] = useState(false); // This would come from auth context in real app
  const navigate = useNavigate();

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    console.log('Período selecionado:', range);
    // Aqui você pode implementar a lógica para filtrar os dados baseado no período
  };

  const handleConnect = () => {
    navigate('/integracao');
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
        {/* Connection Status */}
        {!isConnected && (
          <ConnectionStatus 
            connected={isConnected}
            onConnect={handleConnect}
          />
        )}

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Métricas Avançadas</h2>
            {isConnected && (
              <ConnectionStatus connected={isConnected} compact />
            )}
          </div>
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
