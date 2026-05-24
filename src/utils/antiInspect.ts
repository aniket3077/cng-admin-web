export function initAntiInspect(): void {
  // NOTE: You cannot reliably prevent DevTools in a real browser.
  // This is a lightweight deterrent for casual “Inspect Element” usage.
  // Disable console usage (best-effort). Users can still re-enable via DevTools,
  // but this blocks most casual access.
  try {
    const noop = () => undefined;
    const methods: Array<keyof Console> = [
      'log',
      'debug',
      'info',
      'warn',
      'error',
      'trace',
      'dir',
      'dirxml',
      'table',
      'group',
      'groupCollapsed',
      'groupEnd',
      'time',
      'timeEnd',
      'timeLog',
      'count',
      'countReset',
      'assert',
      'clear',
    ];

    for (const method of methods) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (console as any)[method] = noop;
      } catch {
        // ignore
      }
    }

    try {
      Object.freeze(console);
    } catch {
      // ignore
    }

    window.setInterval(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (console as any).clear?.();
      } catch {
        // ignore
      }
    }, 1000);
  } catch {
    // ignore
  }

  // Block common DevTools / view-source shortcuts.
  window.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = typeof event.key === 'string' ? event.key.toLowerCase() : '';
      const platform = typeof navigator.platform === 'string' ? navigator.platform : '';
      const isMac = platform.toLowerCase().includes('mac');

      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      const isF12 = event.key === 'F12';
      const isDevToolsCombo =
        ctrlOrCmd && event.shiftKey && (key === 'i' || key === 'j' || key === 'c');
      const isViewSource = ctrlOrCmd && key === 'u';

      if (isF12 || isDevToolsCombo || isViewSource) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { capture: true },
  );

}
