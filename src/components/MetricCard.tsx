import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  className 
}: MetricCardProps) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  }[changeType];

  const isConnected = value !== "--";
  
  return (
    <Card className={cn("shadow-soft hover:shadow-ml transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-semibold mb-2 uppercase tracking-wider">
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold mb-2",
              isConnected ? "text-foreground" : "text-muted-foreground"
            )}>
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-sm font-medium",
                isConnected ? changeColor : "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
              isConnected 
                ? "bg-primary/10 border border-primary/20" 
                : "bg-muted/50 border border-muted"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                isConnected ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};