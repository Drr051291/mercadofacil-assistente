import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Bell, Send, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
}

export function AdminNotifications() {
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setIsAdmin(['admin', 'super_admin'].includes(profile?.role || 'user'));
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, email, name')
      .order('email');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data?.map(user => ({
      id: user.user_id,
      email: user.email || '',
      name: user.name || undefined
    })) || []);
  };

  const sendNotification = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notifications')
        .insert({
          message: message.trim(),
          user_id: selectedUser === 'all' ? null : selectedUser,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: selectedUser === 'all' 
          ? "Notificação enviada para todos os usuários" 
          : "Notificação enviada para o usuário selecionado"
      });

      setMessage('');
      setSelectedUser('all');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar notificação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Acesso negado. Esta funcionalidade é restrita a administradores.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Enviar Notificações
        </CardTitle>
        <CardDescription>
          Envie mensagens para usuários específicos ou para todos os usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Destinatário</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o destinatário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Todos os usuários
                </div>
              </SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name ? `${user.name} (${user.email})` : user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Digite sua mensagem aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            {message.length}/500 caracteres
          </p>
        </div>

        <Button 
          onClick={sendNotification} 
          disabled={loading || !message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Enviando...' : 'Enviar Notificação'}
        </Button>
      </CardContent>
    </Card>
  );
}