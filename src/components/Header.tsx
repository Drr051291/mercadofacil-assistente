import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm shadow-soft sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            {title && (
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};