
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get visitor information
        const userAgent = navigator.userAgent;
        const currentPath = window.location.pathname;
        const referrer = document.referrer || 'direct';
        
        // Get visitor's IP and location (using a simple approach)
        let ipData = null;
        try {
          const response = await fetch('https://ipapi.co/json/');
          ipData = await response.json();
        } catch (error) {
          console.log('Could not fetch IP data:', error);
        }

        // Create visitor session
        const sessionData = {
          ip_address: ipData?.ip || 'unknown',
          user_agent: userAgent,
          device_type: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop',
          browser: getBrowserName(userAgent),
          operating_system: getOperatingSystem(userAgent),
          country: ipData?.country_name || 'unknown',
          city: ipData?.city || 'unknown',
          region: ipData?.region || 'unknown',
          page_url: currentPath,
          referrer: referrer,
          session_start: new Date().toISOString(),
          last_activity: new Date().toISOString()
        };

        // Insert visitor data
        const { error } = await supabase
          .from('visitor_analytics')
          .insert([sessionData]);

        if (error) {
          console.error('Error tracking visitor:', error);
        }

        // Track page views
        const trackPageView = () => {
          const pageViewData = {
            session_id: null, // We'll need to get this from the session
            page_url: window.location.pathname,
            visit_duration: 0,
            visited_at: new Date().toISOString()
          };

          supabase
            .from('page_views')
            .insert([pageViewData])
            .then(({ error }) => {
              if (error) console.error('Error tracking page view:', error);
            });
        };

        // Track initial page view
        trackPageView();

        // Track page changes (for SPAs)
        let currentUrl = window.location.pathname;
        const checkUrlChange = () => {
          if (window.location.pathname !== currentUrl) {
            currentUrl = window.location.pathname;
            trackPageView();
          }
        };

        // Check for URL changes every second
        const urlCheckInterval = setInterval(checkUrlChange, 1000);

        // Cleanup
        return () => {
          clearInterval(urlCheckInterval);
        };

      } catch (error) {
        console.error('Error in visitor tracking:', error);
      }
    };

    trackVisitor();
  }, []);

  return null; // This component doesn't render anything
}

function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOperatingSystem(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}
