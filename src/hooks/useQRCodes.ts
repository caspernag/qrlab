import { useState, useEffect, useCallback } from 'react';
import { supabase, QRCode } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useQRCodes() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const { user } = useAuth();
  
  

  const ensureUserProfile = async () => {
    if (!user) return false;

    try {
      // Check if user profile exists
      const { data: profile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking profile:', selectError);
        throw selectError;
      }

      if (!profile) {
        console.log('Profile not found, creating one...');
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || 'User'
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        console.log('Profile created successfully');
      }
      
      return true;
    } catch (error: unknown) {
      console.error('Error ensuring user profile:', error);
      return false;
    }
  };

  const createQRCode = async (qrCodeData: Partial<QRCode>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Starting QR code creation process...');
      console.log('User ID:', user.id);
      console.log('Input data:', qrCodeData);

      // Ensure user profile exists first
      const profileExists = await ensureUserProfile();
      if (!profileExists) {
        throw new Error('Failed to ensure user profile exists');
      }

      // Generate a simple unique short ID
      const shortId = Math.random().toString(36).substr(2, 8);
      console.log('Generated short ID:', shortId);
      
      // Create a simplified data structure that matches the schema exactly
      const insertData = {
        user_id: user.id,
        title: qrCodeData.title || 'Untitled QR Code',
        type: qrCodeData.type || 'url',
        content: qrCodeData.content || '',
        short_url: `qrlab.no/${shortId}`,
        design_settings: qrCodeData.design_settings || {},
        advanced_settings: qrCodeData.advanced_settings || {},
        scan_count: 0,
        is_active: true
      };

      console.log('Final insert data:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabase
        .from('qr_codes')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error hint:', error.hint);
        console.error('Error details:', error.details);
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }

      if (!data) {
        throw new Error('No data returned from insert operation');
      }

      console.log('QR code created successfully:', data);

      // Update local state immediately
      setQRCodes(current => [data, ...current]);
      return data;
    } catch (error: unknown) {
      console.error('Error in createQRCode function:', error);
      console.error('Error type:', typeof error);
      
      const err = error as { message?: string; error_description?: string; constructor?: { name?: string }; stack?: string };
      console.error('Error constructor:', err?.constructor?.name);
      console.error('Error message:', err?.message);
      console.error('Error stack:', err?.stack);
      console.error('Full error serialized:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      // Re-throw with more specific error message
      const errorMessage = err?.message || err?.error_description || 'Unknown database error';
      throw new Error(`Failed to create QR code: ${errorMessage}`);
    }
  };

  const updateQRCode = async (id: string, updates: Partial<QRCode>) => {
    try {
      console.log('Updating QR code:', id, updates);
      
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('qr_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Update failed: ${error.message}`);
      }
      
      // Update local state immediately
      setQRCodes(current => 
        current.map(qr => qr.id === id ? data : qr)
      );
      return data;
    } catch (error: unknown) {
      console.error('Error updating QR code:', error);
      const err = error as { message?: string };
      throw new Error(`Failed to update QR code: ${err?.message || 'Unknown error'}`);
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      console.log('Deleting QR code:', id);
      
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }
      
      // Update local state immediately
      setQRCodes(current => current.filter(qr => qr.id !== id));
    } catch (error: unknown) {
      console.error('Error deleting QR code:', error);
      const err = error as { message?: string };
      throw new Error(`Failed to delete QR code: ${err?.message || 'Unknown error'}`);
    }
  };

  const getQRCodeById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          qr_access_restrictions (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
    }
  };

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Refetching QR codes for user:', user.id);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      
      console.log('Refetched QR codes:', data);
      setQRCodes(data || []);
    } catch (error: unknown) {
      console.error('Error refetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // FIXED: Use user directly in dependency instead of fetchQRCodes to break dependency chain
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    // Call refetch on initial load
    refetch();
  }, [user?.id, refetch]); // Only depend on user ID and refetch function

  // REALTIME DISABLED: Causing refresh issues, using manual refresh instead
  useEffect(() => {
    setRealtimeConnected(false);
  }, []);

  return {
    qrCodes,
    loading,
    realtimeConnected,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    getQRCodeById,
    refetch
  };
} 