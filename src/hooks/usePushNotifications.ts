import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { notificationClient } from '../api/client';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [status, setStatus] = useState('Push notifications placeholder ready');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = await Notifications.getPermissionsAsync();
        if (!settings.granted) {
          const requested = await Notifications.requestPermissionsAsync();
          if (!requested.granted) {
            if (mounted) setStatus('Notification permission denied');
            return;
          }
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await notificationClient.registerPushToken(token);
        if (mounted) setStatus('Push token registered for Firebase/OneSignal-ready layer');
      } catch {
        if (mounted) setStatus('Push notifications configured as a placeholder; native credentials still required');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return status;
}
