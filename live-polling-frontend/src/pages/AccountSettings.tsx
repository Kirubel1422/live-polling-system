import { useState } from 'react';
import {
  SettingsContent,
  SettingsSidebar,
  useAccountSettings,
} from '@/components/account-settings';
import DashboardHeader from '@/components/dashboard/header';

export default function AccountSettings() {
  const [searchQuery, setSearchQuery] = useState('');

  const settings = useAccountSettings();

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.18),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(5,152,206,.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(51,195,255,.12),transparent_34%)]" />
      <div className="premium-grid absolute inset-0 -z-10 opacity-75" />

      <div className="absolute left-1/2 top-1/2 -z-10 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl dark:bg-primary/8" />
      <div className="absolute left-[18%] top-[18%] -z-10 size-72 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-[14%] right-[12%] -z-10 size-80 rounded-full bg-secondary/16 blur-3xl dark:bg-secondary/10" />

      <div className="relative z-10">
        <DashboardHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="fade-up mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:gap-8">
          <SettingsSidebar />
          <SettingsContent state={settings} />
        </div>
      </div>
    </div>
  );
}