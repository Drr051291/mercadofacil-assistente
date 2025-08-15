import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Crown, UserPlus, Shield, Users, History } from 'lucide-react';

interface User {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  old_role: string | null;
  new_role: string;
  changed_by: string;
  changed_at: string;
  reason: string | null;
  user_email?: string;
  changed_by_email?: string;
}

export function SuperAdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin' | 'super_admin'>('user');
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    checkSuperAdminStatus();
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const checkSuperAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setIsSuperAdmin(profile?.role === 'super_admin');
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('role_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const changeUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Função do usuário alterada para ${newRole}`
      });

      fetchUsers();
      fetchAuditLogs();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addNewUser = async () => {
    if (!newUserEmail || !newUserName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you would create the user through Supabase Auth
      // For now, we'll just show a message
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A criação de novos usuários será implementada em breve",
        variant: "default"
      });

      setShowAddUser(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('user');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="default" className="bg-purple-600"><Crown className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      default:
        return <Badge variant="outline"><Users className="h-3 w-3 mr-1" />Usuário</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">Esta área é exclusiva para Super Administradores.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Gerenciamento de Funções
          </CardTitle>
          <CardDescription>
            Gerencie funções dos usuários e adicione novos colaboradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="font-medium">Total de usuários:</span> {users.length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Admins:</span> {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Super Admins:</span> {users.filter(u => u.role === 'super_admin').length}
              </div>
            </div>
            
            <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Adicione um novo colaborador ao sistema
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Função</Label>
                    <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addNewUser} className="w-full">
                    Adicionar Usuário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando usuários...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função Atual</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || 'Não informado'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: any) => changeUserRole(user.user_id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Log de Auditoria
          </CardTitle>
          <CardDescription>
            Histórico de alterações de funções dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma alteração registrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função Anterior</TableHead>
                  <TableHead>Nova Função</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user_id}</TableCell>
                    <TableCell>
                      {log.old_role ? getRoleBadge(log.old_role) : 'N/A'}
                    </TableCell>
                    <TableCell>{getRoleBadge(log.new_role)}</TableCell>
                    <TableCell>{formatDate(log.changed_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}