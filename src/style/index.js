import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  baseText: {
    fontFamily: '',
  },
  sendBtn: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#25c2a0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    height: '100%',
    marginLeft: '5%',
    marginTop: 30,
  },
  header: {
    marginBottom: 20,
    fontSize: 20,
  },
  app: {
    backgroundColor: '#efefef',
    height: '100%',
  },
  inputItem: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  formItem: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  // notifyFilter
  floatConatiner: {
    marginTop: 20,
    width: '90%',
    marginLeft: '5%',
  },
  list: {
    backgroundColor: '#eeeeee',
    marginBottom: 20,
  },
  appBlock: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    flex: 1,
    marginTop: 5,
  },
  notifyBlock: {
    backgroundColor: '#ffffff',
    marginTop: 5,
  },
  notifyBlockTitle: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  notifyBlockMessage: {
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
  },
  inputItemWhiteList: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 20,
  },
  saveBtn: {
    marginBottom: 20,
  },
});
