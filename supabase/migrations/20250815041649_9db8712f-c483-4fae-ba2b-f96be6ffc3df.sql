-- Add invitation_token field to team_members table
ALTER TABLE public.team_members 
ADD COLUMN invitation_token TEXT UNIQUE;

-- Create index for faster token lookups
CREATE INDEX idx_team_members_invitation_token ON public.team_members(invitation_token);