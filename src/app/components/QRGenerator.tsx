"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

// Define types
interface QRResult {
  url: string;
  data: string;
  type: string;
  method: string;
  options: QROptions;
}

interface QROptions {
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  style: string;
  errorCorrectionLevel: string;
}

// Create a client-side QRCodeGenerator class
class QRCodeGenerator {
  public options: QROptions;
  public apiEndpoints: { qrServer: string; quickChart: string };

  constructor(options: Partial<QROptions> = {}) {
    this.options = {
      size: 256,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      style: 'square',
      errorCorrectionLevel: 'M',
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
      case 'text':
      default:
        return data;
    }
  }

  async generateWithAPI(data: string, method = 'qrServer'): Promise<string> {
    const encodedData = encodeURIComponent(data);
    
    switch (method) {
      case 'qrServer':
        return `${this.apiEndpoints.qrServer}?size=${this.options.size}x${this.options.size}&data=${encodedData}&color=${this.options.foregroundColor.replace('#', '')}&bgcolor=${this.options.backgroundColor.replace('#', '')}`;
      case 'quickChart':
        return `${this.apiEndpoints.quickChart}?text=${encodedData}&size=${this.options.size}&dark=${this.options.foregroundColor.replace('#', '')}&light=${this.options.backgroundColor.replace('#', '')}`;
      default:
        throw new Error('Unsupported API method');
    }
  }

  async generate(type: string, rawData: string): Promise<QRResult> {
    const formattedData = this.formatData(type, rawData);
    let qrUrl: string;
    const method = 'api';
    
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
      method,
      options: { ...this.options }
    };
  }

  updateOptions(newOptions: Partial<QROptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  async downloadQR(qrUrl: string, filename = 'qrcode.png'): Promise<void> {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  async copyToClipboard(qrUrl: string): Promise<void> {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } else {
        await navigator.clipboard.writeText(qrUrl);
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      throw error;
    }
  }
}

export default function QRGenerator() {
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState("");
  const [qrStyle, setQrStyle] = useState<QROptions>({
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
    size: 256,
    style: "square",
    errorCorrectionLevel: "M"
  });
  
  const [generator, setGenerator] = useState<QRCodeGenerator | null>(null);
  const [qrResult, setQrResult] = useState<QRResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize generator only once when component mounts
  useEffect(() => {
    setIsMounted(true);
    if (!generator) {
      setGenerator(new QRCodeGenerator(qrStyle));
    } else {
      generator.updateOptions(qrStyle);
    }
  }, [qrStyle, generator]);

  // Memoized QR generation function
  const generateQR = useCallback(async () => {
    if (!generator || !qrData.trim() || !isMounted) {
      setQrResult(null);
      return;
    }
    
    // Update generator options first
    generator.updateOptions(qrStyle);
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generator.generate(qrType, qrData);
      setQrResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setQrResult(null);
    } finally {
      setIsGenerating(false);
    }
  }, [generator, qrData, qrType, qrStyle, isMounted]);

  // Only generate QR after component is mounted and has data
  useEffect(() => {
    if (isMounted && generator && qrData.trim()) {
      generateQR();
    } else if (isMounted) {
      setQrResult(null);
    }
  }, [generateQR, generator, qrData, isMounted]);

  // Handle real-time style updates
  const handleStyleChange = useCallback((newStyle: Partial<QROptions>) => {
    setQrStyle(prev => ({ ...prev, ...newStyle }));
  }, []);

  const handleDownload = async () => {
    if (!generator || !qrResult) return;
    
    try {
      // Generate filename on client side only to avoid hydration mismatch
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
      await generator.downloadQR(qrResult.url, `qrcode-${timestamp}.png`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
    }
  };

  const handleCopy = async () => {
    if (!generator || !qrResult) return;
    
    try {
      await generator.copyToClipboard(qrResult.url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Copy failed';
      setError(errorMessage);
    }
  };

  const qrTypes = [
    { value: "url", label: "Nettside (URL)", icon: "🌐" },
    { value: "text", label: "Tekst", icon: "📝" },
    { value: "email", label: "E-post", icon: "📧" },
    { value: "phone", label: "Telefon", icon: "📱" },
    { value: "sms", label: "SMS", icon: "💬" },
    { value: "wifi", label: "Wi-Fi", icon: "📶" },
  ];

  const colorPresets = [
    { name: "Klassisk", fg: "#000000", bg: "#ffffff" },
    { name: "Blå", fg: "#1e40af", bg: "#f0f9ff" },
    { name: "Grønn", fg: "#166534", bg: "#f0fdf4" },
    { name: "Lilla", fg: "#7c3aed", bg: "#faf5ff" },
    { name: "Rød", fg: "#dc2626", bg: "#fef2f2" },
    { name: "Oransje", fg: "#ea580c", bg: "#fff7ed" },
  ];

  const errorCorrectionLevels = [
    { value: "L", label: "Lav (7%)", description: "Rask scanning" },
    { value: "M", label: "Medium (15%)", description: "Balansert" },
    { value: "Q", label: "Kvartil (25%)", description: "God motstand" },
    { value: "H", label: "Høy (30%)", description: "Beste kvalitet" },
  ];

  return (
    <div className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-900" 
            style={{ fontFamily: 'Satoshi-Bold' }}
          >
            Lag dum QR-kode
          </h2>
          <p 
            className="text-lg text-slate-600 max-w-2xl mx-auto" 
            style={{ fontFamily: 'Satoshi-Regular' }}
          >
            Velg type, tilpass utseendet og generer din QR-kode på sekunder.<br></br>(Uten premium funksjoner og analyse).
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Column 1: Data Input */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <span 
                  className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg"
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  1
                </span>
                <span 
                  className="text-lg" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Innhold & Type
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label 
                  htmlFor="qr-type" 
                  className="text-slate-700 font-medium" 
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  QR-kode type
                </Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger 
                    className="text-base h-12 border-2 hover:border-blue-300 transition-colors"
                    style={{ fontFamily: 'Satoshi-Regular' }}
                  >
                    <SelectValue placeholder="Velg QR-kode type" />
                  </SelectTrigger>
                  <SelectContent>
                    {qrTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-3 text-base py-3">
                          <span className="text-lg">{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label 
                  htmlFor="qr-data" 
                  className="text-slate-700 font-medium flex items-center gap-2" 
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  <span className="text-lg">
                    {qrTypes.find(t => t.value === qrType)?.icon}
                  </span>
                  {qrType === "url" && "Nettside URL"}
                  {qrType === "text" && "Tekst innhold"}
                  {qrType === "email" && "E-post adresse"}
                  {qrType === "phone" && "Telefonnummer"}
                  {qrType === "sms" && "SMS melding"}
                  {qrType === "wifi" && "Wi-Fi detaljer"}
                </Label>
                {qrType === "text" || qrType === "sms" ? (
                  <Textarea
                    id="qr-data"
                    placeholder={
                      qrType === "text" 
                        ? "Skriv inn teksten din her..." 
                        : "Skriv inn SMS meldingen..."
                    }
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    className="min-h-[120px] text-base border-2 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                    style={{ fontFamily: 'Satoshi-Regular' }}
                  />
                ) : (
                  
                  <Input
                    id="qr-data"
                    type={qrType === "email" ? "email" : qrType === "phone" ? "tel" : "text"}
                    placeholder={
                      qrType === "url" ? "https://example.com" :
                      qrType === "email" ? "navn@example.com" :
                      qrType === "phone" ? "+47 123 45 678" :
                      qrType === "wifi" ? "SSID:passord:WPA" :
                      "Skriv inn data..."
                    }
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    className="text-base h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    style={{ fontFamily: 'Satoshi-Regular' }}
                  />
                )}
              </div>

              {qrType === "wifi" && (
                <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400" style={{ fontFamily: 'Satoshi-Regular' }}>
                  <div className="font-medium mb-1" style={{ fontFamily: 'Satoshi-Medium' }}>📶 Wi-Fi Format:</div>
                  <div>SSID:Passord:Sikkerhet</div>
                  <div className="text-slate-500 mt-1">Eksempel: MinWiFi:passord123:WPA</div>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border-l-4 border-red-400" style={{ fontFamily: 'Satoshi-Regular' }}>
                  <div className="font-medium mb-1" style={{ fontFamily: 'Satoshi-Medium' }}>❌ Feil:</div>
                  <div>{error}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column 2: Style Customization (Simplified - No Tabs) */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <span 
                  className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg"
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  2
                </span>
                <span 
                  className="text-lg" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Design & Stil
                </span>
                {qrData && (
                  <Badge className="ml-auto animate-pulse bg-green-100 text-green-700 border-green-200">
                    Live oppdatering
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium" style={{ fontFamily: 'Satoshi-Medium' }}>
                  🎨 Ferdig farger
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleStyleChange({
                        foregroundColor: preset.fg,
                        backgroundColor: preset.bg
                      })}
                      className="flex items-center gap-2 p-3 rounded-lg border-2 hover:border-purple-300 transition-all duration-200 text-left transform hover:scale-105"
                      style={{ 
                        backgroundColor: preset.bg,
                        borderColor: qrStyle.foregroundColor === preset.fg && qrStyle.backgroundColor === preset.bg ? '#8b5cf6' : '#e2e8f0'
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded border shadow-sm"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <span className="text-sm font-medium" style={{ fontFamily: 'Satoshi-Medium', color: preset.fg }}>
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="fg-color" 
                    className="text-slate-700 font-medium" 
                    style={{ fontFamily: 'Satoshi-Medium' }}
                  >
                    🖤 Forgrunn
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={qrStyle.foregroundColor}
                      onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
                      className="w-12 h-12 p-1 cursor-pointer border-2 rounded-lg transition-all hover:scale-105"
                    />
                    <Input
                      type="text"
                      value={qrStyle.foregroundColor}
                      onChange={(e) => handleStyleChange({ foregroundColor: e.target.value })}
                      className="flex-1 text-sm border-2 hover:border-purple-300 focus:border-purple-500 transition-colors"
                      style={{ fontFamily: 'Satoshi-Regular' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="bg-color" 
                    className="text-slate-700 font-medium" 
                    style={{ fontFamily: 'Satoshi-Medium' }}
                  >
                    🤍 Bakgrunn
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={qrStyle.backgroundColor}
                      onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                      className="w-12 h-12 p-1 cursor-pointer border-2 rounded-lg transition-all hover:scale-105"
                    />
                    <Input
                      type="text"
                      value={qrStyle.backgroundColor}
                      onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                      className="flex-1 text-sm border-2 hover:border-purple-300 focus:border-purple-500 transition-colors"
                      style={{ fontFamily: 'Satoshi-Regular' }}
                    />
                  </div>
                </div>
              </div>

              {/* Size Control */}
              <div className="space-y-3">
                <Label 
                  htmlFor="qr-size" 
                  className="text-slate-700 font-medium flex items-center justify-between" 
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  <span>📏 Størrelse</span>
                  <Badge variant="secondary" className="animate-pulse" style={{ fontFamily: 'Satoshi-Medium' }}>
                    {qrStyle.size}px
                  </Badge>
                </Label>
                <div className="space-y-3">
                  <input
                    id="qr-size"
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={qrStyle.size}
                    onChange={(e) => handleStyleChange({ size: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg appearance-none cursor-pointer transition-all hover:scale-102"
                    style={{
                      background: `linear-gradient(to right, #c084fc 0%, #c084fc ${((qrStyle.size - 128) / (512 - 128)) * 100}%, #e2e8f0 ${((qrStyle.size - 128) / (512 - 128)) * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500" style={{ fontFamily: 'Satoshi-Regular' }}>
                    <span>128px</span>
                    <span>320px</span>
                    <span>512px</span>
                  </div>
                </div>
              </div>

              {/* Error Correction */}
              <div className="space-y-3">
                <Label 
                  className="text-slate-700 font-medium" 
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  🛡️ Feilkorreksjon
                </Label>
                <Select 
                  value={qrStyle.errorCorrectionLevel} 
                  onValueChange={(value) => handleStyleChange({ errorCorrectionLevel: value })}
                >
                  <SelectTrigger className="border-2 hover:border-purple-300 transition-colors" style={{ fontFamily: 'Satoshi-Regular' }}>
                    <SelectValue placeholder="Velg nivå" />
                  </SelectTrigger>
                  <SelectContent>
                    {errorCorrectionLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="space-y-1 py-3">
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-slate-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Column 3: Preview and Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <span 
                    className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-full shadow-lg"
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    3
                  </span>
                  <span 
                    className="text-lg" 
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    Forhåndsvisning
                  </span>
                  {isGenerating && (
                    <Badge className="ml-auto animate-spin bg-blue-100 text-blue-700 border-blue-200">
                      🔄 Oppdaterer
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                {/* QR Code Preview */}
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                  style={{ 
                    width: '100%',
                    aspectRatio: '1',
                    maxWidth: '220px',
                    minHeight: '220px',
                    backgroundColor: qrResult ? qrStyle.backgroundColor : '#f8fafc'
                  }}
                >
                  {isGenerating ? (
                    <div className="text-slate-400 text-center animate-pulse" style={{ fontFamily: 'Satoshi-Regular' }}>
                      <div className="text-3xl mb-3 animate-spin">⏳</div>
                      <div className="text-sm font-medium">Oppdaterer...</div>
                      <div className="text-xs mt-1">Anvender endringer</div>
                    </div>
                  ) : qrResult ? (
                    <div className="relative group">
                      <Image 
                        src={qrResult.url} 
                        alt="Generated QR Code"
                        width={220}
                        height={220}
                        className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105"
                        style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-lg"></div>
                    </div>
                  ) : qrData ? (
                    <div className="text-slate-400 text-center animate-pulse" style={{ fontFamily: 'Satoshi-Regular' }}>
                      <div className="text-3xl mb-3">🔄</div>
                      <div className="text-sm font-medium">Vent litt...</div>
                      <div className="text-xs mt-1">Forbereder QR-kode</div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-center" style={{ fontFamily: 'Satoshi-Regular' }}>
                      <div className="text-4xl mb-3">📱</div>
                      <div className="text-sm font-medium">QR-koden vises her</div>
                      <div className="text-xs mt-1">Skriv inn data for å starte</div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                  <Button 
                    className="w-full text-sm py-3 h-auto shadow-lg hover:cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105" 
                    disabled={!qrResult || isGenerating}
                    onClick={handleDownload}
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    <span className="mr-2">📥</span>
                    Lagre QR-kode
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-sm py-3 h-auto border-2 hover:cursor-pointer hover:bg-slate-50 transition-all duration-200 transform hover:scale-105" 
                    disabled={!qrResult || isGenerating}
                    onClick={() => {
                        handleCopy();
                        toast("Kopiert til utklippstavle 😊", {
                          action: {
                            label: "Lukk",
                            onClick: () => {
                              toast.dismiss();
                            }
                          }
                        })
                    }}
                    style={{ fontFamily: 'Satoshi-Medium' }}
                  >
                    <span className="mr-2">📋</span>
                    Kopier som bilde
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm py-3 h-auto hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-105" 
                    disabled={!qrResult || isGenerating}
                    style={{ fontFamily: 'Satoshi-Medium' }}
                  >
                    <span className="mr-2">🔗</span>
                    Del QR-kode
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg transition-all duration-200 hover:bg-white/80">
                    <div 
                      className="text-2xl font-bold text-slate-900 mb-1" 
                      style={{ fontFamily: 'Satoshi-Bold' }}
                    >
                      {qrData.length}
                    </div>
                    <div 
                      className="text-xs text-slate-600 font-medium" 
                      style={{ fontFamily: 'Satoshi-Medium' }}
                    >
                      📝 Tegn
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg transition-all duration-200 hover:bg-white/80">
                    <div 
                      className="text-2xl font-bold text-slate-900 mb-1" 
                      style={{ fontFamily: 'Satoshi-Bold' }}
                    >
                      {qrStyle.size}px
                    </div>
                    <div 
                      className="text-xs text-slate-600 font-medium" 
                      style={{ fontFamily: 'Satoshi-Medium' }}
                    >
                      📏 Størrelse
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg transition-all duration-200 hover:bg-white/80">
                    <div 
                      className="text-2xl font-bold text-slate-900 mb-1" 
                      style={{ fontFamily: 'Satoshi-Bold' }}
                    >
                      {qrStyle.errorCorrectionLevel}
                    </div>
                    <div 
                      className="text-xs text-slate-600 font-medium" 
                      style={{ fontFamily: 'Satoshi-Medium' }}
                    >
                      🛡️ Feilkorreksjon
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg transition-all duration-200 hover:bg-white/80">
                    <div 
                      className="text-2xl font-bold mb-1 transition-colors duration-200" 
                      style={{ 
                        fontFamily: 'Satoshi-Bold',
                        color: qrStyle.foregroundColor 
                      }}
                    >
                      ●
                    </div>
                    <div 
                      className="text-xs text-slate-600 font-medium" 
                      style={{ fontFamily: 'Satoshi-Medium' }}
                    >
                      🎨 Farge
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 