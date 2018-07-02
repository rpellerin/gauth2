const closeNotification = notification => () => notification.close()

export const notify = text => {
  let notification
  if (!('Notification' in window)) {
    window.alert(text)
  } else if (Notification.permission === 'granted') {
    notification = new Notification(text)
    setTimeout(closeNotification(notification), 3000)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(permission => {
      if (permission === 'granted') {
        notification = new Notification(text)
        setTimeout(closeNotification(notification), 3000)
      } else {
        window.alert(text)
      }
    })
  }
}
