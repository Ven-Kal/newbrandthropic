
import { useEffect } from 'react';

interface GoogleTagManagerProps {
  gtmId?: string;
}

export function GoogleTagManager({ gtmId = 'GTM_CONTAINER_ID' }: GoogleTagManagerProps) {
  useEffect(() => {
    // Only load if GTM ID is provided and not the default placeholder
    if (!gtmId || gtmId === 'GTM_CONTAINER_ID') {
      console.log('Google Tag Manager: No container ID provided');
      return;
    }

    // Load Google Tag Manager script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(noscript);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [gtmId]);

  return null;
}

// Utility function to push events to dataLayer
export const pushToDataLayer = (event: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

// Declare dataLayer for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}
