import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Key, Link, Globe } from 'lucide-react';

interface MLTestResult {
  success: boolean;
  credentials: {
    hasClientId: boolean;
    hasClientSecret: boolean;
    clientIdPrefix: string;
  };
  mlApiConnectivity: {
    status: number;
    working: boolean;
  };
  config: {
    redirectUri: string;
    authUrl: string;
  };
  timestamp: string;
  error?: string;
}

export function MLCredentialsTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<MLTestResult | null>(null);

  const testCredentials = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-ml-credentials');
      
      if (error) {
        console.error('Erro ao testar credenciais:', error);
        toast.error('Erro ao testar credenciais');
        setResult({
          success: false,
          error: error.message,
          credentials: { hasClientId: false, hasClientSecret: false, clientIdPrefix: '' },
          mlApiConnectivity: { status: 0, working: false },
          config: { redirectUri: '', authUrl: '' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      setResult(data);
      
      if (data.success) {
        toast.success('Credenciais do ML verificadas com sucesso!');
      } else {
        toast.error('Problema com as credenciais do ML');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado ao testar credenciais');
      setResult({
        success: false,
        error: 'Erro inesperado',
        credentials: { hasClientId: false, hasClientSecret: false, clientIdPrefix: '' },
        mlApiConnectivity: { status: 0, working: false },
        config: { redirectUri: '', authUrl: '' },
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return condition ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        {trueText}
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        {falseText}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Teste de Credenciais do Mercado Livre
        </CardTitle>
        <CardDescription>
          Verifique se as credenciais do ML estão funcionando corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testCredentials} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <Clock className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          {testing ? 'Testando...' : 'Testar Credenciais'}
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status Geral:</span>
              {getStatusBadge(result.success, 'Funcionando', 'Com Problemas')}
            </div>

            {result.success && (
              <>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Credenciais:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Client ID:</span>
                      {getStatusBadge(result.credentials.hasClientId, 'Configurado', 'Ausente')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Client Secret:</span>
                      {getStatusBadge(result.credentials.hasClientSecret, 'Configurado', 'Ausente')}
                    </div>
                  </div>
                  
                  {result.credentials.hasClientId && (
                    <div className="text-xs text-muted-foreground">
                      Client ID: <code>{result.credentials.clientIdPrefix}</code>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Conectividade com ML API:</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span>Status da API:</span>
                    {getStatusBadge(result.mlApiConnectivity.working, `HTTP ${result.mlApiConnectivity.status}`, `Erro ${result.mlApiConnectivity.status}`)}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Configuração:</h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-medium">Redirect URI:</span>
                      <br />
                      <code className="text-muted-foreground break-all">{result.config.redirectUri}</code>
                    </div>
                  </div>
                </div>
              </>
            )}

            {result.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-800">
                  <strong>Erro:</strong> {result.error}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Último teste: {new Date(result.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}