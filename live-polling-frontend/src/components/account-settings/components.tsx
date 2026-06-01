import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Camera,
  Globe,
  HelpCircle,
  KeyRound,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from './data.const';
import type { AppearanceMode, UseAccountSettingsReturn } from './types';
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
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUploadAvatarMutation,
  useUpdateNotificationsMutation,
} from '@/api/user.api';
import { toast } from 'sonner';

const ProfileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

const PasswordSchema = yup.object({
  currentPassword: yup.string(),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
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
  onUploadAvatar,
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
  onUpdatePassword?: (
    currentPass: string | undefined,
    newPass: string,
  ) => void;
  onUploadAvatar?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const profileForm = useForm({
    resolver: yupResolver(ProfileSchema),
    values: {
      firstName: firstName,
      lastName: lastName || '',
      email: email,
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(PasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localAvatarUrl) URL.revokeObjectURL(localAvatarUrl);
    };
  }, [localAvatarUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setLocalAvatarUrl(url);
    }

    if (onUploadAvatar) onUploadAvatar(e);
  };

  return (
    <div className="flex flex-col gap-8">
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit((data) => {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setTimeout(() => onSaveProfile?.(), 0);
          })}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="group relative mt-1 shrink-0 cursor-pointer">
              <Avatar className="size-24 ring-4 ring-primary/10 ring-offset-4 ring-offset-white dark:ring-offset-[#07111f]">
                <AvatarImage
                  src={localAvatarUrl || avatarUrl || ''}
                  alt="Avatar"
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-black text-primary">
                  {getInitials(`${firstName} ${lastName}`)}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Last name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                        {...field}
                      />
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
                      <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <Button
              type="submit"
              size="sm"
              className="h-10 rounded-2xl bg-primary px-5 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Save changes
            </Button>
          </div>
        </form>
      </Form>

      <div className="w-full border-t border-slate-200/70 dark:border-white/10" />

      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit((data) => {
            if (onUpdatePassword) {
              onUpdatePassword(
                provider === 'local' ? data.currentPassword : undefined,
                data.newPassword,
              );
              passwordForm.reset();
            }
          })}
          className="flex flex-col gap-4"
        >
          <div>
            <h3 className="text-base font-black tracking-[-0.02em] text-slate-900 dark:text-white">
              Change Password
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {provider === 'local' && (
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Current password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                        {...field}
                      />
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
                  <FormLabel className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    New password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-2xl border-slate-200/80 bg-white/70 font-medium shadow-none transition-all duration-300 focus-visible:border-primary focus-visible:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <Button
              type="submit"
              size="sm"
              className="h-10 rounded-2xl bg-secondary px-5 font-black text-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/90"
            >
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black text-slate-900 dark:text-white">
          Receive email notifications
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
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
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => setAppearance('light')}
        className={`flex min-w-32 flex-col items-center gap-2 rounded-2xl border px-6 py-4 text-sm font-black transition-all duration-300 ${
          appearance === 'light'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-slate-200/70 bg-white/70 text-slate-500 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-400'
        }`}
      >
        <Sun className="size-5" />
        Light
      </button>

      <button
        type="button"
        onClick={() => setAppearance('dark')}
        className={`flex min-w-32 flex-col items-center gap-2 rounded-2xl border px-6 py-4 text-sm font-black transition-all duration-300 ${
          appearance === 'dark'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-slate-200/70 bg-white/70 text-slate-500 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-400'
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
      <Label
        htmlFor="language"
        className="text-sm font-bold text-slate-700 dark:text-slate-200"
      >
        Language
      </Label>

      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger 
          id="language"
          className="flex h-12 w-full max-w-xs rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-200 shadow-none"
        >
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl dark:border-white/10 dark:bg-[#07111f]/95 backdrop-blur-xl">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang} className="rounded-xl">
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  badge?: string;
  children: ReactNode;
}

function SectionCard({ icon, title, badge, children }: SectionCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white/[0.88] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-5 flex items-center gap-3">
        {icon}

        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
            {title}
          </h2>

          {badge && (
            <Badge
              variant={badge === 'Verified' ? 'secondary' : 'default'}
              className="rounded-full bg-primary/10 text-xs font-black text-primary shadow-none hover:bg-primary/10"
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

export function SettingsContent({
  state,
}: {
  state: UseAccountSettingsReturn;
}) {
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

  const handleUpdatePassword = async (
    currentPass: string | undefined,
    newPass: string,
  ) => {
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

  const handleUploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
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
      state.setEmailNotifications(!checked);
    }
  };

  return (
    <main className="min-w-0 flex-1 space-y-5">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/[0.72] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]">
        <div className="mb-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <Settings className="size-3.5" />
          Settings
        </div>

        <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
          Account settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Manage your profile, security preferences, notifications, appearance,
          and language settings.
        </p>
      </div>

      <SectionCard
        icon={
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
        }
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
        icon={
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-primary">
            <Bell className="size-5" />
          </div>
        }
        title="Email notifications"
      >
        <NotificationsSectionContent
          emailNotifications={state.emailNotifications}
          setEmailNotifications={handleToggleNotifications}
        />
      </SectionCard>

      <SectionCard
        icon={
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sun className="size-5" />
          </div>
        }
        title="Appearance"
      >
        <AppearanceSectionContent
          appearance={state.appearance}
          setAppearance={state.setAppearance}
        />
      </SectionCard>

      <SectionCard
        icon={
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-primary">
            <Globe className="size-5" />
          </div>
        }
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
    <aside className="w-full shrink-0 lg:w-60">
      <nav className="sticky top-24 flex flex-col gap-3 rounded-[2rem] border border-slate-200/70 bg-white/[0.88] p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>

        <div className="mt-2">
          <p className="mb-2 px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            My profile
          </p>

          <Link
            to="/account"
            className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2.5 text-sm font-black text-primary"
          >
            <Settings className="size-4" />
            Account settings
          </Link>
        </div>

        <div className="my-2 h-px bg-slate-200/70 dark:bg-white/10" />

        <div className="rounded-2xl bg-slate-50/70 p-3 dark:bg-white/[0.04]">
          <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-secondary/15 text-primary">
            <KeyRound className="size-5" />
          </div>

          <p className="text-sm font-black text-slate-900 dark:text-white">
            Secure account
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Keep your profile and security preferences up to date.
          </p>
        </div>

        <Link
          to="#help"
          className="mt-auto flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-slate-500 transition-colors duration-200 hover:bg-primary/10 hover:text-primary dark:text-slate-400"
        >
          <HelpCircle className="size-4" />
          Help
        </Link>
      </nav>
    </aside>
  );
}