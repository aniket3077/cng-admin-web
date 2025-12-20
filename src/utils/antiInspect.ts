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

  const blockEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Block right-click context menu.
  window.addEventListener('contextmenu', blockEvent, { capture: true });

  // Extra hardening: prevent right/middle click events that can sometimes still trigger menus/actions.
  window.addEventListener(
    'mousedown',
    (event: MouseEvent) => {
      if (event.button === 2 || event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { capture: true },
  );

  window.addEventListener(
    'auxclick',
    (event: MouseEvent) => {
      // Typically middle click; some environments use auxclick for non-left buttons.
      if (event.button === 2 || event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { capture: true },
  );

  // Block common DevTools / view-source shortcuts.
  window.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isMac = navigator.platform.toLowerCase().includes('mac');

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

  // Basic DevTools-open detection (not foolproof). If detected, repeatedly hit `debugger`.
  // This pauses execution when DevTools is open, discouraging inspection.
  const threshold = 160;
  window.setInterval(() => {
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    const devtoolsLikelyOpen = widthDiff > threshold || heightDiff > threshold;
    if (devtoolsLikelyOpen) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
  }, 1000);
}
