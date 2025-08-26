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
  ToastAndroid,
  Switch,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {ReceivePo, ScanPo} from '../../services/materialRecive';
import {set} from 'lodash';
import ModalApp from '../../compnents/ModalApp';
import {getData} from '../../utils/store';
import {getReceiptQuantityByPoline} from '../../utils/helpers';

const MaterialReceiveDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const [datas, setDatas] = useState([]);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [poline, setPoline] = useState([]);
  const [wmsMatrectrans, setWmsMatrectrans] = useState([]);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DONE' | 'NOT DONE'>(
    'NOT DONE',
  );
  const [totalItem, setTotalItem] = useState(0);
  const [totalDoneItem, setTotalDoneItem] = useState(0);
  // Add a state for split option (checkbox, switch, etc.)
  const [split, setSplit] = useState(false);

  // const handleReceive = async (quantity: number, item: any) => {
  //   const site = await getData('site');
  //   ReceivePo([
  //     {
  //       // Assuming ReceivePo expects an array of poline changes
  //       inspected: 0,
  //       orderunit: item.orderunit,
  //       orgid: site === 'TJB56' ? 'BJS' : 'BJP',
  //       polinenum: item.polinenum,
  //       ponum: listrfid[listrfid.length - 1],
  //       porevisionnum: 0,
  //       receiptquantity: quantity,
  //       siteid: site,
  //     },
  //   ])
  //     .then(res => {
  //       if (res.error) {
  //         Alert.alert('Error', res.error);
  //       } else {
  //         console.log('ReceivePo response:', res);
  //         // Alert.alert('Success', 'Material received');
  //         ToastAndroid.show(
  //           `Material received: ${item.itemnum} - ${quantity} ${item.orderunit}`,
  //           ToastAndroid.SHORT,
  //         );
  //         fetchData();
  //         setModalVisible(false);

  //         // navigation.goBack();
  //       }
  //     })
  //     .catch(err => {
  //       console.error('Error in ReceivePo:', err);
  //       Alert.alert('Error', 'Failed to receive material');
  //     });
  //   setModalVisible(false);
  //   setTempQuantity(quantity);
  // };

  // Update handleReceive to support split logic:
  const handleReceive = async (quantity: number, item: any) => {
    const site = await getData('site');
    console.log('value split', split);

    if (split) {
      console.log('masuk split');

      // Split: send multiple requests, each with receiptquantity = 1
      for (let i = 0; i < quantity; i++) {
        try {
          await ReceivePo([
            {
              inspected: 0,
              orderunit: item.orderunit,
              orgid: site === 'TJB56' ? 'BJS' : 'BJP',
              polinenum: item.polinenum,
              ponum: listrfid[listrfid.length - 1],
              porevisionnum: 0,
              receiptquantity: 1,
              siteid: site,
            },
          ]);
        } catch (err) {
          console.error('Error in split ReceivePo:', err);
          Alert.alert('Error', 'Failed to receive material (split mode)');
          break;
        }
      }
      ToastAndroid.show(
        `Material received (split): ${item.itemnum} - ${quantity} x 1 ${item.orderunit}`,
        ToastAndroid.SHORT,
      );
      fetchData();
      setModalVisible(false);
      setTempQuantity(quantity);
    } else {
      // Not split: existing logic
      console.log('NO split');

      ReceivePo([
        {
          inspected: 0,
          orderunit: item.orderunit,
          orgid: site === 'TJB56' ? 'BJS' : 'BJP',
          polinenum: item.polinenum,
          ponum: listrfid[listrfid.length - 1],
          porevisionnum: 0,
          receiptquantity: quantity,
          siteid: site,
        },
      ])
        .then(res => {
          if (res.error) {
            Alert.alert('Error', res.error);
          } else {
            ToastAndroid.show(
              `Material received: ${item.itemnum} - ${quantity} ${item.orderunit}`,
              ToastAndroid.SHORT,
            );
            fetchData();
            setModalVisible(false);
          }
        })
        .catch(err => {
          console.error('Error in ReceivePo:', err);
          Alert.alert('Error', 'Failed to receive material');
        });
      setModalVisible(false);
      setTempQuantity(quantity);
    }
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
    // const res = await ReceivePo([polineChanges]);

    // if (res.error) {
    //   Alert.alert('Error', res.error);
    //   return;
    // }
    console.log('ReceivePo response:');
    // after submit successfully
    Alert.alert('Success', 'Material received');
    setModalConfirmVisible(false);
    // navigation.goBack();
  };

  const fetchData = async () => {
    const site = await getData('site');

    ScanPo(listrfid[listrfid.length - 1]).then((res: any) => {
      console.log('RFIDs fetched successfully:', res.member);
      if (res.member.length === 0) {
        navigation.goBack();
        Alert.alert(
          'Information',
          `${listrfid[listrfid.length - 1]} Not Found at site: ${site} `,
          // [{text: 'OK', onPress: () => navigation.goBack()}],
          // {cancelable: false},
        );
      }
      setDatas(res.member[0]);
      setPoline(res.member[0].poline);
      setWmsMatrectrans(res.member[0].wms_matrectrans);
    });
  };
  useEffect(() => {
    fetchData();
  }, [modalVisible, tempQuantity]);

  useEffect(() => {
    // Set totalItem and totalDoneItem when poline or wmsMatrectrans changes
    if (poline && Array.isArray(poline)) {
      setTotalItem(poline.length);

      // Count items where receiptQty === orderqty (fully received)
      const doneCount = poline.filter(item => {
        const receiptQty = getReceiptQuantityByPoline(
          wmsMatrectrans,
          item.polinenum,
        );
        return receiptQty === item.orderqty;
      }).length;
      setTotalDoneItem(doneCount);
    }
  }, [poline, wmsMatrectrans]);

  // Helper: check if all items are fully received (all sideBarColor would be green)
  const allReceived =
    poline?.length > 0 &&
    poline.every(item => {
      const matchedTrans = wmsMatrectrans?.find(
        trans => trans.itemnum === item.itemnum,
      );
      const orderQty = matchedTrans?.receiptquantity ?? 0;
      return orderQty === item.orderqty;
    });

  // Filter poline based on search input (material code or material name)
  const filteredPoline = poline?.filter(item => {
    const code = item.itemnum?.toLowerCase() ?? '';
    const name = item.description?.toLowerCase() ?? '';
    const searchText = search.toLowerCase();
    const receiptQty = getReceiptQuantityByPoline(
      wmsMatrectrans,
      item.polinenum,
    );

    // Filter by chip
    if (activeFilter === 'DONE' && receiptQty !== item.orderqty) return false;
    if (activeFilter === 'NOT DONE' && receiptQty === item.orderqty)
      return false;

    // Filter by search
    return code.includes(searchText) || name.includes(searchText);
  });

  const renderItem = item => {
    // Find the matching wmsMatrectrans entry by itemnum
    const matchedTrans = wmsMatrectrans?.find(
      trans => trans.itemnum === item.item.itemnum,
    );
    // Sum receiptquantity for all entries with the same polinenum
    const receiptQty = getReceiptQuantityByPoline(
      wmsMatrectrans,
      item.item.polinenum,
    );
    // Set sidebar color: green if fully received, otherwise gray
    const sideBarColor = receiptQty === item.item.orderqty ? '#A4DD00' : 'gray';

    return (
      <TouchableOpacity
        disabled={item.item.orderqty === receiptQty}
        onPress={() => {
          setModalVisible(true);
          setSelectedData(item.item.polinenum);
        }}
        style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <Text className="font-bold">{item.item.itemnum}</Text>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            {item.item.description}
          </Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold">
              {item.item.conditioncode}
            </Text>
            <Text className="w-1/2 text-right">Order / Receive</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3"></Text>
            <Text className="w-1/2 text-right">
              {item.item.orderqty} {item.item.orderunit} / {receiptQty}{' '}
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
        <Text className="ml-10 font-bold text-white">
          {listrfid[listrfid.length - 1]}
        </Text>
      </View>
      <View>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter Material Code or Material Name"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
        <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 20, top: 12}}
        />
        {/* chip filter tag untag */}
        <View className="flex-row gap-2 mx-3 my-1 max-w-fit">
          <TouchableOpacity onPress={() => setActiveFilter('ALL')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'ALL'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              All ({totalItem})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter('DONE')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'DONE'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              DONE ({totalDoneItem})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter('NOT DONE')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'NOT DONE'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              NOT DONE ({totalItem - totalDoneItem})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {filteredPoline.length === 0 ? (
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
      {/* <View style={styles.buttonContainer}>
        <ButtonApp
          label="RECEIVE"
          onPress={() => setModalConfirmVisible(true)}
          size="large"
          color="primary"
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="GO TO INSPECT"
          onPress={() =>
            navigation.navigate('InspectionReceivingPO', {
              ponum: listrfid[listrfid.length - 1],
            })
          }
          size="large"
          color="primary"
        />
      </View>
      {/* )} */}
      <ModalInputWms
        // canSplit
        // split={split}
        // onSplitChange={setSplit}
        visible={modalVisible}
        material={
          poline.find(item => item.polinenum === selectedData)?.description ||
          ''
        }
        orderQty={
          poline.find(item => item.polinenum === selectedData)?.orderqty || ''
        }
        orderunit={
          poline.find(item => item.polinenum === selectedData)?.orderunit || ''
        }
        remainingQty={
          poline.find(item => item.polinenum === selectedData)?.orderqty -
            getReceiptQuantityByPoline(wmsMatrectrans, selectedData) || ''
        }
        total={0}
        onClose={() => {
          setModalVisible(false);
        }}
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

export default MaterialReceiveDetailScreen;
