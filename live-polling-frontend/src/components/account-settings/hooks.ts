import { useState } from 'react';
import type { AppearanceMode, UseAccountSettingsReturn } from './types';
import {
  DEFAULT_DISPLAY_NAME,
  DEFAULT_EMAIL,
  DEFAULT_EMAIL_VERIFIED,
  DEFAULT_EMAIL_NOTIFICATIONS,
  DEFAULT_LANGUAGE,
} from './data.const';
import { useTheme } from '@/lib/useTheme';

export function useAccountSettings(): UseAccountSettingsReturn {
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(DEFAULT_DISPLAY_NAME);
  const [emailNotifications, setEmailNotifications] = useState(DEFAULT_EMAIL_NOTIFICATIONS);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  const setAppearance = (mode: AppearanceMode) => setTheme(mode);

  return {
    displayName,
    setDisplayName,
    email: DEFAULT_EMAIL,
    emailVerified: DEFAULT_EMAIL_VERIFIED,
    emailNotifications,
    setEmailNotifications,
    appearance: theme as AppearanceMode,
    setAppearance,
    language,
    setLanguage,
  };
}
