import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const salesData = [
  { day: "Dom", vendas: 2400 },
  { day: "Seg", vendas: 1398 },
  { day: "Ter", vendas: 9800 },
  { day: "Qua", vendas: 3908 },
  { day: "Qui", vendas: 4800 },
  { day: "Sex", vendas: 3800 },
  { day: "Sab", vendas: 4300 },
];

export const SalesChart = () => {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold">Vendas dos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary-foreground))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};