import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {ReceivePo, ScanPo} from '../../services/materialRecive';
import {set} from 'lodash';
import ModalApp from '../../compnents/ModalApp';
import {getData} from '../../utils/store';
import {
  getAcceptQuantityByPoline,
  getQuantityByPolineInspect,
  getReceiptQuantityByPoline,
  getRejectQuantityByPoline,
} from '../../utils/helpers';

const dummyRfids = ['00000000000000000000'];

const InspectionReceivingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {ponum} = route.params || {};
  const {item} = route.params || {};

  const [search, setSearch] = useState('');

  const [rfids, setRfids] = useState(dummyRfids);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const [datas, setDatas] = useState([]);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [poline, setPoline] = useState([]);
  const [wmsMatrectrans, setWmsMatrectrans] = useState([]);
  const [tempQuantity, setTempQuantity] = useState(0);

  const handleReceive = (quantity: number, item: any) => {
    console.log('Temp Quantity:', quantity, 'Poline:', item);
    ReceivePo([
      {
        // Assuming ReceivePo expects an array of poline changes
        inspected: 0,
        orderunit: item.orderunit,
        orgid: 'BJS',
        polinenum: item.polinenum,
        ponum: ponum,
        porevisionnum: 0,
        receiptquantity: quantity,
        siteid: 'TJB56',
      },
    ])
      .then(res => {
        if (res.error) {
          Alert.alert('Error', res.error);
        } else {
          console.log('ReceivePo response:', res);
          Alert.alert('Material received');
          setModalVisible(false);
          // navigation.goBack();
        }
      })
      .catch(err => {
        console.error('Error in ReceivePo:', err);
        Alert.alert('Error', 'Failed to receive material');
      });
    setModalVisible(false);
    setTempQuantity(quantity);
  };

  const handleConfirmReceiveAll = async () => {
    const polineChanges = {
      inspected: 0,
      orderunit: 'PCS',
      orgid: 'BJS',
      polinenum: 1,
      ponum: 'PO-BJS-21-1251-EMT',
      porevisionnum: 2,
      receiptquantity: 1,
      siteid: 'TJB56',
    };
    const res = await ReceivePo([polineChanges]);

    if (res.error) {
      Alert.alert('Error', res.error);
      return;
    }
    console.log('ReceivePo response:', res);
    // after submit successfully
    Alert.alert('Material received');
    setModalConfirmVisible(false);
    // navigation.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      const site = await getData('site');
      setDatas(item);
      setPoline(item.wms_matrectrans);
      setWmsMatrectrans(item.wms_matrectrans);

      // ScanPo(ponum).then((res: any) => {
      //   console.log('RFIDs fetched successfully:', res.member);
      //   if (res.member.length === 0) {
      //     navigation.goBack();
      //     Alert.alert(
      //       'Information',
      //       `${ponum} Not Found at site: ${site} `,
      //       // [{text: 'OK', onPress: () => navigation.goBack()}],
      //       // {cancelable: false},
      //     );
      //   }
      //   setDatas(res.member[0]);
      //   setPoline(res.member[0].poline);
      //   setWmsMatrectrans(res.member[0].wms_matrectrans);
      // });
    };

    fetchData();
  }, [modalVisible, tempQuantity]);

  // Filter poline based on search input (material code or material name)
  const filteredPoline = poline?.filter(item => {
    const code = item.itemnum?.toLowerCase() ?? '';
    const name = item.description?.toLowerCase() ?? '';
    const searchText = search.toLowerCase();
    return code.includes(searchText) || name.includes(searchText);
  });

  const renderItem = item => {
    console.log('Render item:', item.item);

    // Find the matching wmsMatrectrans entry by itemnum
    const matchedTrans = wmsMatrectrans?.find(
      trans => trans.itemnum === item.item.itemnum,
    );
    // Sum receiptquantity for all entries with the same polinenum
    const receiptQty = getQuantityByPolineInspect(
      wmsMatrectrans,
      item.item.polinenum,
    );

    const acceptQty = getAcceptQuantityByPoline(
      wmsMatrectrans,
      item.item.polinenum,
    );

    const rejectQty = getRejectQuantityByPoline(
      wmsMatrectrans,
      item.item.polinenum,
    );

    // Set sidebar color: green if fully received, otherwise gray
    console.log(receiptQty, acceptQty, rejectQty);

    const sideBarColor =
      acceptQty + rejectQty === receiptQty ? '#A4DD00' : 'gray';

    return (
      <TouchableOpacity
        disabled={acceptQty + rejectQty === receiptQty}
        onPress={() => {
          // setModalVisible(true);
          // setSelectedData(item.item.polinenum);
          navigation.navigate('InspectionReceivingPOApprove', {
            ponum: ponum,
            item: item.item,
            wms_matrectrans: wmsMatrectrans,
          });
        }}
        style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">{item.item.itemnum}</Text>
            <Text className="font-semibold">
              Order : {item.item.quantity} {item.item.orderunit}
            </Text>
          </View>

          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            {item.item.description}
          </Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold">
              {item.item.conditioncode}
            </Text>
            <Text className="w-1/2 text-right">Accept / Reject</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3"></Text>
            <Text className="w-1/2 text-right">
              {acceptQty} {item.item.orderunit} / {rejectQty}{' '}
              {item.item.orderunit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <Text className="font-bold text-white">PO Number</Text>
        <Text className="ml-10 font-bold text-white">{ponum}</Text>
      </View>
      <TextInput
        style={styles.filterInput}
        placeholder="Enter Material Code or Material Name"
        placeholderTextColor="#b0b0b0"
        value={search}
        onChangeText={setSearch}
      />
      {filteredPoline?.length === 0 ? (
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Text style={{color: '#888', fontSize: 16}}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPoline}
          renderItem={renderItem}
          keyExtractor={item => item.polinenum}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}
      {/* {!allReceived && ( */}
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="INSPECT"
          onPress={() => setModalConfirmVisible(true)}
          size="large"
          color="primary"
        />
      </View>
      {/* )} */}

      <ModalInputWms
        visible={modalVisible}
        material={
          poline?.find(item => item.polinenum === selectedData)?.description ||
          ''
        }
        orderQty={
          poline?.find(item => item.polinenum === selectedData)?.orderqty || ''
        }
        orderunit={
          poline?.find(item => item.polinenum === selectedData)?.orderunit || ''
        }
        remainingQty={
          poline?.find(item => item.polinenum === selectedData)?.orderqty -
            getReceiptQuantityByPoline(wmsMatrectrans, selectedData) || ''
        }
        total={3}
        onClose={() => setModalVisible(false)}
        onReceive={e =>
          handleReceive(
            e,
            poline.find(item => item.polinenum === selectedData),
          )
        }
      />

      <ModalApp
        visible={modalConfirmVisible}
        title="Receive Material"
        content={`Do you want to update the receiving?`}
        type="confirmation"
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={() => handleConfirmReceiveAll()}
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
  maxWidthFullMinus8: {
    maxWidth: 300,
    // marginRight: 8,
  },
});

export default InspectionReceivingScreen;
