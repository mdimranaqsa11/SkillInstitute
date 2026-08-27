import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AlertDialog from '../components/feedback/AlertDialog';

const AlertContext = createContext(null);

const FAILURE_PATTERN = /fail|error|could not|unable|cannot/i;

function resolveVariant(title, message, buttons) {
  if (buttons && buttons.length > 1) return 'confirm';
  const text = `${title || ''} ${message || ''}`;
  return FAILURE_PATTERN.test(text) ? 'error' : 'success';
}

export function AlertProvider({ children }) {
  const [state, setState] = useState(null);

  // Same signature as React Native's Alert.alert(title, message, buttons, options)
  // so existing call sites only need the import swapped.
  const showAlert = useCallback((title, message, buttons, options = {}) => {
    setState({
      title,
      message,
      buttons,
      variant: options.variant || resolveVariant(title, message, buttons),
    });
  }, []);

  const hideAlert = useCallback(() => setState(null), []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertDialog
        visible={!!state}
        title={state?.title}
        message={state?.message}
        buttons={state?.buttons}
        variant={state?.variant}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}
