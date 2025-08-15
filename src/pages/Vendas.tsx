import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, TrendingUp, Package } from "lucide-react";

const Vendas = () => {
  return (
    <AppLayout>
      <Header 
        title="Vendas" 
        subtitle="Acompanhe o desempenho das suas vendas no Mercado Livre" 
      />
      
      <div className="p-6 space-y-8">
        {/* Métricas de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Vendas do Mês"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={DollarSign}
          />
          <MetricCard
            title="Pedidos do Mês"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={Package}
          />
          <MetricCard
            title="Ticket Médio"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={TrendingUp}
          />
          <MetricCard
            title="Taxa de Conversão"
            value="--"
            change="Conecte sua conta ML"
            changeType="neutral"
            icon={BarChart3}
          />
        </div>

        {/* Placeholder para futuros gráficos */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Relatórios de Vendas</CardTitle>
            <CardDescription>
              Aqui você verá gráficos detalhados das suas vendas após conectar sua conta do Mercado Livre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Conecte sua conta ML para ver os dados de vendas
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Vendas;