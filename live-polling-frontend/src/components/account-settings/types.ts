export type SectionId = 'name' | 'email' | 'notifications' | 'appearance' | 'language';

export type AppearanceMode = 'light' | 'dark';

export interface AccountSettingsState {
  displayName: string;
  email: string;
  emailVerified: boolean;
  emailNotifications: boolean;
  appearance: AppearanceMode;
  language: string;
}

export interface UseAccountSettingsReturn extends AccountSettingsState {
  setDisplayName: (name: string) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setAppearance: (mode: AppearanceMode) => void;
  setLanguage: (lang: string) => void;
}

