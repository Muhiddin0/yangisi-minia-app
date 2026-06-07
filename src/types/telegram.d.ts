// Minimal Telegram WebApp typings. The richer SDK integration (theme,
// BackButton, MainButton, viewport) is handled separately; we only need
// initData here to authenticate.
export {};

interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: TelegramWebAppUser };
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}
