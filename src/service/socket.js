const io = require('socket.io-client');
import Clipboard from '@react-native-clipboard/clipboard';
import {ToastAndroid} from 'react-native';
// import SmsRetriever from 'react-native-android-sms-listener';
import {aesDecrypt, aesEncrypt, tryCatch} from '../utils/index';
// import Notification from './notification.js';
import {DeviceEventEmitter} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

export default class Socket {
  constructor({
    channel,
    server,
    showTips,
    pwd,
    broadcastNotify,
    keepNotification,
  }) {
    this.channel = channel;
    this.server = server;
    this.showTips = showTips;
    this.broadcastNotify = broadcastNotify;
    this.pwd = pwd;
    this.keepNotification = keepNotification;

    this.NotificationListenner = this.NotificationListenner.bind(this);

    this.initIO();
    this.init();
  }
  initIO() {
    const socket = io(this.server, {
      autoConnect: true,
      path: '/socket/',
      transports: ['websocket'],
    });
    socket.on('error', console.error);
    this.socket = socket;

    socket.on('connect', async () => {
      socket.emit('join', this.channel);
      ToastAndroid.show('剪贴板连接成功', ToastAndroid.SHORT);
    });
    socket.on('reconnect', () => {
      ToastAndroid.show('剪贴板重连成功', ToastAndroid.SHORT);
      // 连接断开
    });
    socket.on('disconnect', () => {
      ToastAndroid.show('剪贴板连接断开', ToastAndroid.SHORT);
      // 连接断开
    });
    socket.on('data', args => {
      try {
        if (this.pwd) {
          // 尝试解密
          args = aesDecrypt(args, this.pwd);
        }
        args = JSON.parse(args);
        if (args.type === 'text') {
          // Clipboard.setString('hello world');
          Clipboard.setString(args.data.text);
          this.last = args.data.text;
          this.showTips &&
            ToastAndroid.show('粘贴自: 远程剪贴板', ToastAndroid.SHORT);
          // clipboard.write(args.data);
        } else if (args.type === 'image') {
          // clipboard.writeImage(nativeImage.createFromDataURL(args.data));
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  NotificationListenner(event) {
    event = JSON.parse(event);
    const {app, title, titleBig, text, subText, summaryText, bigText} = event;
    if (app === 'com.clipboardsync') {
      return;
    }
    this.sendNotification({
      title: title || titleBig,
      text: text || summaryText || subText || bigText,
    });
  }

  async init() {
    if (this.keepNotification) {
      tryCatch(() => {
        // Notification.createKeepAlive();
        ReactNativeForegroundService.add_task(
          async () => console.log('task - looped'),
          {
            delay: 100000000,
            onLoop: true,
            taskId: 'keepNotification',
            onError: e => console.log('Error logging:', e),
          },
        );
        ReactNativeForegroundService.start({
          id: 144,
          title: '剪贴板同步',
          message: '服务运行中',
        });
      });
    }
    if (this.broadcastNotify) {
      tryCatch(() => {
        this.notifySubsciption = DeviceEventEmitter.addListener(
          'notification',
          this.NotificationListenner,
        );
      });
    }
  }
  sendNotification(notifyData) {
    let data = JSON.stringify({
      type: 'notification',
      data: notifyData,
    });
    this.emit(data);
  }

  async sendText(cur) {
    if (!cur) {
      cur = await Clipboard.getString();
    }
    ToastAndroid.show('发送到远程剪贴板', ToastAndroid.SHORT);
    this.last = cur;
    let data = JSON.stringify({
      type: 'text',
      data: {
        text: cur,
      },
    });
    this.emit(data);
  }

  emit(data) {
    if (this.pwd) {
      data = aesEncrypt(data, this.pwd);
    }
    this.socket.emit('data', data);
  }

  destory() {
    if (this.socket && this.socket.connected) {
      tryCatch(() => {
        this.socket.disconnect();
        this.socket.close();
      });
    }

    if (this.notifySubsciption) {
      tryCatch(() => {
        this.notifySubsciption.remove();
      });
    }

    if (this.keepNotification) {
      tryCatch(() => {
        // Notification.destoryAll();
        ReactNativeForegroundService.remove_task('keepNotification');
        ReactNativeForegroundService.stop();
      });
    }
  }
}
