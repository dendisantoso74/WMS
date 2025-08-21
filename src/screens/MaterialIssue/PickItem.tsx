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
  ScrollView,
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
  findBinByTagCode,
  findSugestBin,
  getItemSNByTagCode,
  pickItem,
} from '../../services/materialIssue';
import {debounce, set} from 'lodash';
import {Dropdown} from 'react-native-element-dropdown';
import {getData} from '../../utils/store';
import {tagInfo} from '../../services/tagInfo';
import {
  ZebraEvent,
  ZebraEventEmitter,
  connectToDevice,
  getAllDevices,
  type ZebraResultPayload,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';

const userTypeOptions = [
  {label: 'ISSUE', value: 'ISSUE'},
  {label: 'REFURBISH', value: 'REFURBISH'},
  {label: 'REPLACEMENT', value: 'REPLACEMENT'},
];

const PickItemScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, invuselinenum, invinvUseId} = route.params;

  console.log('RFIDs from params:', item, invuselinenum, invinvUseId);

  const [search, setSearch] = useState('');
  const [suggestedBin, setSuggestedBin] = useState([]);
  const [userType, setUserType] = useState(item?.wms_usetype || 'ISSUE'); // <-- Add state for dropdown
  const [maxUser, setMaxUser] = useState(0);
  const [bin, setBin] = useState('');
  const [storeqty, setStoreqty] = useState('');
  const [pickqty, setPickqty] = useState('');
  const [serialNumberItem, setSerialNumberItem] = useState('');

  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      console.log('RFID Data:', newData);
      // if newdata is array make popup to select item for set to search

      setSearch(newData[0]);
      searchSerialNumber(newData[0]);
    }, 200),
    [],
  );

  const handleBarcodeEvent = useCallback(
    debounce((newData: string) => {
      setSearch(newData);
      searchSerialNumber(newData);
    }, 200),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const barcodeEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_BARCODE,
        (e: ZebraResultPayload) => {
          handleBarcodeEvent(e.data);
        },
      );

      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );
    }, []),
  );

  useEffect(() => {
    //get MAXuser
    const maxUser = getData('MAXuser').then(res => {
      // console.log('MAXuser:', maxUser);
      setMaxUser(res);
    });

    //find sugestion bin
    const findbin = async () => {
      const res = await findSugestBin(item.itemnum, item.location);
      setSuggestedBin(res.member[0]);
      console.log('Suggested Bin:', res.member[0]);
    };

    const getDetailBin = async () => {
      // const res = await findBinByTagCode(item.tagcode);
      // setBin(res.member[0]);
    };

    findbin();
  }, [item]);

  const handleAdd = async () => {
    const payload = {
      serialnumber: serialNumberItem, // need to be make sure this payload is existing because is required
      quantity: Number(pickqty),
      assetnum: item.assetnum,
      frombin: bin.bin || item.frombin || suggestedBin?.binnum,
      fromstoreloc: item.location,
      invuselinenum: invuselinenum,
      issueto: maxUser,
      itemnum: item.itemnum,
      itemsetid: item.itemsetid,
      linetype: 'ITEM',
      location: item.location,
      orgid: item.orgid,
      refwo: item.wogroup,
      requestnum: item.requestnum,
      toorgid: 'BJS',
      tositeid: 'TJB56',
      usetype: userType,
      validated: false,
      wms_usetype: userType,
      // conditioncode: 'NEW', //tambahan payload karena error condition code
      // fromconditioncode: 'NEW', //tambahan payload karena error condition code
    };

    // Validation activate soon
    // for (const key in payload) {
    //   if (
    //     payload[key] === undefined ||
    //     payload[key] === null ||
    //     payload[key] === '' ||
    //     (key === 'quantity' && (!payload[key] || payload[key] <= 0))
    //   ) {
    //     ToastAndroid.show(`Error: ${key} is empty`, ToastAndroid.SHORT);
    //     return;
    //   }
    // }

    // You can now use this payload for your API call
    console.log('invuseid, Payload:', invinvUseId, payload, item);
    await pickItem(invinvUseId, payload)
      .then(res => {
        console.log('Pick item response:', res);
        ToastAndroid.show('Item picked successfully', ToastAndroid.SHORT);
        navigation.navigate('Material Issue Inspect', {
          listrfid: [item.wogroup],
        });
      })
      .catch(err => {
        console.error('Error picking item:', err);
        Alert.alert(
          'Error',
          err.Error.message || 'An error occurred while picking the item.',
        );
      });
  };
  const searchSerialNumber = async (tagcode: string) => {
    // console.log('Searching for serial number:', search);

    // const result = await findBinByTagCode(search);
    const result = await getItemSNByTagCode(tagcode).then(res => {
      console.log('Tag Info:', res.member[0]);
      setSerialNumberItem(res.member[0].wms_serializeditem);
    });

    setBin(result.member[0]);
    console.log('Search BIN result:', result.member[0]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text className="mt-3 ml-4 font-bold">Tag Code</Text>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Search by tag code"
            placeholderTextColor="#b0b0b0"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => searchSerialNumber(search)}
          />
          <Text className="mt-3 ml-4 font-bold">Serial Number</Text>

          <TextInput
            style={styles.filterInput}
            placeholder="Serial Number"
            placeholderTextColor="#b0b0b0"
            value={serialNumberItem}
            editable={false}
            // onChangeText={setSearch}
            // onSubmitEditing={searchSerialNumber}
          />
        </View>

        <View className="flex-col mx-3">
          <View className="flex-row w-full mt-2 ">
            <Text className="w-1/2 font-bold">Item Name</Text>
            <View
              style={{
                flex: 1,
              }}>
              <Text
              // numberOfLines={2}
              // ellipsizeMode="tail"
              >
                {item?.description}
              </Text>
            </View>
          </View>
          <View className="flex-row w-full mt-3">
            <Text className="w-1/2 font-bold">Condition Code</Text>
            <Text>{item?.conditioncode}</Text>
          </View>
          <View className="flex-row w-full mt-3">
            <Text className="w-1/2 font-bold">Issue Unit</Text>
            <Text>{item?.wms_unit}</Text>
          </View>
          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Stored Qty</Text>
            <View className="flex-row items-center ">
              <TextInput
                className="w-24 text-center"
                style={styles.filterInput}
                placeholder="0"
                placeholderTextColor="#b0b0b0"
                // value={item?.stagedqty.toString()}
                value={storeqty}
                onChangeText={setStoreqty}
                // editable={false}
              />
              <Text>{item?.wms_unit}</Text>
            </View>
          </View>
          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Pick Qty</Text>
            <View className="flex-row items-center ">
              <TextInput
                className="w-24 text-center"
                style={styles.filterInput}
                placeholder="0"
                placeholderTextColor="#b0b0b0"
                value={pickqty}
                onChangeText={setPickqty}
              />
              <Text>{item?.wms_unit}</Text>
            </View>
          </View>

          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Bin</Text>
            <View className="w-1/2 py-2 ">
              <Text className="font-bold text-center ">
                {suggestedBin?.binnum}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Sugesstion Bin</Text>
            <View className="w-1/2 py-2 bg-gray-200">
              <Text className="font-bold text-center ">
                {suggestedBin?.binnum}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Use Type</Text>
            <View className="w-1/2 py-2 bg-gray-200">
              <Dropdown
                data={userTypeOptions}
                labelField="label"
                valueField="value"
                value={userType}
                onChange={item => setUserType(item.value)}
                style={{
                  backgroundColor: 'transparent',
                  // width: '100%',
                  paddingHorizontal: 8,
                }}
                placeholder="Select Use Type"
              />
            </View>
          </View>

          <View className="flex-row items-center w-full mt-3">
            <Text className="w-1/2 font-bold">Issue To</Text>
            <View className="w-1/2 py-2 ">
              <Text className="font-bold ">{maxUser}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="ADD"
          size="large"
          color="primary"
          onPress={() => handleAdd()}
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
});

export default PickItemScreen;
