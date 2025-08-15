import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { AlertsPanel } from "@/components/AlertsPanel";

const Alertas = () => {
  return (
    <AppLayout>
      <Header 
        title="Alertas" 
        subtitle="Monitore oportunidades e problemas importantes do seu negócio" 
      />
      
      <div className="p-6">
        <AlertsPanel />
      </div>
    </AppLayout>
  );
};

export default Alertas;