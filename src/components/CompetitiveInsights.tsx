import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, RefreshCw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompetitorData {
  metric: string;
  userValue: string;
  competitorAverage: string;
  userBetter: boolean;
}

const competitorData: CompetitorData[] = [
  { metric: "Preço", userValue: "R$ 135,00", competitorAverage: "R$ 127,00", userBetter: false },
  { metric: "Frete", userValue: "Grátis", competitorAverage: "R$ 12,90", userBetter: true },
  { metric: "Entrega estimada", userValue: "3 dias úteis", competitorAverage: "5 dias úteis", userBetter: true },
  { metric: "Vendas estimadas", userValue: "45", competitorAverage: "62", userBetter: false }
];

export function CompetitiveInsights() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-foreground">
              Comparativo com Concorrentes
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Comparação baseada em produtos similares na mesma categoria</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Seu produto vs. média dos concorrentes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {competitorData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{item.metric}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="font-medium text-foreground">{item.userValue}</div>
                  <div className="text-xs text-muted-foreground">Seu produto</div>
                </div>
                <div className="w-6 flex justify-center">
                  {item.userBetter ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-danger" />
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium text-muted-foreground">{item.competitorAverage}</div>
                  <div className="text-xs text-muted-foreground">Média concorrentes</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Sugestão de Melhoria</p>
              <p className="text-sm text-muted-foreground">
                Reduza o preço em 5% para se manter competitivo e considere destacar a vantagem da entrega rápida.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}