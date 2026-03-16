import { useState } from 'react';
import { SettingsContent, SettingsSidebar, useAccountSettings } from '@/components/account-settings';
import DashboardHeader from '@/components/dashboard/header';

export default function AccountSettings() {
  const [searchQuery, setSearchQuery] = useState('');

  const settings = useAccountSettings();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        <SettingsSidebar />
        <SettingsContent state={settings} />
      </div>
    </div>
  );
}
