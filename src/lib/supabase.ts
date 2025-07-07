import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface QRCode {
  id: string
  user_id: string
  title: string
  type: 'url' | 'text' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'event' | 'crypto'
  content: string
  short_url: string
  design_settings: Record<string, unknown>
  advanced_settings?: Record<string, unknown>
  scan_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QRScan {
  id: string
  qr_code_id: string
  scan_id: string
  ip_address: string
  user_agent: string
  country: string
  city: string
  latitude?: number
  longitude?: number
  blocked?: boolean
  block_reason?: string
  scanned_at: string
}

export interface QRAccessRestriction {
  id: string
  qr_code_id: string
  restriction_type: 'geo' | 'time' | 'password' | 'scan_limit'
  restriction_data: Record<string, unknown>
  created_at: string
}

export interface QRSecurityEvent {
  id: string
  qr_code_id: string
  event_type: 'blocked_scan' | 'failed_password' | 'geo_violation' | 'time_violation' | 'scan_limit_exceeded' | 'qr_created'
  event_data?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  subscription_tier: 'free' | 'premium'
  created_at: string
} 