export type SectionId = 'name' | 'email' | 'notifications' | 'appearance' | 'language';

export type AppearanceMode = 'light' | 'dark';

export interface AccountSettingsState {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  emailNotifications: boolean;
  appearance: AppearanceMode;
  language: string;
  provider?: string;
}

export interface UseAccountSettingsReturn extends AccountSettingsState {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setEmail: (email: string) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setAppearance: (mode: AppearanceMode) => void;
  setLanguage: (lang: string) => void;
}

