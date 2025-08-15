import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RefreshCw, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  invited_by: string;
  invitation_status: string;
  created_at: string;
  updated_at: string;
  invited_at: string;
  expires_at: string;
}

export function TeamManagement() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar membros da equipe",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (existingMember) {
        toast({
          title: "Erro",
          description: "Este e-mail já foi convidado",
          variant: "destructive",
        });
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate secure invitation token
      const invitationToken = crypto.randomUUID();

      // Insert new team member with token
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          invited_by: user.id,
          invitation_status: 'pendente',
          invitation_token: invitationToken
        });

      if (insertError) throw insertError;

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          invitationToken: invitationToken
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't throw here, just log - the member was still added
      }

      toast({
        title: "Sucesso!",
        description: "Convite enviado com sucesso",
      });

      setName("");
      setEmail("");
      fetchTeamMembers();

    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar convite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ invitation_status: 'removido' })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Membro removido da equipe",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro",
        variant: "destructive",
      });
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    try {
      // Generate new invitation token
      const newInvitationToken = crypto.randomUUID();

      // Update member with new token and timestamps
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ 
          invitation_token: newInvitationToken,
          invited_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', member.id);

      if (updateError) throw updateError;

      // Send new invitation email
      const { error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          name: member.name,
          email: member.email,
          invitationToken: newInvitationToken
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Convite reenviado com sucesso",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error resending invite:', error);
      toast({
        title: "Erro",
        description: "Erro ao reenviar convite",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Pendente</Badge>;
      case 'aceito':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Ativo</Badge>;
      case 'removido':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Removido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Membros da Equipe</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Convidar Novo Membro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do membro</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite o e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Enviando..." : "Convidar Membro"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Membros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Membros Existentes</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTeamMembers}
                disabled={isLoadingMembers}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingMembers ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMembers ? (
              <div className="text-center text-muted-foreground">Carregando...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Nenhum membro convidado ainda
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Convidado em {format(new Date(member.invited_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.invitation_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {member.invitation_status === 'pendente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(member)}
                            >
                              Reenviar
                            </Button>
                          )}
                          {member.invitation_status !== 'removido' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}