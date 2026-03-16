import { Link } from 'react-router-dom';
import { HelpCircle, Moon, Sun, User, Bell, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LANGUAGES } from './data.const';
import type { AppearanceMode, UseAccountSettingsReturn } from './types';

export function NameSectionContent({
  displayName,
  setDisplayName,
  onSave,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  onSave?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-16 ring-2 ring-primary/20 ring-offset-2">
          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Label htmlFor="display-name" className="text-sm font-medium">Display name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="flex">
        <Button size="sm" onClick={onSave} className="px-5">
          Save changes
        </Button>
      </div>
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
              className="text-xs"
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

export function SettingsContent({ state }: { state: UseAccountSettingsReturn }) {
  return (
    <main className="min-w-0 flex-1 space-y-4">
      <h1 className="mb-6 text-2xl font-semibold">Account settings</h1>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10"><User className="size-4 text-primary" /></div>}
        title="Name & image"
      >
        <NameSectionContent
          displayName={state.displayName}
          setDisplayName={state.setDisplayName}
          onSave={() => console.log('Save:', state.displayName)}
        />
      </SectionCard>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950"><Mail className="size-4 text-blue-500" /></div>}
        title="Email"
        badge={state.emailVerified ? 'Verified' : undefined}
      >
        <p className="text-sm text-muted-foreground">{state.email}</p>
      </SectionCard>

      <SectionCard
        icon={<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950"><Bell className="size-4 text-amber-500" /></div>}
        title="Email notifications"
      >
        <NotificationsSectionContent
          emailNotifications={state.emailNotifications}
          setEmailNotifications={state.setEmailNotifications}
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
