import React, { useState } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type TimeRange = {
  from: Date;
  to: Date;
  label: string;
};

const predefinedRanges = {
  today: {
    label: 'Hoje',
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  yesterday: {
    label: 'Ontem',
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday),
      };
    },
  },
  last7days: {
    label: 'Últimos 7 dias',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  last15days: {
    label: 'Últimos 15 dias',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 14)),
      to: endOfDay(new Date()),
    }),
  },
  last30days: {
    label: 'Últimos 30 dias',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
};

interface TimeRangeSelectorProps {
  value?: TimeRange;
  onChange?: (range: TimeRange) => void;
  className?: string;
}

export function TimeRangeSelector({ value, onChange, className }: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(
    value || { ...predefinedRanges.last7days.getValue(), label: predefinedRanges.last7days.label }
  );
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const handlePredefinedSelect = (key: keyof typeof predefinedRanges) => {
    const range = predefinedRanges[key];
    const newRange = {
      ...range.getValue(),
      label: range.label,
    };
    setSelectedRange(newRange);
    onChange?.(newRange);
  };

  const handleCustomSelect = () => {
    if (customFrom && customTo) {
      const newRange = {
        from: startOfDay(customFrom),
        to: endOfDay(customTo),
        label: `${format(customFrom, 'dd/MM/yyyy', { locale: ptBR })} - ${format(customTo, 'dd/MM/yyyy', { locale: ptBR })}`,
      };
      setSelectedRange(newRange);
      onChange?.(newRange);
      setIsCustomOpen(false);
    }
  };

  const formatDateRange = (range: TimeRange) => {
    if (range.label in predefinedRanges || range.label.includes(' - ')) {
      return range.label;
    }
    return `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[180px]">
            <span className="truncate">{formatDateRange(selectedRange)}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] bg-background border border-border">
          {Object.entries(predefinedRanges).map(([key, range]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handlePredefinedSelect(key as keyof typeof predefinedRanges)}
              className="cursor-pointer hover:bg-muted"
            >
              {range.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => setIsCustomOpen(true)}
            className="cursor-pointer hover:bg-muted"
          >
            Período personalizado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Date Range Popover */}
      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
          <div className="p-4 space-y-4">
            <h4 className="font-medium">Selecionar período personalizado</h4>
            
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !customFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customFrom ? format(customFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={customFrom}
                      onSelect={setCustomFrom}
                      disabled={(date) => date > new Date() || (customTo && date > customTo)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !customTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customTo ? format(customTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={customTo}
                      onSelect={setCustomTo}
                      disabled={(date) => date > new Date() || (customFrom && date < customFrom)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleCustomSelect}
                disabled={!customFrom || !customTo}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}