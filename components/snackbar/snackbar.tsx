'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarNotification = ({ show }: { show: boolean }) => {
  const [open, setOpen] = useState(false);
  const [notificationSound, setNotificationSound] =
    useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio instance on the client side
    console.log('this will run once');
    const sound = new Audio('notification.mp3'); // Ensure this path is correct
    setNotificationSound(sound);

    // Clean up the audio object when the component unmounts
    return () => {
      sound.pause(); // Pause if it's playing
      sound.currentTime = 0; // Reset to the start
    };
  }, []);

  useEffect(() => {
    console.log('show use effect');
    if (show) {
      setOpen(true);
      // Play sound when the Snackbar is shown
      notificationSound?.play();
    } else {
      setOpen(false);
      notificationSound?.pause();
      if (notificationSound)
        // Pause if it's playing
        notificationSound.currentTime = 0;
    }
  }, [show]);

  return (
    <div>
      {/* Snackbar Component */}
      <Snackbar
        open={open}
        autoHideDuration={3000} // Duration to display the Snackbar
        onClose={undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {/* Alert inside Snackbar for a styled message */}
        <Alert onClose={undefined} severity="success" sx={{ width: '100%' }}>
          New Order!!!!!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarNotification;
