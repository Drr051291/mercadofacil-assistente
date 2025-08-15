import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, ShoppingBag } from "lucide-react";
import { VariationBadge } from "@/components/ui/variation-badge";

interface TopClickedProduct {
  name: string;
  clicks: number;
  variation: string;
  variationType: "positive" | "negative" | "neutral";
  sales: number;
  conversionRate: number;
}

const topClickedProducts: TopClickedProduct[] = [
  {
    name: "Smartphone Samsung Galaxy A54",
    clicks: 1247,
    variation: "+23%",
    variationType: "positive",
    sales: 45,
    conversionRate: 3.6
  },
  {
    name: "Fone de Ouvido Bluetooth JBL",
    clicks: 892,
    variation: "-8%",
    variationType: "negative",
    sales: 67,
    conversionRate: 7.5
  },
  {
    name: "Carregador Portátil 10000mAh",
    clicks: 634,
    variation: "+15%",
    variationType: "positive",
    sales: 23,
    conversionRate: 3.6
  },
  {
    name: "Capinha iPhone 14 Transparente",
    clicks: 456,
    variation: "+5%",
    variationType: "positive",
    sales: 89,
    conversionRate: 19.5
  }
];

export function TopClickedProducts() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Produtos com Mais Cliques
            </CardTitle>
            <CardDescription>
              Produtos mais visualizados nos últimos 7 dias
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClickedProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground mb-1">
                  {product.name}
                </h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {product.clicks.toLocaleString('pt-BR')} cliques
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {product.sales} vendas
                  </div>
                  <div>
                    Conv: {product.conversionRate}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VariationBadge
                  value={product.variation}
                  type={product.variationType}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}