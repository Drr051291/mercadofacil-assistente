import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VariationBadge } from "@/components/ui/variation-badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompetitorProduct {
  title: string;
  price: number;
  sales: number;
  shipping: string;
  deliveryTime: string;
  permalink?: string;
}

interface Analysis {
  resumo: string;
  pontos_fortes: string[];
  pontos_fracos: string[];
  recomendacoes: {
    preco: string;
    titulo: string;
    frete: string;
    geral: string;
  };
  score_competitividade: string;
}

interface AnalysisResult {
  userProduct: CompetitorProduct;
  competitors: CompetitorProduct[];
  analysis: Analysis;
  timestamp: string;
}

export function CompetitiveAnalysisFeature() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [formData, setFormData] = useState({
    productTitle: '',
    productPrice: '',
    productSales: '',
    productShipping: 'Frete grátis',
    productDeliveryTime: '3 dias úteis'
  });
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!formData.productTitle || !formData.productPrice) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o título e preço do produto",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitive-analysis', {
        body: {
          productTitle: formData.productTitle,
          productPrice: parseFloat(formData.productPrice),
          productSales: parseInt(formData.productSales) || 0,
          productShipping: formData.productShipping,
          productDeliveryTime: formData.productDeliveryTime
        }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Análise concluída!",
        description: "Insights competitivos gerados com sucesso",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível realizar a análise competitiva",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return "text-success";
    if (numScore >= 6) return "text-warning";
    return "text-danger";
  };

  const getScoreIcon = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return CheckCircle;
    if (numScore >= 6) return AlertCircle;
    return TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Análise de Concorrência
          </CardTitle>
          <CardDescription>
            Compare seu produto com concorrentes e receba insights inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productTitle">Título do Produto *</Label>
              <Input
                id="productTitle"
                placeholder="Ex: iPhone 15 Pro Max 256GB Titânio"
                value={formData.productTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, productTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Preço (R$) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                placeholder="Ex: 7599.99"
                value={formData.productPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, productPrice: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productSales">Vendas Realizadas</Label>
              <Input
                id="productSales"
                type="number"
                placeholder="Ex: 150"
                value={formData.productSales}
                onChange={(e) => setFormData(prev => ({ ...prev, productSales: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productShipping">Tipo de Frete</Label>
              <select
                id="productShipping"
                className="w-full p-2 border border-border rounded-md bg-background"
                value={formData.productShipping}
                onChange={(e) => setFormData(prev => ({ ...prev, productShipping: e.target.value }))}
              >
                <option value="Frete grátis">Frete grátis</option>
                <option value="Frete pago">Frete pago</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDeliveryTime">Prazo de Entrega</Label>
            <Input
              id="productDeliveryTime"
              placeholder="Ex: 3 dias úteis"
              value={formData.productDeliveryTime}
              onChange={(e) => setFormData(prev => ({ ...prev, productDeliveryTime: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleAnalysis} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisando concorrentes...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Iniciar Análise Competitiva
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Produtos</CardTitle>
              <CardDescription>
                Seu produto vs. {result.competitors.length} concorrentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Product */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Seu Produto</Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{result.userProduct.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span><strong>Preço:</strong> R$ {result.userProduct.price.toFixed(2)}</span>
                    <span><strong>Vendas:</strong> {result.userProduct.sales}</span>
                    <span><strong>Frete:</strong> {result.userProduct.shipping}</span>
                    <span><strong>Entrega:</strong> {result.userProduct.deliveryTime}</span>
                  </div>
                </div>

                {/* Competitors */}
                {result.competitors.map((competitor, index) => (
                  <div key={index} className="p-4 bg-muted/30 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Concorrente {index + 1}</Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">{competitor.title}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span><strong>Preço:</strong> R$ {competitor.price.toFixed(2)}</span>
                      <span><strong>Vendas:</strong> {competitor.sales}</span>
                      <span><strong>Frete:</strong> {competitor.shipping}</span>
                      <span><strong>Entrega:</strong> {competitor.deliveryTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Insights Inteligentes
              </CardTitle>
              <CardDescription>
                Análise gerada por IA baseada na comparação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {React.createElement(getScoreIcon(result.analysis.score_competitividade), {
                    className: `w-5 h-5 ${getScoreColor(result.analysis.score_competitividade)}`
                  })}
                  <span className="font-medium">Score Competitivo:</span>
                </div>
                <Badge className={getScoreColor(result.analysis.score_competitividade)}>
                  {result.analysis.score_competitividade}/10
                </Badge>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-medium mb-2">Resumo Executivo</h4>
                <p className="text-sm text-muted-foreground">{result.analysis.resumo}</p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-medium mb-2 text-success">Pontos Fortes</h4>
                <ul className="space-y-1">
                  {result.analysis.pontos_fortes.map((point, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="font-medium mb-2 text-danger">Pontos Fracos</h4>
                <ul className="space-y-1">
                  {result.analysis.pontos_fracos.map((point, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-danger mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-2">Recomendações</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Preço:</strong> {result.analysis.recomendacoes.preco}
                  </div>
                  <div className="text-sm">
                    <strong>Título:</strong> {result.analysis.recomendacoes.titulo}
                  </div>
                  <div className="text-sm">
                    <strong>Frete:</strong> {result.analysis.recomendacoes.frete}
                  </div>
                  <div className="text-sm">
                    <strong>Geral:</strong> {result.analysis.recomendacoes.geral}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}