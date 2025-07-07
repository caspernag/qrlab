"use client";

import '../../../public/Fonts/WEB/css/satoshi.css';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import AuthWrapper from '@/components/AuthWrapper';

// Import section components
import { DashboardSection as DashboardSectionComponent } from './components/DashboardSection';
import { QRCodesSection } from './components/QRCodesSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { BulkUploadSection, TeamSection, SettingsSection } from './components/OtherSections';
import { CreateQRDialog } from './components/CreateQRDialog';

// Import dashboard types and hooks
import { DashboardSection, DashboardContext, useDashboard } from '@/hooks/useDashboard';

function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Section name mapping for breadcrumbs
const sectionNames: Record<DashboardSection, string> = {
  dashboard: 'Dashboard',
  'qr-codes': 'Mine QR-koder',
  'bulk-upload': 'Bulk Upload',
  analytics: 'Analytics',
  team: 'Team',
  settings: 'Innstillinger',
};

function DashboardContent() {
  const { user, loading: authLoading, signOut, updateProfile } = useAuth();
  const { activeSection, setActiveSection } = useDashboard();
  const router = useRouter();
  
  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [createQRDialogOpen, setCreateQRDialogOpen] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const { error } = await updateProfile({
        full_name: profileData.full_name
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        // TODO: Show error toast/notification
      } else {
        console.log('Profile updated successfully');
        setProfileDialogOpen(false);
        // TODO: Show success toast/notification
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle settings navigation
  const handleSettingsClick = () => {
    setActiveSection('settings');
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                      Laster...
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            {/* User Section */}
            <div className="ml-auto px-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url || "/avatars/01.png"} alt="User" />
                      <AvatarFallback style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        {user?.user_metadata?.full_name 
                          ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                          : user?.email?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Bruker'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'Ingen e-post'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                <DropdownMenuItem 
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                  onClick={() => setProfileDialogOpen(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                  onClick={() => setSubscriptionDialogOpen(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Abonnement</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                  onClick={handleSettingsClick}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Innstillinger</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logg ut</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
            <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
                      </div>
          </SidebarInset>

          {/* Create QR Dialog */}
          <CreateQRDialog 
            open={createQRDialogOpen} 
            onOpenChange={setCreateQRDialogOpen} 
          />
        </SidebarProvider>
      );
  }

  // Render the appropriate section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSectionComponent />;
      case 'qr-codes':
        return <QRCodesSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'bulk-upload':
        return <BulkUploadSection />;
      case 'team':
        return <TeamSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSectionComponent />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                    {sectionNames[activeSection]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* User Section */}
          <div className="ml-auto px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/avatars/01.png"} alt="User" />
                    <AvatarFallback style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      {user?.user_metadata?.full_name 
                        ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                        : user?.email?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Bruker'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'Ingen e-post'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                    onClick={() => setSubscriptionDialogOpen(true)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Abonnement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                    onClick={handleSettingsClick}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Innstillinger</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logg ut</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {renderSectionContent()}
        </div>
      </SidebarInset>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              Rediger profil
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Oppdater din profilinformasjon her. Klikk lagre når du er ferdig.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                Navn
              </Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                className="col-span-3"
                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                E-post
              </Label>
              <Input
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleProfileUpdate}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              Lagre endringer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Satoshi-Bold, Satoshi-Variable' }}>
              Abonnement
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
              Administrer ditt QRLab-abonnement og fakturering.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}>
                Abonnementsfunksjoner
              </h3>
              <p className="text-muted-foreground" style={{ fontFamily: 'Satoshi-Regular, Satoshi-Variable' }}>
                Denne funksjonen vil bli utviklet videre senere.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSubscriptionDialogOpen(false)}
              style={{ fontFamily: 'Satoshi-Medium, Satoshi-Variable' }}
            >
              Lukk
            </Button>
          </DialogFooter>
                  </DialogContent>
        </Dialog>

        {/* Create QR Dialog */}
        <CreateQRDialog 
          open={createQRDialogOpen} 
          onOpenChange={setCreateQRDialogOpen} 
        />
      </SidebarProvider>
    );
  }

export default function Dashboard() {
  return (
    <AuthWrapper>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </AuthWrapper>
  );
} 