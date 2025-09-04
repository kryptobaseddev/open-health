import { useEffect, useState } from 'react';

/**
 * Hook to manage CSRF tokens for API calls
 */
export function useCSRF() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);

  useEffect(() => {
    // Get CSRF token from cookie
    const getToken = () => {
      const match = document.cookie.match(new RegExp('(^| )__Host-csrf=([^;]+)'));
      return match ? match[2] : null;
    };

    setCSRFToken(getToken());

    // Update token when cookies change
    const interval = setInterval(() => {
      const newToken = getToken();
      if (newToken !== csrfToken) {
        setCSRFToken(newToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [csrfToken]);

  // Helper function to add CSRF token to fetch requests
  const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    
    if (csrfToken && !['GET', 'HEAD'].includes(options.method?.toUpperCase() || 'GET')) {
      headers.set('x-csrf-token', csrfToken);
    }

    return fetch(url, {
      ...options,
      headers
    });
  };

  return { csrfToken, fetchWithCSRF };
}