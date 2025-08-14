import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Package, Eye } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Estoque Baixo",
    description: "iPhone 13 - apenas 3 unidades restantes",
    action: "Repor Estoque",
    icon: Package,
    priority: "alta"
  },
  {
    id: 2,
    type: "opportunity",
    title: "Produto em Alta",
    description: "AirPods Pro com 150% mais visualizações",
    action: "Aumentar Estoque",
    icon: TrendingUp,
    priority: "média"
  },
  {
    id: 3,
    type: "critical",
    title: "Baixa Conversão",
    description: "MacBook Pro: 200 visualizações, 0 vendas",
    action: "Revisar Anúncio",
    icon: Eye,
    priority: "alta"
  }
];

export const AlertsPanel = () => {
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'warning':
        return 'border-l-4 border-l-warning bg-warning/5';
      case 'opportunity':
        return 'border-l-4 border-l-success bg-success/5';
      default:
        return 'border-l-4 border-l-muted';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>;
      case 'média':
        return <Badge variant="outline">Média</Badge>;
      default:
        return <Badge variant="secondary">Baixa</Badge>;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-secondary flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={`p-4 rounded-lg ${getAlertStyle(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {alert.description}
                      </p>
                      <Button size="sm" variant="outline">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};