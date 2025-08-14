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
        <CardTitle className="text-secondary">Vendas dos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="day" 
                stroke="#4D4D4D"
                fontSize={12}
              />
              <YAxis 
                stroke="#4D4D4D"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                labelStyle={{ color: '#4D4D4D' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="#FFE600" 
                strokeWidth={3}
                dot={{ fill: '#FFE600', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFE600' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};