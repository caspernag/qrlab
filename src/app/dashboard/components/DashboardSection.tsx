"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useQRCodes } from '@/hooks/useQRCodes';
import { Plus, QrCode, BarChart3, TrendingUp, Users, Search, Filter, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateQRDialog } from './CreateQRDialog';
import { toast } from 'sonner';
import { QRCode } from '@/lib/supabase';
import { getTrackableContent } from '@/lib/tracking';

export function DashboardSection() {
  const { qrCodes, loading, realtimeConnected, updateQRCode, deleteQRCode, refetch } = useQRCodes();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to generate QR code URL for viewing with tracking
  const generateQRCodeURL = (qr: QRCode) => {
    const designSettings = qr.design_settings as { 
      size?: number; 
      foregroundColor?: string; 
      backgroundColor?: string; 
    } || {};
    const size = designSettings.size || 200;
    const fg = (designSettings.foregroundColor || '#000000').replace('#', '');
    const bg = (designSettings.backgroundColor || '#ffffff').replace('#', '');
    
    // Use tracking URL if analytics is enabled, otherwise use original content
    const contentToEncode = getTrackableContent({
      id: qr.id,
      type: qr.type,
      content: qr.content,
      design_settings: qr.design_settings
    });
    
    const encodedContent = encodeURIComponent(contentToEncode);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedContent}&color=${fg}&bgcolor=${bg}`;
  };

  // Filter QR codes based on search term
  const filteredQRCodes = qrCodes.filter(qr => 
    qr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (qr: QRCode) => {
    setSelectedQR(qr);
    setViewDialogOpen(true);
  };

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    setCreateDialogOpen(true);
  };

  const handleDelete = (qr: QRCode) => {
    setSelectedQR(qr);
    setDeleteDialogOpen(true);
  };

  // Handle dialog close with refresh
  const handleCreateDialogClose = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      // Reset editing state
      setEditingQR(null);
      // Refresh data when dialog closes
      console.log('🔄 Refreshing QR codes after dialog close');
      refetch();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedQR) return;

    try {
      await deleteQRCode(selectedQR.id);
      toast.success('QR-kode slettet!');
      setDeleteDialogOpen(false);
      setSelectedQR(null);
    } catch (error) {
      toast.error('Feil ved sletting av QR-kode');
      console.error('Error deleting QR code:', error);
    }
  };

  const toggleQRStatus = async (qr: QRCode) => {
    try {
      await updateQRCode(qr.id, { is_active: !qr.is_active });
      toast.success(`QR-kode ${!qr.is_active ? 'aktivert' : 'deaktivert'}!`);
    } catch (error) {
      toast.error('Feil ved endring av QR-kode status');
      console.error('Error updating QR code status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
            Oversikt over dine QR-koder
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0);
  const activeQRs = qrCodes.filter(qr => qr.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              Dashboard
            </h1>
            {/* Realtime Status Indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              realtimeConnected 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-muted text-muted-foreground'
            }`} style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              <div className={`w-2 h-2 rounded-full ${
                realtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
              }`} />
              {realtimeConnected ? 'Live' : 'Offline'}
            </div>
          </div>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
            {realtimeConnected 
              ? 'Oversikt over dine QR-koder • Oppdateres automatisk'
              : 'Oversikt over dine QR-koder'
            }
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={() => setCreateDialogOpen(true)}
          style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ny QR-kode
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Totale QR-koder
            </CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              {qrCodes.length}
            </div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Alle dine QR-koder
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Totale scans
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              {totalScans}
            </div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Antall ganger skannet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Aktive QR-koder
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              {activeQRs}
            </div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Koder i bruk
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Abonnement
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              Premium
            </div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Aktiv plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Søk QR-koder..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
          />
        </div>
        <Button variant="outline" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* QR Codes List */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
            QR-koder ({filteredQRCodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredQRCodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                {qrCodes.length === 0 ? 'Ingen QR-koder ennå' : 'Ingen QR-koder funnet'}
              </h3>
              <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                {qrCodes.length === 0 
                  ? 'Kom i gang ved å lage din første QR-kode'
                  : 'Prøv å endre søkeordet ditt'
                }
              </p>
              {qrCodes.length === 0 && (
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Lag din første QR-kode
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    QR-kode
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Type
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Scans
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Status
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Opprettet
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Handlinger
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQRCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                              {qr.title}
                            </p>
                            {qr.design_settings?.trackAnalytics !== false && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                <Eye className="w-3 h-3" />
                                Tracking
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                            ID: {qr.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                      {qr.type || 'URL'}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        {qr.scan_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          qr.is_active 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`} 
                        style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
                        onClick={() => toggleQRStatus(qr)}
                        title="Klikk for å endre status"
                      >
                        {qr.is_active ? 'Aktiv' : 'Inaktiv'}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                      {new Date(qr.created_at).toLocaleDateString('no')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(qr)}
                          title="Vis QR-kode"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(qr)}
                          title="Rediger QR-kode"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" title="Flere handlinger">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(qr)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Vis detaljer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(qr)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleQRStatus(qr)}>
                              <Switch className="w-4 h-4 mr-2" />
                              {qr.is_active ? 'Deaktiver' : 'Aktiver'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(qr)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Slett
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit QR Dialog */}
      <CreateQRDialog 
        open={createDialogOpen} 
        onOpenChange={handleCreateDialogClose}
        editingQR={editingQR || undefined}
      />

      {/* View QR Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              QR-kode detaljer
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Vis informasjon om QR-koden
            </DialogDescription>
          </DialogHeader>
          {selectedQR && (
            <div className="space-y-4">
              <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                  <Image 
                    src={generateQRCodeURL(selectedQR)} 
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Tittel</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>{selectedQR.title}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Type</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>{selectedQR.type}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Innhold</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }} className="break-all">
                    {selectedQR.content || 'Ikke angitt'}
                  </p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Antall scans</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>{selectedQR.scan_count}</p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Status</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                    {selectedQR.is_active ? 'Aktiv' : 'Inaktiv'}
                  </p>
                </div>
                <div>
                  <Label style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>Opprettet</Label>
                  <p style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                    {new Date(selectedQR.created_at).toLocaleDateString('no', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewDialogOpen(false)}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              Slett QR-kode
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Er du sikker på at du vil slette QR-koden &quot;{selectedQR?.title}&quot;? 
              Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              Avbryt
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 