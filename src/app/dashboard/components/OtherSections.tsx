"use client";

import { Upload, Users, Settings, FileSpreadsheet, UserPlus, Shield, User, Lock, Bell, Trash2, Eye, EyeOff, Camera, Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function BulkUploadSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
          Bulk Upload
        </h1>
        <p className="text-muted-foreground mt-1" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
          Last opp flere QR-koder samtidig
        </p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Bulk upload funksjonalitet
            </h3>
            <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Last opp CSV-filer eller bruk vårt API for å lage mange QR-koder på en gang
            </p>
            <div className="flex gap-4 justify-center">
              <Button style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Last opp CSV
              </Button>
              <Button variant="outline" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                API dokumentasjon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TeamSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
            Team
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
            Administrer teammedlemmer og tilganger
          </p>
        </div>
        <Button style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter medlem
        </Button>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
              Team administrasjon
            </h3>
            <p className="text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Administrer teammedlemmer, roller og tilganger til QR-koder
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    security_alerts: true
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadNotificationSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', user?.id)
        .single();

      if (!error && data?.notification_settings) {
        setNotifications(data.notification_settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, [user?.id]);

  // Load user profile on component mount
  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      });
      loadNotificationSettings();
    }
  }, [user, loadNotificationSettings]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        }
      });

      if (authError) throw authError;

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Profil oppdatert!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Feil ved oppdatering: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Nye passord stemmer ikke overens');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('Passord må være minst 6 tegn');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Passord endret!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Feil ved endring av passord: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: newNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Varslingsinnstillinger oppdatert!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Feil ved oppdatering: ${errorMessage}`);
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'SLETT KONTO') {
      toast.error('Skriv "SLETT KONTO" for å bekrefte');
      return;
    }

    setLoading(true);
    try {
      // First delete user data (handled by CASCADE in database)
      const { error: qrError } = await supabase
        .from('qr_codes')
        .delete()
        .eq('user_id', user?.id);

      if (qrError) throw qrError;

      // Delete profile (handled by CASCADE in database)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Sign out user (they won't be able to access the app anymore)
      await supabase.auth.signOut();
      
      toast.success('Konto data slettet og du er logget ut');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Feil ved sletting: ${errorMessage}`);
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Fil må være mindre enn 2MB');
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Profilbilde lastet opp!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      toast.error(`Feil ved opplasting: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
          Innstillinger
        </h1>
        <p className="text-muted-foreground mt-1" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
          Tilpass din QRLab-opplevelse og administrer kontoen din
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
            <Shield className="w-4 h-4 mr-2" />
            Sikkerhet
          </TabsTrigger>
          <TabsTrigger value="notifications" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
            <Bell className="w-4 h-4 mr-2" />
            Varsler
          </TabsTrigger>
          <TabsTrigger value="account" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
            <Settings className="w-4 h-4 mr-2" />
            Konto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                Profil informasjon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={loading} asChild>
                      <span style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                        <Camera className="w-4 h-4 mr-2" />
                        Endre profilbilde
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG eller GIF. Maks 2MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="full_name">Fullt navn</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Ditt fulle navn"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    E-post kan ikke endres. Kontakt support hvis nødvendig.
                  </p>
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Lagre endringer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                  Endre passord
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Nåværende passord</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                      placeholder="Skriv inn nåværende passord"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new_password">Nytt passord</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      placeholder="Skriv inn nytt passord"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm_password">Bekreft nytt passord</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Bekreft nytt passord"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handlePasswordChange} disabled={loading || !passwords.new || !passwords.confirm}>
                  <Lock className="w-4 h-4 mr-2" />
                  Endre passord
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                  To-faktor autentisering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                      Aktivér 2FA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Øk sikkerheten til kontoen din med to-faktor autentisering
                    </p>
                  </div>
                  <Switch />
                </div>
                <Alert className="mt-4">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    To-faktor autentisering vil bli tilgjengelig i en fremtidig oppdatering.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                Varslingsinnstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    E-postvarsler
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Motta e-post om QR-kode aktivitet og kontouppdateringer
                  </p>
                </div>
                <Switch
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('email_notifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Push-varsler
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Motta push-varsler i nettleseren
                  </p>
                </div>
                <Switch
                  checked={notifications.push_notifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('push_notifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Markedsføring
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Motta e-post om nye funksjoner og tilbud
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing_emails}
                  onCheckedChange={(checked) => handleNotificationUpdate('marketing_emails', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    Sikkerhetsvarsler
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Motta varsler om mistenkelig aktivitet (anbefalt)
                  </p>
                </div>
                <Switch
                  checked={notifications.security_alerts}
                  onCheckedChange={(checked) => handleNotificationUpdate('security_alerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                  Konto informasjon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Medlem siden</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('nb-NO') : 'Ukjent'}
                    </p>
                  </div>
                  <div>
                    <Label>Abonnement</Label>
                    <p className="text-sm text-muted-foreground">Gratis plan</p>
                  </div>
                  <div>
                    <Label>Bruker ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive" style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
                  Farezone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Sletting av kontoen er permanent og kan ikke angres. All data vil bli slettet.
                  </AlertDescription>
                </Alert>
                
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Slett konto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Er du helt sikker?</DialogTitle>
                      <DialogDescription>
                        Denne handlingen kan ikke angres. Dette vil permanent slette kontoen din og fjerne all data fra våre servere.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label htmlFor="delete_confirmation">
                        Skriv <strong>SLETT KONTO</strong> for å bekrefte:
                      </Label>
                      <Input
                        id="delete_confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="SLETT KONTO"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Avbryt
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleAccountDeletion}
                        disabled={loading || deleteConfirmation !== 'SLETT KONTO'}
                      >
                        Slett konto permanent
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 