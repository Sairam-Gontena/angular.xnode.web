  // Add global to window, assigning the value of window itself.
  (window as any).global = window;
 (window as any).process = { env: { DEBUG: undefined } };
