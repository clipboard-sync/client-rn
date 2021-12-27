const PushNotification = require('react-native-push-notification');

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },

  onAction: function (notification) {
    // process the action
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: false,
});

PushNotification.createChannel(
  {
    channelId: 'KeepAlive', // (required)
    channelName: 'ClipSync 运行中', // (required)
    channelDescription: 'ClipSync 服务运行通知', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: PushNotification.Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: false,
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export default class KeepAliveNotification {
  static createKeepAlive() {
    PushNotification.cancelLocalNotification('1');
    PushNotification.localNotification({
      channelId: 'KeepAlive', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      ongoing: true, // (optional) set whether this is an "ongoing" notification

      id: '1',
      title: '剪贴板同步',
      message: '服务运行中',
      userInfo: {},
      playSound: false,
    });
  }
  static destoryAll() {
    PushNotification.cancelLocalNotification('1');
  }
}
