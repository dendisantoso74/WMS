import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ModalApp from '../../compnents/ModalApp';
import {
  ZebraEvent,
  ZebraEventEmitter,
  connectToDevice,
  getAllDevices,
  type ZebraResultPayload,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {debounce, uniq} from 'lodash';
import {generateSerialNumber} from '../../utils/helpers';
import {checkSerialNumber, taggingPo} from '../../services/materialRecive';

const TagInspectScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, poNumber} = route.params;
  console.log('RFIDs from params:', item, poNumber);

  const [modalTag, setModalTag] = useState(false);
  const [selectTag, setSelectTag] = useState('');
  const [serialGenerate, setSerialGenerate] = useState<string>('');

  // RFID SCANNER
  const [listDevices, setListDevices] = useState<string[]>([]);
  const [listBarcodes, setListBarcodes] = useState<string[]>([]);
  const [listRfid, setListRfid] = useState<string[]>([]);

  useEffect(() => {
    getListRfidDevices();

    const barcodeEvent = ZebraEventEmitter.addListener(
      ZebraEvent.ON_BARCODE,
      (e: ZebraResultPayload) => {
        handleBarcodeEvent(e.data);
      },
    );

    const rfidEvent = ZebraEventEmitter.addListener(
      ZebraEvent.ON_RFID,
      (e: ZebraRfidResultPayload) => {
        handleRfidEvent(uniq(e.data));
      },
    );

    const deviceConnectEvent = ZebraEventEmitter.addListener(
      ZebraEvent.ON_DEVICE_CONNECTED,
      (e: ZebraResultPayload) => {
        console.log(e.data); // "Connect successfully" || "Connect failed"
      },
    );

    return () => {
      barcodeEvent.remove();
      rfidEvent.remove();
      deviceConnectEvent.remove();
    };
  }, []);

  const handleRfidEvent = useCallback(
    debounce((newData: string[]) => {
      setListRfid(newData);
    }, 200),
    [],
  );

  const handleBarcodeEvent = useCallback(
    debounce((newData: string) => {
      setListBarcodes(pre => [...pre, newData]);
    }, 200),
    [],
  );

  const getListRfidDevices = async () => {
    const listDevices = await getAllDevices();
    setListDevices(listDevices);
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      onPress={() => {
        setModalTag(true), setSelectTag(item);
      }}
      className="w-full">
      <Text className="w-full px-2 py-4 mb-1 border rounded-sm border-stone-200">
        {item}
      </Text>
    </TouchableOpacity>
  );

  const checkSN = async () => {
    const serialNumber = await generateSerialNumber();
    console.log('Generated Serial Number:', serialNumber);
    checkSerialNumber(serialNumber).then((res: any) => {
      console.log('Check Serial Number Response:', res.status);
      if (res.status === 'AVAILABLE') {
        console.log('Serial Number is available:', serialNumber);
      }
    });
    // return serialNumber;
    setSerialGenerate(serialNumber);
  };

  const handleOnConfirm = async (id: string, tag: string, sn: string) => {
    setModalTag(false);
    if (tag) {
      // navigation.navigate('Po Detail', {
      //   item: item,
      //   tag: tag,
      // });
      console.log('Selected Tag:', tag, 'Serial Number:', sn, 'Item:', id);

      await taggingPo(id, sn, tag)
        .then((res: any) => {
          // console.log('Tagging Response:', res);
          Alert.alert('Success', `Tag ${tag} selected`);
          navigation.navigate('Po Detail', {listrfid: poNumber});
        })
        .catch(error => {
          // console.error('Error in tagging:', error.Error.message);
          ToastAndroid.show(error.Error.message, ToastAndroid.SHORT);
        });

      // navigation.goBack();
    } else {
      ToastAndroid.show('Please select a tag', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    checkSN();
  }, [listRfid]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-col p-2 bg-blue-400">
        <View className="flex-row items-start justify-start">
          <Text className="font-bold text-white">Material</Text>
          <Text className="w-64 ml-10 font-light text-white">
            {item.itemnum} / {item.description}
          </Text>
        </View>
        <View className="flex-row items-start justify-start">
          <Text className="font-bold text-white">Serial</Text>
          <Text className="w-64 ml-10 font-bold text-white">
            {item.serialnumber ? item.serialnumber : serialGenerate}
          </Text>
        </View>
        <View className="flex-row items-start justify-start">
          <Text className="font-bold text-white">Unit Order</Text>
          <Text className="w-64 ml-10 font-light text-white">
            {item.qtystored} {item.unitstored}
          </Text>
        </View>
      </View>

      {/* section rfid scanner */}
      {/* <View
        style={{
          maxHeight: 200,
          borderWidth: 1,
          borderColor: '#ccc',
          marginVertical: 8,
          // marginHorizontal: 4,
          // borderRadius: 8,
        }}>
        <Text style={[styles.text, styles.title]}>
          Devices Scanner: {listDevices.length}
        </Text>
        <FlatList
          style={{backgroundColor: '#FEF3C7'}}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={listDevices}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => connectToDevice(item)}
              style={styles.item}>
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View> */}
      {/* end Section RFID scanner */}

      <Text className="my-2 font-bold text-center text-gray-400">
        Available RFID Tags
      </Text>
      <View className="">
        {listRfid.length > 0 ? (
          <FlatList
            data={listRfid}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            // contentContainerStyle={styles.listContent}
            // style={styles.list}
          />
        ) : (
          <Text className="text-center text-gray-200">
            Scan RFID tags first
          </Text>
        )}
      </View>
      <ModalApp
        content={`Do you want to use this tag? ${selectTag}`}
        onConfirm={() => {
          handleOnConfirm(
            item.wms_serializeditemid,
            selectTag,
            item?.serialnumber ? item?.serialnumber : serialGenerate,
          );
        }}
        visible={modalTag}
        title="Confirmation"
        type="confirmation"
        onClose={() => {
          setModalTag(false);
        }}
      />
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
    // flex: 1,
    borderWidth: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
    borderWidth: 2,
    width: '100%',
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
    paddingRight: 16,
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
    marginVertical: 16,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  filterInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 3,
    fontSize: 14,
    color: '#222',
    // marginBottom: 4,
    marginTop: 6,
    marginHorizontal: 8,
  },
  // rfid
  text: {
    color: '#333',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    // marginVertical: 5,
  },
  item: {
    // height: ,
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});

export default TagInspectScreen;
