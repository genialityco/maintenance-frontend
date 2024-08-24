import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { MdInstallMobile } from 'react-icons/md';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      showInstallNotification();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const showInstallNotification = () => {
    showNotification({
      title: 'Instala Galaxia Glamour',
      message: 'Añade Galaxia Glamour a tu pantalla de inicio para un acceso rápido y fácil.',
      icon: <MdInstallMobile size={24} />,
      autoClose: false,
      actions: [
        {
          label: 'Instalar',
          onClick: handleInstallClick,
        },
      ],
    });
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return null;
};

export default InstallPrompt;
