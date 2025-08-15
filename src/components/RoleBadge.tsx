import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, User } from 'lucide-react';

interface RoleBadgeProps {
  className?: string;
}

export function RoleBadge({ className }: RoleBadgeProps) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserRole();
  }, []);

  const getCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setRole(profile?.role || 'user');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'super_admin':
        return (
          <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
            <Crown className="h-3 w-3" />
            Super Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
            <User className="h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  if (!role) return null;

  return getRoleBadge();
}