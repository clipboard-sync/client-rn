/**
 * @format
 */

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';
import {DeviceEventEmitter} from 'react-native';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';

ReactNativeForegroundService.register();
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
