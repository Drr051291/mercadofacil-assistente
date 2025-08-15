import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { CompetitiveMonitoring } from "@/components/CompetitiveMonitoring";

const MonitorConcorrencia = () => {
  return (
    <AppLayout>
      <Header 
        title="Monitor de Concorrência" 
        subtitle="Analise a competitividade dos seus produtos e receba sugestões de preços" 
      />
      
      <div className="p-6">
        <CompetitiveMonitoring />
      </div>
    </AppLayout>
  );
};

export default MonitorConcorrencia;