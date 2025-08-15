import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, TrendingUp, TrendingDown, Truck, Package } from "lucide-react";

interface CompetitorData {
  competitor_title: string;
  competitor_price: number;
  competitor_sold_quantity: number;
  competitor_delivery_days: number;
  competitor_shipping_free: boolean;
  competitor_reputation_level: string;
}

interface MonitoringData {
  id: string;
  ml_listing_id: string;
  product_title: string;
  user_price: number;
  user_sold_quantity: number;
  user_shipping_free: boolean;
  user_delivery_days: number;
  ai_suggestions: string;
  competitor_data: CompetitorData[];
  created_at: string;
}

export function CompetitiveMonitoring() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [productId, setProductId] = useState("");
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MonitoringData | null>(null);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitive-monitoring', {
        body: { action: 'list' }
      });

      if (error) throw error;

      if (data.success) {
        setMonitoringData(data.data);
      }
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      toast.error('Erro ao carregar dados de monitoramento');
    } finally {
      setLoading(false);
    }
  };

  const analyzeProduct = async () => {
    if (!productId.trim()) {
      toast.error('Digite o ID do produto');
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitive-monitoring', {
        body: { action: 'analyze', productId: productId.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Análise concluída com sucesso!');
        setProductId("");
        await loadMonitoringData();
      }
    } catch (error: any) {
      console.error('Error analyzing product:', error);
      toast.error(error.message || 'Erro ao analisar produto');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCompetitiveBadge = (userPrice: number, competitors: CompetitorData[]) => {
    if (competitors.length === 0) return null;
    
    const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.competitor_price, 0) / competitors.length;
    const difference = ((userPrice - avgCompetitorPrice) / avgCompetitorPrice) * 100;
    
    if (difference > 10) {
      return <Badge variant="destructive" className="gap-1"><TrendingUp className="w-3 h-3" />Acima do mercado</Badge>;
    } else if (difference < -10) {
      return <Badge variant="default" className="gap-1"><TrendingDown className="w-3 h-3" />Abaixo do mercado</Badge>;
    } else {
      return <Badge variant="secondary" className="gap-1">Competitivo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Monitor de Concorrência
          </CardTitle>
          <CardDescription>
            Analise a competitividade dos seus produtos no Mercado Livre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o ID do produto (ex: MLB123456789)"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={analyzeProduct} 
              disabled={analyzing || !productId.trim()}
              className="gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analisar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ) : monitoringData.length === 0 ? (
        <Alert>
          <Package className="w-4 h-4" />
          <AlertDescription>
            Nenhum produto monitorado ainda. Analise um produto para começar.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {monitoringData.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedProduct(item)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.product_title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Seu preço: {formatPrice(item.user_price)}</span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {item.user_sold_quantity} vendas
                      </span>
                      {item.user_shipping_free && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Truck className="w-4 h-4" />
                          Frete grátis
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getCompetitiveBadge(item.user_price, item.competitor_data)}
                    <span className="text-xs text-muted-foreground">
                      {item.competitor_data.length} concorrentes
                    </span>
                  </div>
                </div>

                {selectedProduct?.id === item.id && (
                  <div className="space-y-6 border-t pt-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Atributo</TableHead>
                            <TableHead>Seu produto</TableHead>
                            {item.competitor_data.slice(0, 3).map((_, index) => (
                              <TableHead key={index}>Concorrente {index + 1}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Preço</TableCell>
                            <TableCell>{formatPrice(item.user_price)}</TableCell>
                            {item.competitor_data.slice(0, 3).map((comp, index) => (
                              <TableCell key={index}>{formatPrice(comp.competitor_price)}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Vendas estimadas</TableCell>
                            <TableCell>{item.user_sold_quantity}</TableCell>
                            {item.competitor_data.slice(0, 3).map((comp, index) => (
                              <TableCell key={index}>{comp.competitor_sold_quantity}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Frete</TableCell>
                            <TableCell>{item.user_shipping_free ? 'Grátis' : 'Pago'}</TableCell>
                            {item.competitor_data.slice(0, 3).map((comp, index) => (
                              <TableCell key={index}>{comp.competitor_shipping_free ? 'Grátis' : 'Pago'}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Entrega estimada</TableCell>
                            <TableCell>{item.user_delivery_days} dias úteis</TableCell>
                            {item.competitor_data.slice(0, 3).map((comp, index) => (
                              <TableCell key={index}>{comp.competitor_delivery_days} dias úteis</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {item.ai_suggestions && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">🤖 Sugestões de IA</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {item.ai_suggestions}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}