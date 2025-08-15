import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { TopProducts } from "@/components/TopProducts";
import { MetricCard } from "@/components/MetricCard";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";

const Produtos = () => {
  return (
    <AppLayout>
      <Header 
        title="Produtos" 
        subtitle="Gerencie seus produtos e acompanhe a performance de cada item" 
      />
      
      <div className="p-6 space-y-8">
        {/* Métricas de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            icon={TrendingUp}
          />
          <MetricCard
            title="Produtos sem Estoque"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={AlertTriangle}
          />
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts />
          <TopProducts />
        </div>
      </div>
    </AppLayout>
  );
};

export default Produtos;