import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MinhaConta() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para deletar sua conta."
        });
        return;
      }

      const { error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Error deleting account:', error);
        toast({
          variant: "destructive",
          title: "Erro ao deletar conta",
          description: "Ocorreu um erro ao tentar deletar sua conta. Tente novamente."
        });
      } else {
        toast({
          title: "Conta deletada",
          description: "Sua conta foi deletada com sucesso."
        });
        
        // Sign out and redirect to auth page
        await supabase.auth.signOut();
        navigate("/auth");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente."
      });
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas configurações de conta e preferências
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>
              Suas informações básicas de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Outras configurações de conta podem ser adicionadas aqui futuramente.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            </div>
            <CardDescription className="text-destructive/80">
              Ações irreversíveis que afetam permanentemente sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background">
              <div>
                <h4 className="font-medium text-foreground">Deletar Conta</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Remova permanentemente sua conta e todos os dados associados
                </p>
              </div>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="ml-4"
                    aria-label="Deletar conta permanentemente"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar Conta
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Tem certeza?
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Esta ação irá deletar permanentemente sua conta e todos os dados associados. 
                      <strong className="block mt-2">Esta ação não pode ser desfeita.</strong>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isDeleting}
                      aria-label="Cancelar deleção da conta"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      aria-label="Confirmar deleção da conta"
                    >
                      {isDeleting ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-r-transparent" />
                          Deletando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar Conta
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}