import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { AdsAnalysis } from "@/components/AdsAnalysis";

const MercadoAds = () => {
  return (
    <AppLayout>
      <Header 
        title="Mercado Ads" 
        subtitle="Gerencie e otimize suas campanhas de anúncios no Mercado Livre" 
      />
      
      <div className="p-6">
        <AdsAnalysis />
      </div>
    </AppLayout>
  );
};

export default MercadoAds;