declare global {
  interface Window {
    Byebot?: {
      render: (container?: HTMLElement) => void;
    };
    [key: string]: unknown;
  }
}

export {};
