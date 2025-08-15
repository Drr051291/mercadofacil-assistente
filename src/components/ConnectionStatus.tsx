import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff, ArrowRight } from "lucide-react";

interface ConnectionStatusProps {
  connected?: boolean;
  message?: string;
  showConnectButton?: boolean;
  onConnect?: () => void;
  compact?: boolean;
}

export function ConnectionStatus({ 
  connected = false, 
  message, 
  showConnectButton = true,
  onConnect,
  compact = false 
}: ConnectionStatusProps) {
  const defaultMessage = connected 
    ? "Conectado ao Mercado Livre" 
    : "Conecte sua conta do Mercado Livre para ver dados reais";

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {connected ? (
          <Wifi className="w-4 h-4 text-success" />
        ) : (
          <WifiOff className="w-4 h-4 text-warning" />
        )}
        <span>{message || defaultMessage}</span>
      </div>
    );
  }

  if (connected) {
    return (
      <Alert className="border-success/20 bg-success/5">
        <Wifi className="h-4 w-4 text-success" />
        <AlertDescription className="text-success">
          {message || defaultMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Conta não conectada</p>
              <p className="text-sm text-muted-foreground">
                {message || "Conecte sua conta do Mercado Livre para ver dados reais e análises detalhadas"}
              </p>
            </div>
          </div>
          {showConnectButton && (
            <Button onClick={onConnect} className="gap-2">
              Conectar
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}