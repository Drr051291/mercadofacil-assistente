import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const topProducts = [
  {
    id: 1,
    name: "iPhone 13 128GB",
    sales: 45,
    revenue: "R$ 135.000",
    trend: "up",
    change: "+12%"
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    sales: 38,
    revenue: "R$ 95.000",
    trend: "up",
    change: "+8%"
  },
  {
    id: 3,
    name: "MacBook Air M1",
    sales: 15,
    revenue: "R$ 120.000",
    trend: "down",
    change: "-5%"
  },
  {
    id: 4,
    name: "AirPods Pro",
    sales: 67,
    revenue: "R$ 67.000",
    trend: "up",
    change: "+25%"
  }
];

export const TopProducts = () => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold">Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{product.sales} vendas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground text-lg">{product.revenue}</p>
                <div className="flex items-center gap-1">
                  {product.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={product.trend === 'up' ? 'text-success border-success' : 'text-destructive border-destructive'}
                  >
                    {product.change}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};