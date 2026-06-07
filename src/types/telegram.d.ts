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

interface TelegramHapticFeedback {
  impactOccurred?: (
    style: "light" | "medium" | "heavy" | "rigid" | "soft",
  ) => void;
  notificationOccurred?: (type: "error" | "success" | "warning") => void;
  selectionChanged?: () => void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: TelegramWebAppUser };
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
  /** Opens a t.me link inside Telegram (chats, share sheet, etc.). */
  openTelegramLink?: (url: string) => void;
  /** Opens an external http(s) link, optionally in the in-app browser. */
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  /** Native alert popup; the callback fires once the user dismisses it. */
  showAlert?: (message: string, callback?: () => void) => void;
  HapticFeedback?: TelegramHapticFeedback;
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}
