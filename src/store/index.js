import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
  constructor() {}
  async getValues(key = '@systemConfig', def = {}) {
    const config = await AsyncStorage.getItem(key);
    if (config !== null) {
      return JSON.parse(config);
    } else {
      return def;
    }
  }
  async setValues(config, key = '@systemConfig') {
    await AsyncStorage.setItem(key, JSON.stringify(config));
  }
}
