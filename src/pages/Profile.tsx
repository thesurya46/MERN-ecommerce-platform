import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Separator } from '../app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { Badge } from '../app/components/ui/badge';
import { User, Mail, Phone, MapPin, Save, Lock, Camera, Trash2, ImagePlus } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/authValidation';
import { processProfilePhoto } from '../utils/profilePhoto';
import UserAvatar from '../components/UserAvatar';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      setPhotoPreview(user.avatar);
    }
  }, [user]);

  const displayUser = user
    ? { ...user, avatar: photoPreview ?? user.avatar }
    : null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingPhoto(true);
    try {
      const dataUrl = await processProfilePhoto(file);
      setPhotoPreview(dataUrl);
      await updateProfile({ avatar: dataUrl });
      toast.success('Profile photo updated');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload photo';
      toast.error(message);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setIsUploadingPhoto(true);
    try {
      setPhotoPreview(undefined);
      await updateProfile({ avatar: '' });
      toast.success('Profile photo removed');
    } catch {
      toast.error('Failed to remove photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const validateProfile = () => {
    const errors: Record<string, string> = {};

    if (!profile.name.trim()) {
      errors.name = 'Full name is required';
    }

    const emailError = validateEmail(profile.email);
    if (emailError) errors.email = emailError;

    if (profile.phone && !/^\+?[\d\s\-()]{7,20}$/.test(profile.phone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setIsSaving(true);
    try {
      await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim() || undefined,
        address: profile.address.trim() || undefined,
      });
    } catch {
      // toast handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    const newPasswordError = validatePassword(passwordForm.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsChangingPassword(true);

    try {
      await authAPI.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user || !displayUser) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <section className="bg-gradient-to-br from-primary/15 via-background to-indigo-500/10 py-12 border-b">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information, security, and preferences.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card className="mb-8 border-none ring-1 ring-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
          <CardDescription>
            Upload a photo from your gallery, files, or device storage (JPG, PNG, WebP, GIF — max 5MB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <UserAvatar user={displayUser} className="h-28 w-28" fallbackClassName="text-2xl" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isUploadingPhoto}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {isUploadingPhoto ? 'Uploading...' : 'Choose from device'}
              </Button>
              {photoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto text-destructive hover:text-destructive"
                  disabled={isUploadingPhoto}
                  onClick={handleRemovePhoto}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove photo
                </Button>
              )}
              <p className="text-xs text-muted-foreground max-w-xs">
                Opens your file picker so you can select from gallery, Google Drive, or any folder on your device.
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Personal Details</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your information and click Save Changes when done.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => {
                        setProfile({ ...profile, name: e.target.value });
                        if (profileErrors.name) setProfileErrors((p) => ({ ...p, name: '' }));
                      }}
                      className="pl-9"
                      placeholder="Your full name"
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-sm text-destructive">{profileErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => {
                        setProfile({ ...profile, email: e.target.value });
                        if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: '' }));
                      }}
                      className="pl-9"
                      placeholder="you@gmail.com"
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-sm text-destructive">{profileErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => {
                        setProfile({ ...profile, phone: e.target.value });
                        if (profileErrors.phone) setProfileErrors((p) => ({ ...p, phone: '' }));
                      }}
                      className="pl-9"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-sm text-destructive">{profileErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="pl-9"
                      placeholder="Street, City, State, PIN"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used to pre-fill checkout shipping details.
                  </p>
                </div>

                <Separator className="my-4" />

                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Enter your current password, then choose a new one (minimum 8 characters).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors((p) => ({ ...p, currentPassword: '' }));
                      }
                    }}
                    autoComplete="current-password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                      if (passwordErrors.newPassword) {
                        setPasswordErrors((p) => ({ ...p, newPassword: '' }));
                      }
                    }}
                    minLength={8}
                    autoComplete="new-password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors((p) => ({ ...p, confirmPassword: '' }));
                      }
                    }}
                    minLength={8}
                    autoComplete="new-password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
