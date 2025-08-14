import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Target, TrendingUp } from "lucide-react";

const adsData = {
  budget: 2500,
  spent: 1850,
  roas: 4.2,
  cac: 45,
  conversions: 41,
  recommendations: [
    {
      type: "increase",
      product: "iPhone 13",
      suggestion: "Aumentar orçamento em 30%",
      expectedReturn: "+R$ 1.200",
      confidence: "alta"
    },
    {
      type: "pause",
      product: "Samsung A54",
      suggestion: "Pausar campanha",
      reason: "ROAS abaixo de 1.5",
      confidence: "média"
    },
    {
      type: "optimize",
      product: "AirPods",
      suggestion: "Ajustar palavras-chave",
      expectedReturn: "Reduzir CAC em 20%",
      confidence: "alta"
    }
  ]
};

export const AdsAnalysis = () => {
  const budgetUsage = (adsData.spent / adsData.budget) * 100;

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'increase':
        return 'border-l-4 border-l-success bg-success/5';
      case 'pause':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'optimize':
        return 'border-l-4 border-l-warning bg-warning/5';
      default:
        return 'border-l-4 border-l-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROAS</p>
                <p className="text-2xl font-bold text-success">
                  {adsData.roas.toFixed(1)}x
                </p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CAC</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {adsData.cac}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold text-foreground">
                  {adsData.conversions}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orçamento */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-secondary">Orçamento do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                R$ {adsData.spent.toLocaleString()} de R$ {adsData.budget.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-foreground">
                {budgetUsage.toFixed(0)}%
              </span>
            </div>
            <Progress value={budgetUsage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Restam R$ {(adsData.budget - adsData.spent).toLocaleString()} para este mês
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-secondary">Recomendações IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adsData.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg ${getRecommendationStyle(rec.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{rec.product}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence === 'alta' ? '🎯 Alta' : '📊 Média'} confiança
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.suggestion}
                    </p>
                    <p className="text-sm font-medium text-success">
                      {rec.expectedReturn || rec.reason}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};