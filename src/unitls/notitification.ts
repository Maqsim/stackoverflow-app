import notificationSoundPath from '../../assets/notification.ogg';

export function notification(title: string, body: string) {
  const notificationSound = new Audio(notificationSoundPath);
  notificationSound.volume = 0.5;

  return new Promise((resolve) => {
    new Notification(title, { body }).onclick = resolve;
    notificationSound.play();
  });
}
