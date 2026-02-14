
// Simple notification sound (Beep)
const playNotificationSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

export const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
        playNotificationSound();
        try {
            new Notification(title, {
                body,
                icon: '/src/assets/logo.png', // Fallback if logo not loaded
                vibrate: [200, 100, 200]
            });
        } catch (e) {
            console.error("Notification failed", e);
        }
    }
};
