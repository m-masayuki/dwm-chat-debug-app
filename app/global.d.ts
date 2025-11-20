declare global {
  interface Window {
    MyBridge: {
      postMessage: (msg: string) => void;
    };
  }
}

declare global {
  interface Window {
    receiveFromMaui: (msg: string) => void;
  }
}

export {};
