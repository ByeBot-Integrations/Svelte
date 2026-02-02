declare global {
  interface Window {
    Captchacat?: {
      render: (container?: HTMLElement) => void;
    };
    [key: string]: unknown;
  }
}

export {};
