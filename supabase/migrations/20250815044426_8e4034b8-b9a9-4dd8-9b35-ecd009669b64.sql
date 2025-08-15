-- Create table for storing competitive analysis data
CREATE TABLE public.competitive_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ml_listing_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  user_price DECIMAL(10,2) NOT NULL,
  user_sold_quantity INTEGER DEFAULT 0,
  user_shipping_free BOOLEAN DEFAULT false,
  user_delivery_days INTEGER,
  analysis_data JSONB,
  ai_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for competitor data
CREATE TABLE public.competitor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monitoring_id UUID NOT NULL REFERENCES public.competitive_monitoring(id) ON DELETE CASCADE,
  competitor_title TEXT NOT NULL,
  competitor_price DECIMAL(10,2) NOT NULL,
  competitor_sold_quantity INTEGER DEFAULT 0,
  competitor_delivery_days INTEGER,
  competitor_shipping_free BOOLEAN DEFAULT false,
  competitor_reputation_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.competitive_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_data ENABLE ROW LEVEL SECURITY;

-- Create policies for competitive_monitoring
CREATE POLICY "Users can view their own monitoring data" 
ON public.competitive_monitoring 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monitoring data" 
ON public.competitive_monitoring 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitoring data" 
ON public.competitive_monitoring 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitoring data" 
ON public.competitive_monitoring 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for competitor_data
CREATE POLICY "Users can view competitor data for their monitoring" 
ON public.competitor_data 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.competitive_monitoring 
    WHERE id = competitor_data.monitoring_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create competitor data for their monitoring" 
ON public.competitor_data 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.competitive_monitoring 
    WHERE id = competitor_data.monitoring_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update competitor data for their monitoring" 
ON public.competitor_data 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.competitive_monitoring 
    WHERE id = competitor_data.monitoring_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete competitor data for their monitoring" 
ON public.competitor_data 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.competitive_monitoring 
    WHERE id = competitor_data.monitoring_id 
    AND user_id = auth.uid()
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_competitive_monitoring_updated_at
BEFORE UPDATE ON public.competitive_monitoring
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_competitive_monitoring_user_id ON public.competitive_monitoring(user_id);
CREATE INDEX idx_competitive_monitoring_ml_listing_id ON public.competitive_monitoring(ml_listing_id);
CREATE INDEX idx_competitor_data_monitoring_id ON public.competitor_data(monitoring_id);