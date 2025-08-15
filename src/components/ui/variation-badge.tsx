import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VariationBadgeProps {
  value: string;
  type: "positive" | "negative" | "neutral";
  className?: string;
}

export function VariationBadge({ value, type, className }: VariationBadgeProps) {
  const Icon = type === "positive" ? TrendingUp : type === "negative" ? TrendingDown : Minus;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
        {
          "bg-success-light text-success border border-success/20": type === "positive",
          "bg-danger-light text-danger border border-danger/20": type === "negative",
          "bg-muted text-muted-foreground border border-muted": type === "neutral",
        },
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {value}
    </span>
  );
}