import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VariationBadge } from "@/components/ui/variation-badge";

interface EnhancedMetricData {
  label: string;
  value: string;
  variation: string;
  variationType: "positive" | "negative" | "neutral";
  tooltip?: string;
}

const enhancedMetrics: EnhancedMetricData[] = [
  {
    label: "Faturamento acumulado no mês",
    value: "R$ 127.450",
    variation: "+18% vs mês anterior",
    variationType: "positive",
    tooltip: "Total de vendas brutas no período atual"
  },
  {
    label: "Ticket médio por pedido",
    value: "R$ 89,50",
    variation: "+5,2% vs mês anterior",
    variationType: "positive",
    tooltip: "Valor médio por venda realizada"
  },
  {
    label: "Taxa de conversão dos anúncios",
    value: "4,8%",
    variation: "-0,3% vs mês anterior",
    variationType: "negative",
    tooltip: "% de visitantes que compraram através dos anúncios"
  },
  {
    label: "Custo por venda (CAC estimado)",
    value: "R$ 12,30",
    variation: "+R$ 2,10 vs mês anterior",
    variationType: "negative",
    tooltip: "Custo médio para adquirir um cliente"
  }
];

export function EnhancedMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {enhancedMetrics.map((metric, index) => (
        <Card key={index} className="shadow-md border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                {metric.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{metric.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <VariationBadge
                value={metric.variation}
                type={metric.variationType}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}