import { Link } from 'react-router-dom';
import { HelpCircle, Moon, Sun, User, Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LANGUAGES } from './data.const';
import type { AppearanceMode, UseAccountSettingsReturn } from './types';
import { Camera } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { useGetMeQuery } from '@/api/auth.api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ProfileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const PasswordSchema = yup.object({
  currentPassword: yup.string(),
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
});

export function ProfileSectionContent({
  firstName,
  lastName,
  email,
  setFirstName,
  setLastName,
  setEmail,
  provider,
  avatarUrl,
  onSaveProfile,
  onUpdatePassword,
  onUploadAvatar
}: {
  firstName: string;
  lastName: string;
  email: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  provider?: string;
  avatarUrl?: string;
  onSaveProfile?: () => void;
  onUpdatePassword?: (currentPass: string | undefined, newPass: string) => void;
  onUploadAvatar?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const profileForm = useForm({
    resolver: yupResolver(ProfileSchema),
    values: {
      firstName: firstName,
      lastName: lastName || "",
      email: email
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localAvatarUrl) URL.revokeObjectURL(localAvatarUrl);
    };
  }, [localAvatarUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalAvatarUrl(url);
    }
    if (onUploadAvatar) onUploadAvatar(e);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Profile Info */}
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit((data) => {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          // Wait for state to apply
          setTimeout(() => onSaveProfile?.(), 0);
        })} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative group cursor-pointer shrink-0 mt-2">
              <Avatar className="size-20 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage src={localAvatarUrl || avatarUrl || ""} alt="Avatar" />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {getInitials(`${firstName} ${lastName}`)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-6 text-white" />
              </div>
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <Button type="submit" size="sm" className="px-5">
              Save changes
            </Button>
          </div>
        </form>
      </Form>

      <div className="w-full border-t border-border/50"></div>

      {/* Password Reset */}
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit((data) => {
          if (onUpdatePassword) {
            onUpdatePassword(provider === 'local' ? data.currentPassword : undefined, data.newPassword);
            passwordForm.reset();
          }
        })} className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">Change Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {provider === 'local' && (
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex">
            <Button type="submit" size="sm" variant="secondary" className="px-5">
              Update password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function NotificationsSectionContent({
  emailNotifications,
  setEmailNotifications,
}: {
  emailNotifications: boolean;
  setEmailNotifications: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium">Receive email notifications</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Get updates about your account and activity.
        </p>
      </div>
      <Switch
        id="email-notifications"
        checked={emailNotifications}
        onCheckedChange={setEmailNotifications}
      />
    </div>
  );
}

export function AppearanceSectionContent({
  appearance,
  setAppearance,
}: {
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setAppearance('light')}
        className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${
          appearance === 'light'
            ? 'border-primary bg-primary/5 text-primary shadow-sm'
            : 'border-transparent bg-muted text-muted-foreground hover:border-muted-foreground/30'
        }`}
      >
        <Sun className="size-5" />
        Light
      </button>
      <button
        onClick={() => setAppearance('dark')}
        className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${
          appearance === 'dark'
            ? 'border-primary bg-primary/5 text-primary shadow-sm'
            : 'border-transparent bg-muted text-muted-foreground hover:border-muted-foreground/30'
        }`}
      >
        <Moon className="size-5" />
        Dark
      </button>
    </div>
  );
}

export function LanguageSectionContent({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (lang: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="language" className="text-sm font-medium">Language</Label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function SectionCard({ icon, title, badge, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl bg-card shadow-sm p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">{title}</h2>
          {badge && (
            <Badge
              variant={badge === 'Verified' ? 'secondary' : 'default'}
              className="text-xs dark:!text-black"
            >
              {badge}
            </Badge>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

import { useUpdateProfileMutation, useUpdatePasswordMutation, useUploadAvatarMutation, useUpdateNotificationsMutation } from '@/api/user.api';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function SettingsContent({ state }: { state: UseAccountSettingsReturn }) {
  const { data: user } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [updateNotifications] = useUpdateNotificationsMutation();

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
      }).unwrap();
      toast.success('Profile updated successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (currentPass: string | undefined, newPass: string) => {
    if (!newPass) {
      toast.error('New password is required');
      return;
    }
    try {
      await updatePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      }).unwrap();
      toast.success('Password updated successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update password');
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await uploadAvatar(formData).unwrap();
      toast.success('Avatar uploaded successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to upload avatar');
    }
  };

  const handleToggleNotifications = async (checked: boolean) => {
    state.setEmailNotifications(checked);
    try {
      await updateNotifications({ enabled: checked }).unwrap();
      toast.success('Notifications settings updated');
    } catch (e: any) {
      toast.error('Failed to update notifications');
      state.setEmailNotifications(!checked); // revert
    }
  };

  return (
    <main className="min-w-0 flex-1 space-y-4">
      <h1 className="mb-6 text-2xl font-semibold">Account settings</h1>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10"><User className="size-4 text-primary" /></div>}
        title="Profile & Security"
      >
        <ProfileSectionContent
          firstName={state.firstName}
          lastName={state.lastName}
          email={state.email}
          setFirstName={state.setFirstName}
          setLastName={state.setLastName}
          setEmail={state.setEmail}
          provider={state.provider}
          avatarUrl={user?.avatarUrl}
          onSaveProfile={handleSaveProfile}
          onUpdatePassword={handleUpdatePassword}
          onUploadAvatar={handleUploadAvatar}
        />
      </SectionCard>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950"><Bell className="size-4 text-amber-500" /></div>}
        title="Email notifications"
      >
        <NotificationsSectionContent
          emailNotifications={state.emailNotifications}
          setEmailNotifications={handleToggleNotifications}
        />
      </SectionCard>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950"><Sun className="size-4 text-purple-500" /></div>}
        title="Appearance"
      >
        <AppearanceSectionContent
          appearance={state.appearance}
          setAppearance={state.setAppearance}
        />
      </SectionCard>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950"><Globe className="size-4 text-emerald-500" /></div>}
        title="Language"
        badge="New"
      >
        <LanguageSectionContent
          language={state.language}
          setLanguage={state.setLanguage}
        />
      </SectionCard>
    </main>
  );
}

export function SettingsSidebar() {
  return (
    <aside className="w-52 shrink-0">
      <nav className="flex flex-col gap-1">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            My profile
          </p>
          <Link
            to="/account"
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Account settings
          </Link>
        </div>
        <Link
          to="#help"
          className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="size-4" />
          Help
        </Link>
      </nav>
    </aside>
  );
}
