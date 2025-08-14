import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-ml rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-roboto font-bold text-secondary">
                  MercadoFácil
                </h1>
                <p className="text-sm text-muted-foreground">
                  Assistente para Vendedores
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              João Silva
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};