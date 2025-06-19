import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation} from '@react-navigation/native';
// import {
//   ZebraEvent,
//   ZebraEventEmitter,
//   connectToDevice,
//   getAllDevices,
//   type ZebraResultPayload,
//   type ZebraRfidResultPayload,
// } from 'react-native-zebra-rfid-barcode';
import {debounce} from 'lodash';

const dummyRfids = ['4C5071020190000000081386', '4C5071020190000000081350'];

const AddRfidScreen = () => {
  const navigation = useNavigation<any>();
  const [rfids, setRfids] = useState(dummyRfids);

  // RFID SCAN
  const [listDevices, setListDevices] = useState<string[]>([]);
  const [listBarcodes, setListBarcodes] = useState<string[]>([]);
  const [listRfid, setListRfid] = useState<string[]>([]);
  // useEffect(() => {
  //   getListRfidDevices();

  //   const barcodeEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_BARCODE,
  //     (e: ZebraResultPayload) => {
  //       handleBarcodeEvent(e.data);
  //     },
  //   );

  //   const rfidEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_RFID,
  //     (e: ZebraRfidResultPayload) => {
  //       handleRfidEvent(e.data);
  //     },
  //   );

  //   const deviceConnectEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_DEVICE_CONNECTED,
  //     (e: ZebraResultPayload) => {
  //       console.log(e.data); // "Connect successfully" || "Connect failed"
  //       // Alert.alert(e.data);
  //       ToastAndroid.show(e.data, ToastAndroid.SHORT);
  //     },
  //   );

  //   return () => {
  //     barcodeEvent.remove();
  //     rfidEvent.remove();
  //     deviceConnectEvent.remove();
  //   };
  // }, []);

  // const handleRfidEvent = useCallback(
  //   debounce((newData: string[]) => {
  //     setListRfid(pre => {
  //       // Prevent duplicates
  //       const set = new Set(pre);
  //       newData.forEach(item => set.add(item));
  //       return Array.from(set);
  //     });
  //   }, 200),
  //   [],
  // );

  // const handleBarcodeEvent = useCallback(
  //   debounce((newData: string) => {
  //     setListBarcodes(pre => {
  //       // Prevent duplicates
  //       if (pre.includes(newData)) return pre;
  //       return [...pre, newData];
  //     });
  //   }, 200),
  //   [],
  // );

  // const getListRfidDevices = async () => {
  //   const listDevices = await getAllDevices();
  //   setListDevices(listDevices);
  // };

  const handleRegisterNew = () => {
    // TODO: Implement register new RFID logic
    // For now, just add a dummy
    setRfids(prev => [
      ...prev,
      `4C50710201900000000${Math.floor(Math.random() * 1000000)}`,
    ]);
  };

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.rfidCard}>
      {/* <View style={[styles.sideBar, {backgroundColor: 'gray'}]} /> */}
      <Text style={styles.rfidText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row justify-center py-8 bg-blue-100">
        <Icon library="Feather" name="alert-circle" />
        <Text className="mx-3 text-xl font-semibold text-blue-700">
          Please scan on tags
        </Text>
      </View>
      <FlatList
        data={listRfid}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="ADD RFID"
          onPress={handleRegisterNew}
          size="large"
          color="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#285a8d',
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 40, // To center title visually
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  rfidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // paddingVertical: 18,
    // paddingHorizontal: 16,
    padding: 12,
  },
  sideBar: {
    width: 18,
    height: '100%',
    backgroundColor: '#b0b0b0',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 16,
  },
  rfidText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
});

export default AddRfidScreen;
