-- Fix qr_scans table schema
-- Add scan_id column that is required by the tracking system
ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS scan_id TEXT;

-- Create index for scan_id for better performance
CREATE INDEX IF NOT EXISTS idx_qr_scans_scan_id ON qr_scans(scan_id);

-- Add RLS policy for inserting scan data (anonymous users should be able to insert)
DROP POLICY IF EXISTS "Allow anonymous scan inserts" ON qr_scans;
CREATE POLICY "Allow anonymous scan inserts" ON qr_scans 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Also ensure authenticated users can insert their own scan data
DROP POLICY IF EXISTS "Allow authenticated scan inserts" ON qr_scans;
CREATE POLICY "Allow authenticated scan inserts" ON qr_scans 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Update the existing select policy to be more permissive for debugging
DROP POLICY IF EXISTS "Users can view scans of own QR codes" ON qr_scans;
CREATE POLICY "Users can view scans of own QR codes" ON qr_scans 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM qr_codes 
  WHERE qr_codes.id = qr_scans.qr_code_id 
  AND qr_codes.user_id = auth.uid()
)); 