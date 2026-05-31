import { useState, useEffect } from 'react';
import type { AppearanceMode, UseAccountSettingsReturn } from './types';
import { useGetMeQuery } from '@/api/auth.api';
import {
  DEFAULT_EMAIL_VERIFIED,
  DEFAULT_EMAIL_NOTIFICATIONS,
  DEFAULT_LANGUAGE,
} from './data.const';
import { useTheme } from '@/lib/useTheme';

export function useAccountSettings(): UseAccountSettingsReturn {
  const { theme, setTheme } = useTheme();

  const { data: user } = useGetMeQuery();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(DEFAULT_EMAIL_NOTIFICATIONS);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (user?.displayName) {
      const parts = user.displayName.trim().split(/\s+/);
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const setAppearance = (mode: AppearanceMode) => setTheme(mode);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    emailVerified: DEFAULT_EMAIL_VERIFIED,
    emailNotifications,
    setEmailNotifications,
    appearance: theme as AppearanceMode,
    setAppearance,
    language,
    setLanguage,
    provider: user?.provider || 'local',
  };
}
