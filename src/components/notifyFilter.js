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
import styles from '../style';
import Store from '../store/index';
import {DeviceEventEmitter} from 'react-native';

const originMessages = []; //APP 运行期间所有的通知消息

function nofityListener(event) {
  event = JSON.parse(event);
  const {app, title, titleBig, text, subText, summaryText, bigText} = event;
  if (app === 'com.clipboardsync') {
    return;
  }
  const notifyTitle = title || titleBig;
  const notifyText = text || summaryText || subText || bigText;

  if (
    !originMessages.find(item => {
      return item.app === app;
    })
  ) {
    console.log(app, notifyTitle, notifyText);
    originMessages.push({
      app,
      notifyTitle,
      notifyText,
    });
  }
}

const notifySubsciption = DeviceEventEmitter.addListener(
  'notification',
  nofityListener,
);

const store = new Store();

export default function ({onClose}) {
  const [whiteListApps, setWhiteListApps] = useState([]);
  const [whiteListLetters, setWhiteListLetters] = useState('');

  useEffect(() => {
    (async () => {
      const config = await store.getValues('@whiteListApps', []);
      if (!Array.isArray(config)) {
        setWhiteListApps([]);
      } else {
        setWhiteListApps(config);
      }
    })();
    (async () => {
      const config = await store.getValues('@whiteListLetters', '');
      if (typeof config !== 'string') {
        setWhiteListLetters('');
      } else {
        setWhiteListLetters(config);
      }
    })();
  }, []);

  console.log('whiteListApps: ', whiteListApps);
  console.log('whiteListLetters: ', whiteListLetters);
  return (
    <ScrollView>
      <View style={styles.floatConatiner}>
        <View style={styles.saveBtn}>
          <Button
            color="#329070"
            onPress={() => {
              store.setValues(whiteListApps, '@whiteListApps');
              store.setValues(whiteListLetters, '@whiteListLetters');
              onClose();
            }}
            title="保存"
          />
        </View>
        <Text
          style={styles.baseText}
          textBreakStrategy="simple"
          numberOfLines={0}>
          白名单关键字(,逗号分隔)
        </Text>
        <TextInput
          style={styles.inputItemWhiteList}
          multiline={true}
          numberOfLines={5}
          value={whiteListLetters}
          placeholder="关键字"
          onChangeText={text => setWhiteListLetters(text)}
        />
        <Text
          style={styles.baseText}
          textBreakStrategy="simple"
          numberOfLines={0}>
          白名单应用
        </Text>
        <View style={styles.list}>
          {whiteListApps.map(item => {
            return (
              <View style={styles.appBlock} key={item}>
                <Text
                  style={styles.baseText}
                  textBreakStrategy="simple"
                  numberOfLines={0}>
                  {item}
                </Text>
                <Switch
                  onValueChange={_ =>
                    setWhiteListApps(whiteListApps.filter(i => i !== item))
                  }
                  value={true}
                />
              </View>
            );
          })}
        </View>
        <Text
          style={styles.baseText}
          textBreakStrategy="simple"
          numberOfLines={0}>
          待添加应用列表
        </Text>
        <View style={styles.list}>
          {originMessages
            .filter(item => {
              return !whiteListApps.includes(item.app);
            })
            .map(item => {
              return (
                <View style={styles.notifyBlock} key={'v' + item.app}>
                  <View style={styles.notifyBlockTitle}>
                    <Text
                      style={styles.baseText}
                      textBreakStrategy="simple"
                      numberOfLines={0}>
                      {item.app}
                    </Text>
                    <Switch
                      onValueChange={_ => {
                        setWhiteListApps([...whiteListApps, item.app]);
                      }}
                      value={false}
                    />
                  </View>
                  <View style={styles.notifyBlockMessage}>
                    <Text
                      style={styles.baseText}
                      textBreakStrategy="simple"
                      numberOfLines={0}>
                      {item.notifyTitle}
                    </Text>
                    <Text
                      style={styles.baseText}
                      textBreakStrategy="simple"
                      numberOfLines={0}>
                      {item.notifyText}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
}
