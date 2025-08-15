import { Header } from "@/components/Header";
import { AppLayout } from "@/components/AppLayout";
import { CompetitiveInsights } from "@/components/CompetitiveInsights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analises = () => {
  return (
    <AppLayout>
      <Header 
        title="Análises" 
        subtitle="Insights avançados sobre sua performance e mercado" 
      />
      
      <div className="p-6 space-y-8">
        {/* Análise Competitiva */}
        <CompetitiveInsights />

        {/* Placeholder para mais análises */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Análises Avançadas</CardTitle>
            <CardDescription>
              Mais insights e análises detalhadas estarão disponíveis em breve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Novas análises em desenvolvimento
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analises;