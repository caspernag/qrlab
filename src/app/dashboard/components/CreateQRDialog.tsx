"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useQRCodes } from '@/hooks/useQRCodes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Loader2, 
  QrCode, 
  Palette, 
  Settings, 
  MapPin, 
  Calendar, 
  Shield, 
  Eye, 
  Clock,
  Fingerprint,
  Globe,
  Lock
} from "lucide-react";

// Enhanced interfaces for advanced features
interface QRResult {
  url: string;
  data: string;
  type: string;
  options: AdvancedQROptions;
}

interface AdvancedQROptions {
  // Visual settings
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: string;
  logoUrl?: string;
  logoSize?: number;
  
  // Security & Access Control
  passwordProtected: boolean;
  password?: string;
  scanLimit?: number;
  maxScansPerDay?: number;
  
  // Geographic restrictions
  geoLocked: boolean;
  allowedCountries?: string[];
  allowedCities?: string[];
  geoRadius?: number; // in kilometers
  geoCenter?: { lat: number; lng: number };
  
  // Time restrictions
  timeRestricted: boolean;
  validFrom?: string;
  validUntil?: string;
  allowedTimeRanges?: Array<{ start: string; end: string; days: string[] }>;
  
  // Analytics & Tracking
  trackAnalytics: boolean;
  requireUserAgent: boolean;
  blockSuspiciousActivity: boolean;
  
  // Advanced features
  dynamicContent: boolean;
  webhookUrl?: string;
  customRedirect: boolean;
  redirectDelay?: number;
}

interface GeoLocation {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

class AdvancedQRCodeGenerator {
  public options: AdvancedQROptions;
  public apiEndpoints: { qrServer: string; quickChart: string };

  constructor(options: Partial<AdvancedQROptions> = {}) {
    this.options = {
      size: 256,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
      passwordProtected: false,
      geoLocked: false,
      timeRestricted: false,
      trackAnalytics: true,
      requireUserAgent: false,
      blockSuspiciousActivity: true,
      dynamicContent: false,
      customRedirect: false,
      ...options
    };
    
    this.apiEndpoints = {
      qrServer: 'https://api.qrserver.com/v1/create-qr-code/',
      quickChart: 'https://quickchart.io/qr'
    };
  }

  formatData(type: string, data: string): string {
    switch (type) {
      case 'url':
        return data.startsWith('http') ? data : `https://${data}`;
      case 'email':
        return `mailto:${data}`;
      case 'phone':
        return `tel:${data}`;
      case 'sms':
        return `sms:${data}`;
      case 'wifi':
        const [ssid, password, security = 'WPA'] = data.split(':');
        return `WIFI:T:${security};S:${ssid};P:${password};;`;
      case 'vcard':
        return this.formatVCard(data);
      case 'event':
        return this.formatEvent(data);
      case 'text':
      default:
        return data;
    }
  }

  private formatVCard(data: string): string {
    const [name, phone, email, organization] = data.split(':');
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${organization}\nEND:VCARD`;
  }

  private formatEvent(data: string): string {
    const [title, date, location, description] = data.split(':');
    return `BEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${date}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT`;
  }



  async generateWithAPI(data: string, method = 'qrServer'): Promise<string> {
    const encodedData = encodeURIComponent(data);
    
    switch (method) {
      case 'qrServer':
        let url = `${this.apiEndpoints.qrServer}?size=${this.options.size}x${this.options.size}&data=${encodedData}&color=${this.options.foregroundColor.replace('#', '')}&bgcolor=${this.options.backgroundColor.replace('#', '')}&ecc=${this.options.errorCorrectionLevel}`;
        
        // Add logo if specified
        if (this.options.logoUrl) {
          url += `&logo=${encodeURIComponent(this.options.logoUrl)}`;
        }
        
        return url;
        
      case 'quickChart':
        return `${this.apiEndpoints.quickChart}?text=${encodedData}&size=${this.options.size}&dark=${this.options.foregroundColor.replace('#', '')}&light=${this.options.backgroundColor.replace('#', '')}`;
        
      default:
        throw new Error('Unsupported API method');
    }
  }

  async generate(type: string, rawData: string): Promise<QRResult> {
    const formattedData = this.formatData(type, rawData);
    let qrUrl: string;
    
    try {
      qrUrl = await this.generateWithAPI(formattedData, 'qrServer');
    } catch {
      try {
        qrUrl = await this.generateWithAPI(formattedData, 'quickChart');
      } catch {
        throw new Error('All QR generation methods failed');
      }
    }

    return {
      url: qrUrl,
      data: formattedData,
      type,
      options: { ...this.options }
    };
  }

  updateOptions(newOptions: Partial<AdvancedQROptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}

interface CreateQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQR?: { id: string; title: string; type: string; content: string; design_settings?: Record<string, unknown> }; // QR code to edit, undefined for new QR
}

export function CreateQRDialog({ open, onOpenChange, editingQR }: CreateQRDialogProps) {
  const { createQRCode, updateQRCode } = useQRCodes();
  
  // Form state
  const [title, setTitle] = useState("");
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState("");
  const [qrStyle, setQrStyle] = useState<AdvancedQROptions>({
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
    size: 256,
    errorCorrectionLevel: "M",
    passwordProtected: false,
    geoLocked: false,
    timeRestricted: false,
    trackAnalytics: true,
    requireUserAgent: false,
    blockSuspiciousActivity: true,
    dynamicContent: false,
    customRedirect: false
  });
  
  // Advanced settings state
  const [geoSettings, setGeoSettings] = useState({
    allowedCountries: [] as string[],
    allowedCities: [] as string[],
    geoRadius: 10,
    geoCenter: null as { lat: number; lng: number } | null
  });
  
  const [timeSettings, setTimeSettings] = useState({
    validFrom: "",
    validUntil: "",
    allowedTimeRanges: [] as Array<{ start: string; end: string; days: string[] }>
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    password: "",
    scanLimit: 0,
    maxScansPerDay: 0
  });

  // WiFi specific settings
  const [wifiSettings, setWifiSettings] = useState({
    ssid: "",
    password: "",
    security: "WPA2"
  });

  // Text specific settings
  const [textSettings, setTextSettings] = useState({
    title: "",
    content: ""
  });

  // vCard specific settings
  const [vcardSettings, setVcardSettings] = useState({
    name: "",
    phone: "",
    email: "",
    company: ""
  });

  // Generator state
  const [generator, setGenerator] = useState<AdvancedQRCodeGenerator | null>(null);
  const [qrResult, setQrResult] = useState<QRResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);

  // Initialize generator
  useEffect(() => {
    setGenerator(new AdvancedQRCodeGenerator(qrStyle));
  }, [qrStyle]);

  // Load editing data when editingQR changes
  useEffect(() => {
    if (editingQR && open) {
      setTitle(editingQR.title || "");
      setQrType(editingQR.type || "url");
      setQrData(editingQR.content || "");
      
      // Load design settings if available
      const designSettings = editingQR.design_settings || {};
      setQrStyle({
        foregroundColor: typeof designSettings.foregroundColor === 'string' ? designSettings.foregroundColor : "#000000",
        backgroundColor: typeof designSettings.backgroundColor === 'string' ? designSettings.backgroundColor : "#ffffff",
        size: typeof designSettings.size === 'number' ? designSettings.size : 256,
        errorCorrectionLevel: typeof designSettings.errorCorrectionLevel === 'string' ? designSettings.errorCorrectionLevel : "M",
        passwordProtected: typeof designSettings.passwordProtected === 'boolean' ? designSettings.passwordProtected : false,
        geoLocked: typeof designSettings.geoLocked === 'boolean' ? designSettings.geoLocked : false,
        timeRestricted: typeof designSettings.timeRestricted === 'boolean' ? designSettings.timeRestricted : false,
        trackAnalytics: typeof designSettings.trackAnalytics === 'boolean' ? designSettings.trackAnalytics : true,
        requireUserAgent: typeof designSettings.requireUserAgent === 'boolean' ? designSettings.requireUserAgent : false,
        blockSuspiciousActivity: typeof designSettings.blockSuspiciousActivity === 'boolean' ? designSettings.blockSuspiciousActivity : true,
        dynamicContent: typeof designSettings.dynamicContent === 'boolean' ? designSettings.dynamicContent : false,
        customRedirect: typeof designSettings.customRedirect === 'boolean' ? designSettings.customRedirect : false
      });

      // Load security settings
      setSecuritySettings({
        password: typeof designSettings.password === 'string' ? designSettings.password : "",
        scanLimit: typeof designSettings.scanLimit === 'number' ? designSettings.scanLimit : 0,
        maxScansPerDay: typeof designSettings.maxScansPerDay === 'number' ? designSettings.maxScansPerDay : 0
      });

      // Load geo settings
      setGeoSettings({
        allowedCountries: Array.isArray(designSettings.allowedCountries) ? designSettings.allowedCountries : [],
        allowedCities: Array.isArray(designSettings.allowedCities) ? designSettings.allowedCities : [],
        geoRadius: typeof designSettings.geoRadius === 'number' ? designSettings.geoRadius : 10,
        geoCenter: designSettings.geoCenter && typeof designSettings.geoCenter === 'object' && 
                   typeof (designSettings.geoCenter as { lat: number; lng: number }).lat === 'number' && 
                   typeof (designSettings.geoCenter as { lat: number; lng: number }).lng === 'number' 
                   ? designSettings.geoCenter as { lat: number; lng: number } : null
      });

      // Load time settings
      setTimeSettings({
        validFrom: typeof designSettings.validFrom === 'string' ? designSettings.validFrom : "",
        validUntil: typeof designSettings.validUntil === 'string' ? designSettings.validUntil : "",
        allowedTimeRanges: Array.isArray(designSettings.allowedTimeRanges) ? designSettings.allowedTimeRanges : []
      });

      // Load WiFi settings if it's a WiFi QR code
      if (editingQR.type === "wifi" && editingQR.content) {
        // Parse existing WiFi data: WIFI:T:WPA2;S:MyNetwork;P:password;;
        const wifiMatch = editingQR.content.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/);
        if (wifiMatch) {
          setWifiSettings({
            security: wifiMatch[1] || "WPA2",
            ssid: wifiMatch[2] || "",
            password: wifiMatch[3] || ""
          });
        }
      }

      // Load Text settings if it's a Text QR code
      if (editingQR.type === "text" && editingQR.content) {
        // Parse existing text data: title###content
        const parts = editingQR.content.split('###');
        if (parts.length >= 2) {
          setTextSettings({
            title: parts[0] || "",
            content: parts[1] || ""
          });
        } else {
          // If no separator found, treat as content only
          setTextSettings({
            title: "",
            content: editingQR.content
          });
        }
      }

      // Load vCard settings if it's a vCard QR code
      if (editingQR.type === "vcard" && editingQR.content) {
        // Parse existing vCard data: BEGIN:VCARD\nVERSION:3.0\nFN:name\nTEL:phone\nEMAIL:email\nORG:company\nEND:VCARD
        const vcardMatch = editingQR.content.match(/FN:([^\n]*)/);
        const phoneMatch = editingQR.content.match(/TEL:([^\n]*)/);
        const emailMatch = editingQR.content.match(/EMAIL:([^\n]*)/);
        const orgMatch = editingQR.content.match(/ORG:([^\n]*)/);
        
        setVcardSettings({
          name: vcardMatch ? vcardMatch[1] : "",
          phone: phoneMatch ? phoneMatch[1] : "",
          email: emailMatch ? emailMatch[1] : "",
          company: orgMatch ? orgMatch[1] : ""
        });
      }
    }
  }, [editingQR, open]);

  // Get user's current location for geo-lock
  useEffect(() => {
    if (navigator.geolocation && qrStyle.geoLocked) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, you'd use a geocoding service
            const location: GeoLocation = {
              country: "Norge", // Placeholder
              city: "Oslo", // Placeholder
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentLocation(location);
            setGeoSettings(prev => ({
              ...prev,
              geoCenter: { lat: location.lat, lng: location.lng }
            }));
          } catch (error) {
            console.error('Error getting location details:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Kunne ikke hente posisjon for geo-lås");
        }
      );
    }
  }, [qrStyle.geoLocked]);

  // Generate QR code when data changes
  const generateQR = useCallback(async () => {
    let dataToUse = qrData.trim();
    
    // For WiFi, construct data from separate fields
    if (qrType === "wifi" && wifiSettings.ssid) {
      dataToUse = `${wifiSettings.ssid}:${wifiSettings.password}:${wifiSettings.security}`;
    }
    
    // For Text, construct data from separate fields
    if (qrType === "text" && (textSettings.title || textSettings.content)) {
      dataToUse = `${textSettings.title}###${textSettings.content}`;
    }
    
    // For vCard, construct data from separate fields
    if (qrType === "vcard" && vcardSettings.name && (vcardSettings.phone || vcardSettings.email)) {
      dataToUse = `${vcardSettings.name}:${vcardSettings.phone}:${vcardSettings.email}:${vcardSettings.company}`;
    }
    
    if (!generator || !dataToUse) {
      setQrResult(null);
      return;
    }
    
    const combinedOptions = {
      ...qrStyle,
      ...geoSettings,
      geoCenter: geoSettings.geoCenter || undefined,
      ...timeSettings,
      password: securitySettings.password,
      scanLimit: securitySettings.scanLimit || undefined,
      maxScansPerDay: securitySettings.maxScansPerDay || undefined
    };
    
    generator.updateOptions(combinedOptions);
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generator.generate(qrType, dataToUse);
      setQrResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setQrResult(null);
    } finally {
      setIsGenerating(false);
    }
  }, [generator, qrData, qrType, qrStyle, geoSettings, timeSettings, securitySettings, wifiSettings, textSettings, vcardSettings]);

  useEffect(() => {
    let hasData = false;
    if (qrType === "wifi") {
      hasData = wifiSettings.ssid.trim() !== "";
    } else if (qrType === "text") {
      hasData = textSettings.title.trim() !== "" || textSettings.content.trim() !== "";
    } else if (qrType === "vcard") {
      hasData = vcardSettings.name.trim() !== "" && (vcardSettings.phone.trim() !== "" || vcardSettings.email.trim() !== "");
    } else {
      hasData = qrData.trim() !== "";
    }
    
    if (generator && hasData) {
      generateQR();
    } else {
      setQrResult(null);
    }
  }, [generateQR, generator, qrData, qrType, wifiSettings, textSettings, vcardSettings]);

  // Handle style changes
  const handleStyleChange = useCallback((newStyle: Partial<AdvancedQROptions>) => {
    setQrStyle(prev => ({ ...prev, ...newStyle }));
  }, []);

  // Save QR code to Supabase
  const handleSave = async () => {
    if (!qrResult || !title.trim()) {
      toast.error("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    setIsSaving(true);
    try {
      // Make sure the QR type is valid
      const validTypes = ['url', 'text', 'vcard', 'wifi', 'email', 'phone', 'sms', 'event'];
      const finalType = validTypes.includes(qrType) ? qrType : 'url';

      // Structure the data more simply to avoid schema issues
      const qrCodeData = {
        title: title.trim(),
        type: finalType as 'url' | 'text' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'event',
        content: qrResult.data,
        design_settings: {
          // Basic visual settings
          foregroundColor: qrStyle.foregroundColor,
          backgroundColor: qrStyle.backgroundColor,
          size: qrStyle.size,
          errorCorrectionLevel: qrStyle.errorCorrectionLevel,
          
          // Advanced features (store as simple flags for now)
          passwordProtected: qrStyle.passwordProtected,
          geoLocked: qrStyle.geoLocked,
          timeRestricted: qrStyle.timeRestricted,
          trackAnalytics: qrStyle.trackAnalytics,
          blockSuspiciousActivity: qrStyle.blockSuspiciousActivity,
          
          // Security settings
          ...(qrStyle.passwordProtected && securitySettings.password && {
            password: securitySettings.password
          }),
          ...(securitySettings.scanLimit > 0 && {
            scanLimit: securitySettings.scanLimit
          }),
          ...(securitySettings.maxScansPerDay > 0 && {
            maxScansPerDay: securitySettings.maxScansPerDay
          }),
          
          // Geographic settings
          ...(qrStyle.geoLocked && {
            allowedCountries: geoSettings.allowedCountries,
            geoRadius: geoSettings.geoRadius,
            geoCenter: geoSettings.geoCenter
          }),
          
          // Time settings
          ...(qrStyle.timeRestricted && {
            validFrom: timeSettings.validFrom,
            validUntil: timeSettings.validUntil
          })
        }
      };

      console.log('Saving QR code with data:', qrCodeData);

      let savedQRCode;
      if (editingQR) {
        // Update existing QR code
        savedQRCode = await updateQRCode(editingQR.id, qrCodeData);
        toast.success(`QR-kode "${title.trim()}" oppdatert! 🎉`);
      } else {
        // Create new QR code
        savedQRCode = await createQRCode(qrCodeData);
        toast.success(`QR-kode "${title.trim()}" opprettet! 🎉`);
      }
      
      console.log('QR Code saved successfully with ID:', savedQRCode.id);
      handleClose();
    } catch (error: unknown) {
      console.error('Error saving QR code:', error);
      const action = editingQR ? 'oppdatere' : 'lagre';
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Kunne ikke ${action} QR-koden: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when dialog closes
  const handleClose = () => {
    setTitle("");
    setQrData("");
    setQrType("url");
    setQrStyle({
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
      size: 256,
      errorCorrectionLevel: "M",
      passwordProtected: false,
      geoLocked: false,
      timeRestricted: false,
      trackAnalytics: true,
      requireUserAgent: false,
      blockSuspiciousActivity: true,
      dynamicContent: false,
      customRedirect: false
    });
    setGeoSettings({
      allowedCountries: [],
      allowedCities: [],
      geoRadius: 10,
      geoCenter: null
    });
    setTimeSettings({
      validFrom: "",
      validUntil: "",
      allowedTimeRanges: []
    });
    setSecuritySettings({
      password: "",
      scanLimit: 0,
      maxScansPerDay: 0
    });
    setWifiSettings({
      ssid: "",
      password: "",
      security: "WPA2"
    });
    setTextSettings({
      title: "",
      content: ""
    });
    setVcardSettings({
      name: "",
      phone: "",
      email: "",
      company: ""
    });
    setQrResult(null);
    setError(null);
    onOpenChange(false);
  };

  const qrTypes = [
    { value: "url", label: "Nettside (URL)", icon: "🌐", description: "Link til en nettside" },
    { value: "text", label: "Tekst", icon: "📝", description: "Ren tekst innhold" },
    { value: "email", label: "E-post", icon: "📧", description: "E-post adresse" },
    { value: "phone", label: "Telefon", icon: "📱", description: "Telefonnummer" },
    { value: "sms", label: "SMS", icon: "💬", description: "Forhåndsutfylt SMS" },
    { value: "wifi", label: "Wi-Fi", icon: "📶", description: "Wi-Fi tilkobling" },
    { value: "vcard", label: "Visittkort", icon: "👤", description: "Kontaktinformasjon" },
    { value: "event", label: "Arrangement", icon: "📅", description: "Kalender hendelse" },
  ];

  const colorPresets = [
    { name: "Klassisk", fg: "#000000", bg: "#ffffff" },
    { name: "Blå", fg: "#1e40af", bg: "#f0f9ff" },
    { name: "Grønn", fg: "#166534", bg: "#f0fdf4" },
    { name: "Lilla", fg: "#7c3aed", bg: "#faf5ff" },
    { name: "Rød", fg: "#dc2626", bg: "#fef2f2" },
    { name: "Orange", fg: "#ea580c", bg: "#fff7ed" },
  ];

  const countries = [
    "Norge", "Sverige", "Danmark", "Finland", "Tyskland", "Frankrike", 
    "Storbritannia", "Nederland", "Belgia", "Østerrike", "Sveits", "Italia"
  ];

  const errorCorrectionLevels = [
    { value: "L", label: "Lav (7%)", description: "Raskere skanning" },
    { value: "M", label: "Medium (15%)", description: "Balansert" },
    { value: "Q", label: "Høy (25%)", description: "Mer robust" },
    { value: "H", label: "Høyest (30%)", description: "Maksimal sikkerhet" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto"
        style={{ width: '90vw', maxWidth: '1200px' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
            <QrCode className="w-5 h-5" />
            {editingQR ? 'Rediger QR-kode' : 'Avansert QR-kode generator'}
          </DialogTitle>
          <DialogDescription style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
            {editingQR 
              ? 'Endre innstillinger og design for din QR-kode'
              : 'Opprett profesjonelle QR-koder med geo-lås, tid-begrensninger og sikkerhetsfunksjoner'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Grunnleggende
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sikkerhet
            </TabsTrigger>
            <TabsTrigger value="geo" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Geo-lås
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tid
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Left Column: Settings */}
            <div className="space-y-6">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Tittel *
                        </Label>
                        <Input
                          id="title"
                          placeholder="Min avanserte QR-kode"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Type
                        </Label>
                        <Select value={qrType} onValueChange={setQrType}>
                          <SelectTrigger style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {qrTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    <span>{type.label}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{type.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Innhold *
                        </Label>
                        {qrType === "text" ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Tittel
                              </Label>
                              <Input
                                placeholder="Skriv inn tittel..."
                                value={textSettings.title}
                                onChange={(e) => setTextSettings(prev => ({ ...prev, title: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Tekst *
                              </Label>
                              <Textarea
                                placeholder="Skriv inn teksten din her..."
                                value={textSettings.content}
                                onChange={(e) => setTextSettings(prev => ({ ...prev, content: e.target.value }))}
                                className="min-h-[80px]"
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                          </div>
                        ) : qrType === "sms" ? (
                          <Textarea
                            placeholder="Skriv inn SMS meldingen..."
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="min-h-[80px]"
                            style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                          />
                        ) : qrType === "vcard" ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Navn *
                              </Label>
                              <Input
                                placeholder="Ola Nordmann"
                                value={vcardSettings.name}
                                onChange={(e) => setVcardSettings(prev => ({ ...prev, name: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Telefon
                              </Label>
                              <Input
                                type="tel"
                                placeholder="+47 123 45 678"
                                value={vcardSettings.phone}
                                onChange={(e) => setVcardSettings(prev => ({ ...prev, phone: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                E-post
                              </Label>
                              <Input
                                type="email"
                                placeholder="ola@example.com"
                                value={vcardSettings.email}
                                onChange={(e) => setVcardSettings(prev => ({ ...prev, email: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Firma
                              </Label>
                              <Input
                                placeholder="Min Bedrift AS"
                                value={vcardSettings.company}
                                onChange={(e) => setVcardSettings(prev => ({ ...prev, company: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            {vcardSettings.name && !vcardSettings.phone && !vcardSettings.email && (
                              <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-600">⚠️</span>
                                  Telefon eller e-post må fylles ut
                                </div>
                              </div>
                            )}
                          </div>
                        ) : qrType === "event" ? (
                          <Textarea
                            placeholder="Tittel:YYYYMMDDTHHMMSS:Lokasjon:Beskrivelse"
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            className="min-h-[80px]"
                            style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                          />
                        ) : qrType === "wifi" ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                SSID (Nettverksnavn) *
                              </Label>
                              <Input
                                placeholder="Mitt WiFi-nettverk"
                                value={wifiSettings.ssid}
                                onChange={(e) => setWifiSettings(prev => ({ ...prev, ssid: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Passord
                              </Label>
                              <Input
                                type="password"
                                placeholder="WiFi-passord"
                                value={wifiSettings.password}
                                onChange={(e) => setWifiSettings(prev => ({ ...prev, password: e.target.value }))}
                                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                                Sikkerhet
                              </Label>
                              <Select 
                                value={wifiSettings.security} 
                                onValueChange={(value) => setWifiSettings(prev => ({ ...prev, security: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="WPA">WPA</SelectItem>
                                  <SelectItem value="WPA2">WPA2</SelectItem>
                                  <SelectItem value="WPA3">WPA3</SelectItem>
                                  <SelectItem value="WEP">WEP (ikke anbefalt)</SelectItem>
                                  <SelectItem value="nopass">Åpent nettverk</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          <Input
                            type={qrType === "email" ? "email" : qrType === "phone" ? "tel" : "text"}
                            placeholder={
                              qrType === "url" ? "https://example.com" :
                              qrType === "email" ? "navn@example.com" :
                              qrType === "phone" ? "+47 123 45 678" :
                              "Skriv inn data..."
                            }
                            value={qrData}
                            onChange={(e) => setQrData(e.target.value)}
                            style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                          />
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Design Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Design
                        </h3>
                      </div>

                      {/* Color Presets */}
                      <div className="space-y-2">
                        <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Ferdig farger
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => handleStyleChange({
                                foregroundColor: preset.fg,
                                backgroundColor: preset.bg
                              })}
                              className="flex items-center gap-2 p-2 rounded-lg border-2 hover:border-primary/50 transition-colors text-left"
                              style={{ 
                                backgroundColor: preset.bg,
                                borderColor: qrStyle.foregroundColor === preset.fg && qrStyle.backgroundColor === preset.bg ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                              }}
                            >
                              <div 
                                className="w-3 h-3 rounded border"
                                style={{ backgroundColor: preset.fg }}
                              />
                              <span className="text-xs font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable', color: preset.fg }}>
                                {preset.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Forgrunn
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={qrStyle.foregroundColor}
                              onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
                              className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={qrStyle.foregroundColor}
                              onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
                              className="flex-1 text-sm"
                              style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Bakgrunn
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={qrStyle.backgroundColor}
                              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                              className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={qrStyle.backgroundColor}
                              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                              className="flex-1 text-sm"
                              style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Size and Error Correction */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Størrelse: {qrStyle.size}px
                          </Label>
                          <Input
                            type="range"
                            min="128"
                            max="512"
                            step="32"
                            value={qrStyle.size}
                            onChange={(e) => handleStyleChange({ size: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Feilkorreksjon
                          </Label>
                          <Select 
                            value={qrStyle.errorCorrectionLevel} 
                            onValueChange={(value) => handleStyleChange({ errorCorrectionLevel: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {errorCorrectionLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex flex-col">
                                    <span>{level.label}</span>
                                    <span className="text-xs text-muted-foreground">{level.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          Logo URL (valgfritt)
                        </Label>
                        <Input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={qrStyle.logoUrl || ""}
                          onChange={(e) => handleStyleChange({ logoUrl: e.target.value })}
                          style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4" />
                      <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        Sikkerhet og tilgangskontroll
                      </h3>
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            <Lock className="w-4 h-4" />
                            Passordbeskyttelse
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Krev passord for å åpne QR-koden
                          </p>
                        </div>
                        <Switch
                          checked={qrStyle.passwordProtected}
                          onCheckedChange={(checked) => handleStyleChange({ passwordProtected: checked })}
                        />
                      </div>
                      
                      {qrStyle.passwordProtected && (
                        <Input
                          type="password"
                          placeholder="Skriv inn passord"
                          value={securitySettings.password}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, password: e.target.value }))}
                          style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                        />
                      )}
                    </div>

                    <Separator />

                    {/* Scan Limits */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        <Eye className="w-4 h-4" />
                        Skanning-begrensninger
                      </Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Maks totale skanninger</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Ubegrenset"
                            value={securitySettings.scanLimit || ""}
                            onChange={(e) => setSecuritySettings(prev => ({ 
                              ...prev, 
                              scanLimit: parseInt(e.target.value) || 0 
                            }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Maks per dag</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Ubegrenset"
                            value={securitySettings.maxScansPerDay || ""}
                            onChange={(e) => setSecuritySettings(prev => ({ 
                              ...prev, 
                              maxScansPerDay: parseInt(e.target.value) || 0 
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Advanced Security */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        <Fingerprint className="w-4 h-4" />
                        Avansert sikkerhet
                      </Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm">Spor analytikk</Label>
                            <p className="text-xs text-muted-foreground">
                              Samle data om skanninger
                            </p>
                          </div>
                          <Switch
                            checked={qrStyle.trackAnalytics}
                            onCheckedChange={(checked) => handleStyleChange({ trackAnalytics: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm">Blokker mistenksomme aktiviteter</Label>
                            <p className="text-xs text-muted-foreground">
                              Automatisk blokkering av potensielle trusler
                            </p>
                          </div>
                          <Switch
                            checked={qrStyle.blockSuspiciousActivity}
                            onCheckedChange={(checked) => handleStyleChange({ blockSuspiciousActivity: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="geo" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4" />
                      <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        Geografiske begrensninger
                      </h3>
                    </div>

                    {/* Enable Geo-lock */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          <Globe className="w-4 h-4" />
                          Aktiver geo-lås
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Begrens tilgang basert på geografisk lokasjon
                        </p>
                      </div>
                      <Switch
                        checked={qrStyle.geoLocked}
                        onCheckedChange={(checked) => handleStyleChange({ geoLocked: checked })}
                      />
                    </div>

                    {qrStyle.geoLocked && (
                      <div className="space-y-4">
                        <Separator />
                        
                        {/* Current Location */}
                        {currentLocation && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <Label className="text-sm font-medium">Din nåværende posisjon:</Label>
                            <p className="text-sm text-muted-foreground">
                              {currentLocation.city}, {currentLocation.country}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                            </p>
                          </div>
                        )}

                        {/* Allowed Countries */}
                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Tillatte land
                          </Label>
                          <Select 
                            value={""} 
                            onValueChange={(country) => {
                              if (!geoSettings.allowedCountries.includes(country)) {
                                setGeoSettings(prev => ({
                                  ...prev,
                                  allowedCountries: [...prev.allowedCountries, country]
                                }));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Velg land å legge til" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {geoSettings.allowedCountries.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {geoSettings.allowedCountries.map((country) => (
                                <Badge 
                                  key={country} 
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => setGeoSettings(prev => ({
                                    ...prev,
                                    allowedCountries: prev.allowedCountries.filter(c => c !== country)
                                  }))}
                                >
                                  {country} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Geo Radius */}
                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Radius: {geoSettings.geoRadius} km
                          </Label>
                          <Input
                            type="range"
                            min="1"
                            max="100"
                            value={geoSettings.geoRadius}
                            onChange={(e) => setGeoSettings(prev => ({ 
                              ...prev, 
                              geoRadius: parseInt(e.target.value) 
                            }))}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            QR-koden vil kun fungere innenfor denne radiusen fra din nåværende posisjon
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="time" className="space-y-4 mt-0">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4" />
                      <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        Tidsbegrensninger
                      </h3>
                    </div>

                    {/* Enable Time Restrictions */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                          <Clock className="w-4 h-4" />
                          Aktiver tidsbegrensninger
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Begrens når QR-koden kan skannes
                        </p>
                      </div>
                      <Switch
                        checked={qrStyle.timeRestricted}
                        onCheckedChange={(checked) => handleStyleChange({ timeRestricted: checked })}
                      />
                    </div>

                    {qrStyle.timeRestricted && (
                      <div className="space-y-4">
                        <Separator />
                        
                        {/* Valid Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                              Gyldig fra
                            </Label>
                            <Input
                              type="datetime-local"
                              value={timeSettings.validFrom}
                              onChange={(e) => setTimeSettings(prev => ({ 
                                ...prev, 
                                validFrom: e.target.value 
                              }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                              Gyldig til
                            </Label>
                            <Input
                              type="datetime-local"
                              value={timeSettings.validUntil}
                              onChange={(e) => setTimeSettings(prev => ({ 
                                ...prev, 
                                validUntil: e.target.value 
                              }))}
                            />
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-2">
                          <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                            Hurtigvalg
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const now = new Date();
                                const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                                setTimeSettings(prev => ({
                                  ...prev,
                                  validFrom: now.toISOString().slice(0, 16),
                                  validUntil: tomorrow.toISOString().slice(0, 16)
                                }));
                              }}
                            >
                              24 timer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const now = new Date();
                                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                                setTimeSettings(prev => ({
                                  ...prev,
                                  validFrom: now.toISOString().slice(0, 16),
                                  validUntil: nextWeek.toISOString().slice(0, 16)
                                }));
                              }}
                            >
                              1 uke
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const now = new Date();
                                const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                                setTimeSettings(prev => ({
                                  ...prev,
                                  validFrom: now.toISOString().slice(0, 16),
                                  validUntil: nextMonth.toISOString().slice(0, 16)
                                }));
                              }}
                            >
                              1 måned
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setTimeSettings(prev => ({
                                  ...prev,
                                  validFrom: "",
                                  validUntil: ""
                                }));
                              }}
                            >
                              Tøm
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right Column: Preview */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode className="w-4 h-4" />
                    <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                      Forhåndsvisning
                    </h3>
                    {isGenerating && (
                      <Badge variant="secondary" className="ml-auto">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Oppdaterer
                      </Badge>
                    )}
                  </div>

                  {/* QR Preview */}
                  <div 
                    className="border-2 border-dashed rounded-xl flex items-center justify-center mb-4"
                    style={{ 
                      aspectRatio: '1',
                      backgroundColor: qrResult ? qrStyle.backgroundColor : 'hsl(var(--muted))'
                    }}
                  >
                    {isGenerating ? (
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <div className="text-sm">Genererer...</div>
                      </div>
                    ) : qrResult ? (
                      <Image 
                        src={qrResult.url} 
                        alt="QR Code Preview"
                        width={200}
                        height={200}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : qrData ? (
                      <div className="text-center text-muted-foreground">
                        <QrCode className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Forbereder...</div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <QrCode className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">QR-koden vises her</div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 mb-4">
                      <div className="font-medium mb-1">Feil:</div>
                      <div>{error}</div>
                    </div>
                  )}

                  {/* Security Status Indicators */}
                  {qrData && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="text-lg font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                            {qrData.length}
                          </div>
                          <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                            Tegn
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="text-lg font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                            {qrStyle.size}px
                          </div>
                          <div className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                            Størrelse
                          </div>
                        </div>
                      </div>

                      {/* Security Features Status */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Aktive funksjoner:</Label>
                        <div className="flex flex-wrap gap-1">
                          {qrStyle.passwordProtected && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Passordbeskyttet
                            </Badge>
                          )}
                          {qrStyle.geoLocked && (
                            <Badge variant="secondary" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              Geo-låst
                            </Badge>
                          )}
                          {qrStyle.timeRestricted && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Tidsbegrenset
                            </Badge>
                          )}
                          {qrStyle.trackAnalytics && (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Analytikk
                            </Badge>
                          )}
                          {securitySettings.scanLimit > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Maks {securitySettings.scanLimit} skanninger
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Geo Status */}
                      {qrStyle.geoLocked && geoSettings.allowedCountries.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Geografiske begrensninger
                            </span>
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            Tillatt i: {geoSettings.allowedCountries.join(', ')}
                          </div>
                          {geoSettings.geoCenter && (
                            <div className="text-xs text-blue-700 dark:text-blue-300">
                              Radius: {geoSettings.geoRadius} km
                            </div>
                          )}
                        </div>
                      )}

                      {/* Time Status */}
                      {qrStyle.timeRestricted && (timeSettings.validFrom || timeSettings.validUntil) && (
                        <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                              Tidsbegrensninger
                            </span>
                          </div>
                          {timeSettings.validFrom && (
                            <div className="text-xs text-orange-700 dark:text-orange-300">
                              Fra: {new Date(timeSettings.validFrom).toLocaleString('no-NO')}
                            </div>
                          )}
                          {timeSettings.validUntil && (
                            <div className="text-xs text-orange-700 dark:text-orange-300">
                              Til: {new Date(timeSettings.validUntil).toLocaleString('no-NO')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Security Level Indicator */}
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Sikkerhetsnivå</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const securityLevel = 
                                (qrStyle.passwordProtected ? 1 : 0) +
                                (qrStyle.geoLocked ? 1 : 0) +
                                (qrStyle.timeRestricted ? 1 : 0) +
                                (qrStyle.blockSuspiciousActivity ? 1 : 0) +
                                (securitySettings.scanLimit > 0 ? 1 : 0);
                              
                              return (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded-full ml-1 ${
                                    level <= securityLevel 
                                      ? 'bg-green-500' 
                                      : 'bg-muted-foreground/30'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const level = 
                              (qrStyle.passwordProtected ? 1 : 0) +
                              (qrStyle.geoLocked ? 1 : 0) +
                              (qrStyle.timeRestricted ? 1 : 0) +
                              (qrStyle.blockSuspiciousActivity ? 1 : 0) +
                              (securitySettings.scanLimit > 0 ? 1 : 0);
                            
                            if (level === 0) return "Grunnleggende - Ingen begrensninger";
                            if (level <= 2) return "Medium - Noen sikkerhetsfunksjoner";
                            if (level <= 3) return "Høy - Flere sikkerhetsfunksjoner";
                            return "Maksimal - Full sikkerhet aktivert";
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Settings Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4" />
                    <h3 className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                      Sammendrag av innstillinger
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">
                        {qrTypes.find(t => t.value === qrType)?.label || qrType}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Feilkorreksjon:</span>
                      <span className="font-medium">
                        {errorCorrectionLevels.find(l => l.value === qrStyle.errorCorrectionLevel)?.label || qrStyle.errorCorrectionLevel}
                      </span>
                    </div>
                    
                    {qrStyle.passwordProtected && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passord:</span>
                        <span className="font-medium text-green-600">Aktivert</span>
                      </div>
                    )}
                    
                    {qrStyle.geoLocked && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Geo-lås:</span>
                        <span className="font-medium text-blue-600">
                          {geoSettings.allowedCountries.length} land
                        </span>
                      </div>
                    )}
                    
                    {qrStyle.timeRestricted && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tidsbegrenset:</span>
                        <span className="font-medium text-orange-600">Aktivert</span>
                      </div>
                    )}
                    
                    {securitySettings.scanLimit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maks skanninger:</span>
                        <span className="font-medium">{securitySettings.scanLimit}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>

        <Separator />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">
              * Avanserte funksjoner krever premium abonnement
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              Avbryt
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!qrResult || !title.trim() || isSaving}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingQR ? 'Oppdaterer...' : 'Lagrer...'}
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  {editingQR ? 'Oppdater QR-kode' : 'Opprett avansert QR-kode'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 