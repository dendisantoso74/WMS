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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {
  ZebraEvent,
  ZebraEventEmitter,
  connectToDevice,
  getAllDevices,
  type ZebraResultPayload,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {debounce, set} from 'lodash';
import {
  createMaterialMovement,
  getSerializedItemByTagCodes,
} from '../../services/materialMovement';
import ModalApp from '../../compnents/ModalApp';
import {getData} from '../../utils/store';
import PreventBackNavigate from '../../utils/preventBack';

const MovementSmartScanScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {binInfo} = route.params;
  console.log('Bin Info from params:', binInfo);

  const [tagItems, setTagItems] = useState([]);
  const [itemInfo, setItemInfo] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tempPayload, setTempPayload] = useState<any>(null);

  useEffect(() => {
    getData('MAXuser').then(userData => {
      setUserData(userData);
    });

    tagItems &&
      getSerializedItemByTagCodes(tagItems).then(res => {
        console.log('RFID Data Response:', res.member);
        setItemInfo(res.member);
        setLoading(false); // Stop loading
      });
  }, [tagItems]);

  // rfid scanner
  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      console.log('RFID Data:', newData);
      // if newdata is array make popup to select item for set to search
      setLoading(true); // Start loading
      // getSerializedItemByTagCodes([newData]).then(res => {
      //   console.log('RFID Data Response:', res.member);
      //   setItemInfo(res.member);
      //   setLoading(false); // Stop loading
      // });

      setTagItems(newData);
    }, 1000),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );
    }, []),
  );

  const handlePayload = async () => {
    if (!itemInfo || !binInfo) {
      ToastAndroid.show('Missing bin or item info', ToastAndroid.SHORT);
      return;
    }

    // Build invuseline array from itemInfo
    const invuseline = itemInfo.map((item: any) => ({
      linetype: 'ITEM',
      tositeid: binInfo.siteid || '-',
      frombin: item.wms_bin,
      validated: false,
      fromstoreloc: item.storeroom,
      quantity: item.qtystored,
      serialnumber: item.serialnumber,
      toorgid: binInfo.orgid || '-',
      tostoreloc: binInfo.storeloc || '-',
      tobin: binInfo.bin,
      orgid: binInfo.orgid || '-',
      invuselinenum: item.polinenum || item.invuselinenum || 0,
      itemnum: item.itemnum,
      itemsetid: item.itemsetid || '-',
      usetype: 'TRANSFER',
      wms_usetype: 'TRANSFER',
    }));

    // Build main payload
    const payload = {
      description: `MATERIAL MOVEMENT ${new Date().toLocaleString()}`,
      wms_isgenerated: true,
      siteid: itemInfo[0].siteid || '-',
      invowner: userData ? userData : 'Unknown User',
      usetype: 'TRANSFER',
      fromstoreloc: itemInfo[0].storeroom || '-',
      status: 'COMPLETE',
      invuseline,
    };

    try {
      // const res = await createMaterialMovement(payload);
      console.log('Payload:', payload);
      setTempPayload(payload);

      // ToastAndroid.show('Material movement updated!', ToastAndroid.SHORT);
      setModalVisible(true);
      // Optionally navigate or refresh
    } catch (error) {
      ToastAndroid.show('Failed to update movement', ToastAndroid.SHORT);
      setModalVisible(false);
    }
  };

  const handleOnConfirm = async () => {
    createMaterialMovement(tempPayload)
      .then(res => {
        console.log('Material movement created:', res);
        ToastAndroid.show('Material movement successfully', ToastAndroid.SHORT);
        setModalVisible(false);
        navigation.navigate('Material Movement');
      })
      .catch(err => {
        setModalVisible(false);

        console.error('Error creating material movement:', err);
        Alert.alert(
          'Error',
          err.Error.message || 'An error occurred while material movement.',
        );
      });
  };

  const handleRemovePayload = (serialnumber: string) => {
    const updated = itemInfo.filter(item => item.serialnumber !== serialnumber);
    setItemInfo(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="Material Movement" />
      <View className="p-2 bg-blue-400">
        <Text className="text-center text-white">To Bin : {binInfo?.bin}</Text>
      </View>

      <View className="px-2 py-2 bg-blue-200 ">
        <View className="flex-row items-center gap-3 mr-3">
          <Text className="text-blue-600">
            Information : This is smartscan, please scan on material tag
          </Text>
        </View>
      </View>
      <View style={styles.filterContainer}></View>
      {/* FlatList to show scanned tagItems */}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3674B5" />
        </View>
      ) : (
        <FlatList
          data={itemInfo}
          renderItem={({item, index}) => (
            <TouchableOpacity
              disabled
              style={styles.rfidCard}
              onPress={() => {}}>
              <View style={[styles.sideBar, {backgroundColor: 'blue'}]} />
              <View className="flex-row my-2">
                <View className="mr-3">
                  <View className="flex-row justify-between w-full">
                    <Text className="font-bold">S/N : {item.serialnumber}</Text>
                    <TouchableOpacity
                      className="items-center justify-center mr-2 bg-red-400 rounded-full w-7 h-7"
                      onPress={() => handleRemovePayload(item.serialnumber)}>
                      {/* <Text className="text-lg font-bold text-white">×</Text> */}
                      <Icon
                        library="Feather"
                        name="trash-2"
                        size={12}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text className="">
                    {item.itemnum} / {item.description}
                  </Text>
                  <Text className="">
                    Qty : {item.qtystored} {item.unitserialized}
                  </Text>
                  <Text>Bin : {item.wms_bin}</Text>
                  {/* <Text className="">Putaway Qty : 0 METER</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 32}}>
              <Text style={{color: '#888'}}>No tags scanned yet.</Text>
            </View>
          }
        />
      )}
      {itemInfo && (
        <View style={styles.buttonContainer}>
          <ButtonApp
            label="MOVE"
            size="large"
            color="primary"
            onPress={() => handlePayload()}
          />
        </View>
      )}

      <ModalApp
        title="Confirmation"
        type="confirmation"
        visible={modalVisible}
        content="Are you sure you want to move material?"
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          handleOnConfirm();
          console.log('Material movement confirmed', tempPayload);
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
    paddingRight: 16,
  },
  sideBar: {
    width: 18,
    height: '100%',
    backgroundColor: 'blue',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 8,
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
});

export default MovementSmartScanScreen;
