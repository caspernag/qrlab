"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function TestTrackingPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const log = (message: string) => {
    console.log(message);
    setResults(prev => [...prev, message]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    log('🔍 Testing database connection...');
    
    try {
      // Test reading from qr_scans table
      const { data: scans, error: readError } = await supabase
        .from('qr_scans')
        .select('*')
        .limit(5);
      
      if (readError) {
        log(`❌ Read error: ${readError.message}`);
        log(`Code: ${readError.code}`);
        if (readError.details) log(`Details: ${readError.details}`);
        if (readError.hint) log(`Hint: ${readError.hint}`);
      } else {
        log(`✅ Read success. Found ${scans.length} existing scans`);
      }
      
      // Test inserting a scan
      log('📝 Testing insert...');
      const testScan = {
        qr_code_id: 'test-qr-id',
        scan_id: 'test-scan-' + Date.now(),
        ip_address: '127.0.0.1',
        user_agent: 'test-browser',
        country: 'test-country',
        city: 'test-city',
        scanned_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('qr_scans')
        .insert(testScan)
        .select();
      
      if (insertError) {
        log(`❌ Insert error: ${insertError.message}`);
        log(`Code: ${insertError.code}`);
        if (insertError.details) log(`Details: ${insertError.details}`);
        if (insertError.hint) log(`Hint: ${insertError.hint}`);
      } else {
        log(`✅ Insert success: ${JSON.stringify(insertData, null, 2)}`);
      }
      
    } catch (error) {
      log(`❌ Unexpected error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testTrackingAPI = async () => {
    setLoading(true);
    log('🌐 Testing tracking API...');
    
    try {
      const testUrl = '/api/track?type=text&value=test&scan_id=api-test-' + Date.now() + '&qr_id=test-qr-id';
      log(`📡 Calling: ${testUrl}`);
      
      const response = await fetch(testUrl);
      const data = await response.json();
      
      log(`✅ API Response: ${JSON.stringify(data, null, 2)}`);
      
      if (data.tracked) {
        log('🎉 SUCCESS: Tracking worked!');
      } else {
        log('❌ FAILED: Tracking did not work');
      }
      
    } catch (error) {
      log(`❌ API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTableStructure = async () => {
    setLoading(true);
    log('🔍 Checking table structure...');
    
    try {
      // Try to get table info by attempting to select with scan_id
      const { error } = await supabase
        .from('qr_scans')
        .select('scan_id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('column "scan_id" does not exist')) {
          log('❌ PROBLEM FOUND: scan_id column does not exist!');
          log('💡 You need to run the database migration to add the scan_id column.');
        } else {
          log(`❌ Error: ${error.message}`);
        }
      } else {
        log('✅ scan_id column exists');
      }
      
    } catch (error) {
      log(`❌ Unexpected error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 QR Tracking System Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={checkTableStructure} disabled={loading}>
              Check Table Structure
            </Button>
            <Button onClick={testDatabaseConnection} disabled={loading}>
              Test Database
            </Button>
            <Button onClick={testTrackingAPI} disabled={loading}>
              Test API
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Running tests...</p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            {results.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click a button above to start.</p>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="font-mono text-sm whitespace-pre-wrap">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 