import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  View,
  TextInput,
  Text,
  Switch,
  Modal,
  TouchableOpacity,
} from 'react-native';
import styles from './style';
import Store from './store/index';
import ClipSocket from './service/socket';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';

import NotifyFilter from './components/notifyFilter';
// import RNAndroidAppList from 'react-native-android-app-list';

// RNAndroidAppList.getAllPermissions().then(data => {
//   console.log(data);
// });

// import RNAndroidInstalledApps from 'react-native-android-installed-apps';

// RNAndroidInstalledApps.getApps()
//   .then(apps => {
//     console.log(apps);
//   })
//   .catch(error => {});

const store = new Store();
let service = null;

export default function AppComponent() {
  const [state, setState] = useState(async () => {
    const config = await store.getValues();
    setState(
      Object.assign(
        {
          server: '',
          channel: '',
          pwd: '',
          showTips: false,
          keepNotification: false, // 通知栏保活
          broadcastNotify: false,
          sync: false,
          modalVisible: false,
        },
        config,
      ),
    );
  });
  useEffect(() => {
    store.setValues(state);
  });

  useEffect(() => {
    if (state.sync) {
      service = new ClipSocket(state);
    } else {
      service && service.destory && service.destory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sync]);
  return (
    <SafeAreaView style={styles.app}>
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor="#efefef" />

        <Modal
          animationType="slide"
          transparent={false}
          visible={state.modalVisible}
          onRequestClose={() => {
            setState({...state, modalVisible: false});
          }}>
          <NotifyFilter
            onClose={() => {
              setState({...state, modalVisible: false});
            }}
          />
        </Modal>

        <View style={styles.container}>
          <Text style={styles.header}>ClipSync</Text>
          <TextInput
            style={styles.inputItem}
            value={state.server}
            placeholder="远端服务器"
            editable={!state.sync}
            onChangeText={text => setState({...state, server: text})}
          />
          <TextInput
            style={styles.inputItem}
            value={state.channel}
            placeholder="请输入频道"
            editable={!state.sync}
            onChangeText={text => setState({...state, channel: text})}
          />
          <TextInput
            style={styles.inputItem}
            value={state.pwd}
            type="password"
            onChangeText={text => setState({...state, pwd: text})}
            editable={!state.sync}
            secureTextEntry={true}
            placeholder="密码"
          />
          <View style={styles.formItem}>
            <Text
              style={styles.baseText}
              textBreakStrategy="simple"
              numberOfLines={0}>
              显示远程剪贴提示
            </Text>
            <Switch
              onValueChange={val => setState({...state, showTips: val})}
              disabled={state.sync}
              value={state.showTips}
            />
          </View>
          <View style={styles.formItem}>
            <Text
              style={styles.baseText}
              textBreakStrategy="simple"
              numberOfLines={0}>
              通知栏保活
            </Text>
            <Switch
              onValueChange={val => setState({...state, keepNotification: val})}
              disabled={state.sync}
              value={state.keepNotification}
            />
          </View>
          <View style={styles.formItem}>
            <Text
              style={styles.baseText}
              textBreakStrategy="simple"
              numberOfLines={0}>
              转发本机通知
            </Text>
            <Button
              color="#aaaaaa"
              onPress={() => {
                setState({...state, modalVisible: true});
              }}
              title="白名单配置"
            />
            <Switch
              onValueChange={async val => {
                let status =
                  await RNAndroidNotificationListener.getPermissionStatus();
                console.log(status);
                if (state.broadcastNotify) {
                  setState({...state, broadcastNotify: val});
                } else {
                  if (status === 'authorized') {
                    setState({...state, broadcastNotify: val});
                  } else {
                    RNAndroidNotificationListener.requestPermission();
                  }
                }
              }}
              disabled={state.sync}
              value={state.broadcastNotify}
            />
          </View>
          <Button
            onPress={() => {
              setState({...state, sync: !state.sync});
            }}
            title={state.sync ? '停止服务' : '开启服务'}
          />
          {state.sync && (
            <View style={styles.sendBtn}>
              <Button
                color="#11ab0d"
                onPress={() => {
                  service && service.sendText();
                }}
                title="发送剪贴板"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
