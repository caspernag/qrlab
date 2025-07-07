// QR Code Tracking Utilities

// For testing: use external webhook
const TRACKING_BASE_URL = 'https://feasible-troll-epic.ngrok-free.app/webhook/qrlab';
/**
 * Generate a unique scan ID for tracking
 */
export function generateScanId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Generate tracking URL for QR code content
 */
export function generateTrackingURL(qrCode: {
  id: string;
  type: string;
  content: string;
}): string {
  const scanId = generateScanId();
  const params = new URLSearchParams({
    type: qrCode.type,
    value: qrCode.content,
    scan_id: scanId,
    qr_id: qrCode.id
  });
  
  return `${TRACKING_BASE_URL}?${params.toString()}`;
}

/**
 * Get the actual content URL/value that should be used in QR code generation
 * This replaces the direct content with a tracking URL
 */
export function getTrackableContent(qrCode: {
  id: string;
  type: string;
  content: string;
  design_settings?: Record<string, unknown>;
}): string {
  // Check if tracking is enabled (default to true)
  const trackingEnabled = qrCode.design_settings?.trackAnalytics !== false;
  
  if (!trackingEnabled) {
    // Return original content if tracking is disabled
    return qrCode.content;
  }
  
  // Return tracking URL for all types
  return generateTrackingURL(qrCode);
}

/**
 * Parse tracking data from URL parameters
 */
export function parseTrackingData(url: string): {
  type: string;
  value: string;
  scanId: string;
  qrId: string;
} | null {
  try {
    const urlObj = new URL(url);
    const type = urlObj.searchParams.get('type');
    const value = urlObj.searchParams.get('value');
    const scanId = urlObj.searchParams.get('scan_id');
    const qrId = urlObj.searchParams.get('qr_id');
    
    if (!type || !value || !scanId || !qrId) {
      return null;
    }
    
    return { type, value, scanId, qrId };
  } catch {
    return null;
  }
}

/**
 * Log QR code scan to database
 */
export async function logQRScan(scanData: {
  qrCodeId: string;
  scanId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}) {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('Attempting to log QR scan:', {
      qrCodeId: scanData.qrCodeId,
      scanId: scanData.scanId,
      ipAddress: scanData.ipAddress
    });
    
    const insertData = {
      qr_code_id: scanData.qrCodeId,
      scan_id: scanData.scanId,
      ip_address: scanData.ipAddress || 'unknown',
      user_agent: scanData.userAgent || 'unknown',
      country: scanData.country || 'unknown',
      city: scanData.city || 'unknown',
      latitude: scanData.latitude,
      longitude: scanData.longitude,
      scanned_at: new Date().toISOString()
    };
    
    console.log('Insert data:', insertData);
    
    const { data, error } = await supabase
      .from('qr_scans')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    
    console.log('Successfully inserted scan:', data);
    
    // Also increment scan count on the QR code
    const { error: rpcError } = await supabase.rpc('increment_scan_count', { qr_code_id: scanData.qrCodeId });
    if (rpcError) {
      console.error('Error incrementing scan count:', rpcError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in logQRScan:', error);
    return false;
  }
} 