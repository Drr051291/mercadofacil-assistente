import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Users } from 'lucide-react';

interface UserRole {
  role: 'user' | 'admin' | 'super_admin';
}

export function RoleBadge() {
  const [userRole, setUserRole] = useState<UserRole['role'] | null>(null);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setUserRole(profile?.role || 'user');
  };

  if (!userRole) return null;

  const getRoleBadge = () => {
    switch (userRole) {
      case 'super_admin':
        return (
          <Badge variant="default" className="bg-gradient-primary text-white">
            <Crown className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Usuário
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getRoleBadge()}
    </div>
  );
}