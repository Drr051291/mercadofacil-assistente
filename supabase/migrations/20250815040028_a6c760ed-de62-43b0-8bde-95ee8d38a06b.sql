-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_status TEXT NOT NULL DEFAULT 'pendente' CHECK (invitation_status IN ('pendente', 'aceito', 'removido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team members
CREATE POLICY "Users can view team members they invited" 
ON public.team_members 
FOR SELECT 
USING (auth.uid() = invited_by);

CREATE POLICY "Users can create team invitations" 
ON public.team_members 
FOR INSERT 
WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update team members they invited" 
ON public.team_members 
FOR UPDATE 
USING (auth.uid() = invited_by);

CREATE POLICY "Users can delete team members they invited" 
ON public.team_members 
FOR DELETE 
USING (auth.uid() = invited_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_team_members_invited_by ON public.team_members(invited_by);
CREATE INDEX idx_team_members_email ON public.team_members(email);