import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import MLIntegration from "@/components/MLIntegration";

const IntegracaoML = () => {
  return (
    <AppLayout>
      <Header 
        title="Integração Mercado Livre" 
        subtitle="Configure sua conexão com o Mercado Livre para importar dados" 
      />
      
      <div className="p-6">
        <MLIntegration />
      </div>
    </AppLayout>
  );
};

export default IntegracaoML;