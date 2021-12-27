/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';
import {DeviceEventEmitter} from 'react-native';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () =>
    async ({notification}) => {
      if (notification) {
        DeviceEventEmitter.emit('notification', notification);
      }
    },
);
