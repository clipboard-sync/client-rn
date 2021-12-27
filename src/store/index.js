import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
  constructor() {}
  async getValues() {
    const config = await AsyncStorage.getItem('@systemConfig');
    if (config !== null) {
      return JSON.parse(config);
    } else {
      return {};
    }
  }
  async setValues(config) {
    await AsyncStorage.setItem('@systemConfig', JSON.stringify(config));
  }
}
