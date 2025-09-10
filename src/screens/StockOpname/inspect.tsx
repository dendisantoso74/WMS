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
  Modal,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {
  getDetailBin,
  getDetailItem,
  getDetailStockOpname,
  saveStockOpname,
} from '../../services/stockOpname';
import {debounce, set, uniq} from 'lodash';
import {
  ZebraEvent,
  ZebraEventEmitter,
  ZebraResultPayload,
  ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
const dummyRfids = [
  {
    wms_bin: 'MS-A1L-1-2-1-1',
    serialnumber: '3072EDD2EE15E80C6A488CB6',
    description:
      'END CAP DRAWING NUMBER 151965 FOR AERATION FGD, TYPE STREAMLINE END COUPLING, DETAIL 126752, MFG.:ENVIROMENTAL DYNAMIC INTERNATIONAL EDI FLEXAIR PROJECT NUMBER: 31678',
    wms_serializeditemid: 2879737,
    unitserialized: 'SET',
    orgid: 'BJS',
    itemnum: '26-03901',
    _rowstamp: '943021373',
    qtyserialized: 1.0,
    datemodified: '2024-03-22T13:25:59+07:00',
    tagcode: '4C5090620230000000004727',
    itemsetid: 'ITEMSET',
    ponum: 'PO-BJP-23-1913-MMT',
    siteid: 'TJB56',
    qtystored: 5.0,
    href: 'http://192.168.200.9:9080/maxrest/oslc/os/wms_mxserializeditem/_Mjg3OTczNw--',
    matrectransid: 106519,
    storeroom: 'INDOOR',
    unitstored: 'SET',
    conditioncode: 'NEW',
  },
  {
    wms_bin: 'MS-A1L-1-2-1-1',
    serialnumber: '3070B8153097E6D392AFC455',
    description:
      'DROP CONNECTOR (VAN STONE FLANGE) DRAWING NUMBER: 151965 FOR AERATION FGD, TYPE VAN STONE FLANGE, DETAIL 126987, MFG.:ENVIROMENTAL DYNAMIC INTERNATIONAL EDI FLEXAIR PROJECT NUMBER: 31678',
    wms_serializeditemid: 2879779,
    unitserialized: 'SET',
    orgid: 'BJS',
    itemnum: '26-03894',
    _rowstamp: '943021379',
    qtyserialized: 1.0,
    datemodified: '2024-03-22T13:28:38+07:00',
    tagcode: '4C5090620230000000004769',
    itemsetid: 'ITEMSET',
    ponum: 'PO-BJP-23-1913-MMT',
    siteid: 'TJB56',
    qtystored: 1.0,
    href: 'http://192.168.200.9:9080/maxrest/oslc/os/wms_mxserializeditem/_Mjg3OTc3OQ--',
    matrectransid: 106547,
    storeroom: 'INDOOR',
    unitstored: 'SET',
    conditioncode: 'NEW',
  },
];

const DetaliBinStockOpnameScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {itemBin, wms_opinid} = route.params;
  console.log('item from params, temp:', itemBin);

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');
  const [opinline, setOpline] = useState([]);
  const [tempPayload, setTempPayload] = useState([]);

  // for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [physicalCount, setPhysicalCount] = useState(0);
  const [rfidItems, setRfidItems] = useState([]);
  const [itemsDetail, setItemsDetail] = useState([]);

  // rfisd reader setup
  useFocusEffect(
    useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          console.log('scan on stock opname', uniq(e.data));
          handleRfidEvent(uniq(e.data));
        },
      );
      // Clean up listeners when screen is unfocused
      return () => {
        rfidEvent.remove();
      };
    }, []),
  );

  const handleRfidEvent = useCallback(
    debounce((newData: string[]) => {
      setRfidItems(pre => uniq([...pre, ...newData]));
    }, 200),
    [],
  );

  useEffect(() => {
    // Loop through rfidItems and fetch detail for each tagcode/serialnumber
    const fetchDetails = async () => {
      const details = [];
      for (const tagcode of rfidItems) {
        try {
          const res = await getDetailItem(tagcode);
          // Only include if wms_bin matches itemBin.binnum
          if (
            res &&
            res.member &&
            res.member.length > 0 &&
            res.member[0].wms_bin === itemBin.binnum
          ) {
            details.push(res.member[0]);
          }
        } catch (err) {
          console.error('Error fetching detail for', tagcode, err);
        }
      }
      setItemsDetail(details);
    };

    if (rfidItems.length > 0) {
      fetchDetails();
    } else {
      setItemsDetail([]);
    }
  }, [rfidItems]);

  const openAdjustModal = (item: any) => {
    setSelectedItem(item);
    setPhysicalCount(
      item.serialnumber
        ? getPhysicalCountBySerial(item.serialnumber, item.qtystored)
        : 0,
    );
    setModalVisible(true);
  };

  const handleDecrease = () => {
    setPhysicalCount(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleIncrease = () => {
    setPhysicalCount(prev =>
      prev < (selectedItem?.qtystored ?? 0) ? prev + 1 : prev,
    );
  };

  const handleInputChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    const max = selectedItem?.qtystored ?? 0;
    if (isNaN(num)) {
      setPhysicalCount(0);
    } else if (num > max) {
      setPhysicalCount(max);
    } else {
      setPhysicalCount(num);
    }
  };

  const handleAdjustMaterial = () => {
    // You can handle adjustment logic here
    // Create the payload object
    const payload = {
      binnum: selectedItem.wms_bin,
      wms_opinid: wms_opinid,
      physicalcount: physicalCount,
      serialnumber: selectedItem.serialnumber,
    };
    setTempPayload(prev => [...prev, payload]);

    // modal close
    setModalVisible(false);
    ToastAndroid.show('Material adjusted!', ToastAndroid.SHORT);
  };

  const handleSave = (payload: any[]) => {
    // make loop base on array payload
    payload.forEach((item, index) => {
      console.log('Saving item:', index, item);
      saveStockOpname(item);
    });
    // console.log('Saving payload send:', payload);
    // You can call your save API here with the payload
    ToastAndroid.show('Data saved successfully!', ToastAndroid.SHORT);
    navigation.navigate('Detail Stock Opname', {
      wms_opinid: wms_opinid,
    });
  };

  useEffect(() => {
    // Fetch RFIDs based on the bin if needed
    // getDetailStockOpname(item.wms_opinid)
    // getDetailBin(item.binnum)

    // For now, using dummy data
    setRfids(dummyRfids);
    setOpline(itemBin?.wms_opinline || []);
  }, []);

  // Find physicalcount in opline by serialnumber
  const getPhysicalCountBySerial = (
    serialnumber: string,
    defaultCount: number,
  ) => {
    const found = opinline.find(
      (line: any) => line.serialnumber === serialnumber,
    );
    return found ? found.physicalcount : defaultCount;
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      // onPress={() =>
      //   navigation.navigate('Detail Material Stock Opname', {
      //     item: item,
      //     wms_opinid: wms_opinid,
      //     itemBin: itemBin,
      //     // tempPayload: [payload],
      //   })
      // }

      onPress={() => openAdjustModal(item)}>
      <View style={[styles.sideBar, {backgroundColor: 'blue'}]} />
      <View className="flex-row my-2">
        <View className="flex-col justify-start">
          <Text className="font-bold">{item.itemnum}</Text>
          <Text className="mr-4 ">{item.description}</Text>
          <Text className="font-bold">SN: {item.serialnumber}</Text>
          <View className="flex-row gap-5">
            <View className="flex-col">
              <Text>Current Balance</Text>
              <Text>Physical Count</Text>
              <Text>Condition code</Text>
            </View>
            <View className="flex-col">
              <Text>
                {item.qtystored} {item.unitstored}
              </Text>
              <Text>
                {item.serialnumber
                  ? (() => {
                      // Check tempPayload first for matching serialnumber
                      const temp = tempPayload.find(
                        (p: any) => p.serialnumber === item.serialnumber,
                      );
                      if (temp) {
                        return temp.physicalcount;
                      }
                      // Fallback to opinline
                      return getPhysicalCountBySerial(
                        item.serialnumber,
                        item.qtystored,
                      );
                    })()
                  : 0}{' '}
                {item.unitstored}
              </Text>
              <Text>{item.conditioncode}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {console.log('item detail bin', opinline)}
      {console.log('payload temp', tempPayload)}
      {console.log('rfid items', rfidItems)}
      <View className="p-2 bg-blue-400">
        <View className="flex-row gap-16">
          <View className="flex-col justify-start">
            <Text className="font-bold text-white">Bin</Text>
            <Text className="font-bold text-white">Zone</Text>
            <Text className="font-bold text-white">Area</Text>
          </View>
          <View className="flex-col justify-start ">
            <Text className="font-bold text-white">{itemBin.binnum}</Text>
            <Text className="font-bold text-white">{itemBin.wms_zone}</Text>
            <Text className="font-bold text-white">{itemBin.wms_area}</Text>
          </View>
        </View>
        <Text className="text-white">
          {itemBin.scannedcount} Items scanned of {itemBin.itemcount}
        </Text>
      </View>

      <View className="px-2 py-2 bg-blue-200 ">
        <View className="flex-row items-center gap-3 mr-3">
          <Icon library="Feather" name="info" size={15} color="blue" />
          <Text className="text-xl text-blue-600">
            Scan device to material, then the serial number will be shown
          </Text>
        </View>
      </View>
      <FlatList
        data={itemsDetail}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.serialnumber}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          onPress={() => handleSave(tempPayload)}
          label="SAVE"
          size="large"
          color="primary"
          disabled={tempPayload.length === 0}
        />
      </View>

      {/* Modal for Adjust Material */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.headerText}>Material</Text>
              <Text style={modalStyles.headerValue}>
                {selectedItem?.itemnum} / {selectedItem?.description}
              </Text>
            </View>
            <View style={modalStyles.row}>
              <Text style={modalStyles.label}>S/N</Text>
              <Text style={modalStyles.value}>
                {selectedItem?.serialnumber}
              </Text>
            </View>
            <View style={modalStyles.row}>
              <Text style={modalStyles.label}>Bin</Text>
              <Text style={modalStyles.value}>{selectedItem?.wms_bin}</Text>
            </View>
            <View style={modalStyles.row}>
              <Text style={modalStyles.label}>Unit</Text>
              <Text style={modalStyles.value}>{selectedItem?.unitstored}</Text>
            </View>
            <View style={modalStyles.row}>
              <Text style={modalStyles.label}>Current Balance</Text>
              <Text style={modalStyles.value}>{selectedItem?.qtystored}</Text>
            </View>
            <Text className="mt-2 text-xl font-bold text-center text-black ">
              Physical Count
            </Text>
            <View style={modalStyles.counterRow}>
              <TouchableOpacity
                style={modalStyles.circleBtn}
                onPress={handleDecrease}
                disabled={physicalCount === 0}>
                <Text style={modalStyles.circleBtnText}>-</Text>
              </TouchableOpacity>
              <View style={modalStyles.countBox}>
                <TextInput
                  style={modalStyles.countText}
                  keyboardType="numeric"
                  value={physicalCount.toString()}
                  onChangeText={handleInputChange}
                  textAlign="center"
                />
              </View>
              <TouchableOpacity
                style={modalStyles.circleBtn}
                onPress={handleIncrease}
                disabled={physicalCount >= (selectedItem?.qtystored ?? 0)}>
                <Text style={modalStyles.circleBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              // disabled={physicalCount === 0}
              style={styles.receiveBtn}
              onPress={handleAdjustMaterial}>
              <Text style={styles.receiveBtnText}>Adjustment Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // modal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  // header: {
  //   backgroundColor: '#285a8d',
  //   padding: 16,
  //   borderTopLeftRadius: 10,
  //   borderTopRightRadius: 10,
  // },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  value: {
    color: '#fff',
    fontSize: 15,
    maxWidth: 200,
    textAlign: 'right',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7eaf3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    fontSize: 28,
    color: '#285a8d',
    fontWeight: 'bold',
  },
  countBox: {
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  countText: {
    fontSize: 28,
    color: '#222',
    fontWeight: '500',
    padding: 0,
  },
  receiveBtn: {
    backgroundColor: '#285aee',
    borderRadius: 8,
    marginHorizontal: 40,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  receiveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingBottom: 20,
    elevation: 8,
    alignItems: 'stretch',
  },
  header: {
    backgroundColor: '#285a8d',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerValue: {
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  label: {
    color: '#285a8d',
    fontWeight: 'bold',
    fontSize: 15,
  },
  value: {
    color: '#285a8d',
    fontSize: 15,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  circleBtnText: {
    fontSize: 28,
    color: '#285a8d',
    fontWeight: 'bold',
  },
  countBox: {
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#285a8d',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  countText: {
    fontSize: 22,
    color: '#285a8d',
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    padding: 8,
  },
  closeBtnText: {
    color: '#285a8d',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetaliBinStockOpnameScreen;
