declare global {
  interface Window {
    MyBridge: {
      postMessage: (msg: string) => void;
    };
  }
}

export {};
