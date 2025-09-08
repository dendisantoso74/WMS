import React, {useEffect, useState} from 'react';
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
import ButtonApp from '../../compnents/ButtonApp';
import {Dropdown} from 'react-native-element-dropdown';
import {getData} from '../../utils/store';
import {inspectPo, ListRejectCode} from '../../services/materialRecive';
import {getPersonByLoginId} from '../../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalApp from '../../compnents/ModalApp';

const dummyRfids = ['00000000000000000000'];

const InspectionReceivingApproveScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const {ponum} = route.params || {};
  const {item} = route.params || {};
  const {wms_matrectrans} = route.params || {};
  const {porevisionnum} = route.params || {};

  console.log('Received ponum inspect next:', ponum, item, porevisionnum);

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState([]);
  const [rejectCode, setRejectCode] = useState([{label: '', value: ''}]);
  const [user, setUser] = React.useState<string | null>(null);
  const [inputAceptedQty, setInputAcceptedQty] = useState(
    item?.receiptquantity,
  );
  const [inputRejectedQty, setInputRejectedQty] = useState(0);
  const [inputRejectedCode, setInputRejectedCode] = useState('');

  const [poline, setPoline] = useState([]);
  const [wmsMatrectrans, setWmsMatrectrans] = useState([]);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  // Initial payload
  const [tempPayload, setTempPayload] = useState({
    externalrefid: ponum,
    sourcesysid: 'WMS',
    ponum: ponum,
    polinenum: datas.polinenum,
    porevisionnum: porevisionnum ?? 0, // need change
    siteid: 'TJB56',
    positeid: 'TJB56',
    orgid: 'BJS',
    inspected: 1,
    receiptquantity: null,
    acceptedqty: 0,
    rejectqty: 0,
    wms_inspectassignedby: '',
    wms_matrectransid: datas?.wms_matrectransid,
  });

  const [count, setCount] = useState(0);

  const handleDecrease = () => {
    if (inputAceptedQty > 0) setInputAcceptedQty(inputAceptedQty - 1);
  };

  const handleIncrease = () => {
    setInputAcceptedQty(inputAceptedQty + 1);
  };

  const handleDecreaseReject = () => {
    if (inputRejectedQty > 0) setInputRejectedQty(inputRejectedQty - 1);
  };

  const handleIncreaseReject = () => {
    setInputRejectedQty(inputRejectedQty + 1);
  };

  const handleApprove = async () => {
    console.log('Approve button pressed', tempPayload);
    inspectPo(tempPayload)
      .then(res => {
        console.log('Inspect Po response:', res);
        if (res.error) {
          ToastAndroid.show('Error approving inspection', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            'Inspection approved successfully',
            ToastAndroid.SHORT,
          );
          // navigation.navigate('Inspection');
          navigation.navigate('InspectionReceivingPO', {
            ponum: ponum,
          });
        }
      })
      .catch(err => {
        console.error('Error in handleApprove:', err);
        Alert.alert('Error', err?.message || err?.Error?.message);
        ToastAndroid.show('Error approving inspection', ToastAndroid.SHORT);
      })
      .finally(() => {
        setModalConfirmVisible(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const resRejectCode = await ListRejectCode();
      console.log('ListRejectCode data:', resRejectCode);
      setRejectCode(resRejectCode);

      const userAsync = await AsyncStorage.getItem('MAXuser');
      setUser(userAsync);

      setDatas(item);
      setPoline(item.poline);
      setWmsMatrectrans(item.wms_matrectrans);
      console.log('Poline inspect:', wms_matrectrans);

      // tes temp payload
      // To update just one field, for example acceptedqty:
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      const userAsync = await AsyncStorage.getItem('MAXuser');
      const siteid = await getData('site');
      console.log('datassss', item);

      setTempPayload(prev => ({
        ...prev,
        orgid: siteid === 'TJB56' ? 'BJS' : 'BJP',
        polinenum: item.polinenum,
        positeid: siteid,
        siteid: siteid,
        wms_matrectransid: item.wms_matrectransid,
        wms_inspectassignedby: userAsync, // or any value you want to set
        receiptquantity: parseInt(inputRejectedQty + inputAceptedQty, 10),
        acceptedqty: inputAceptedQty ? parseInt(inputAceptedQty, 10) : 0,
        inspected: 1, // 1 is code for inspection approved and complete waiting to inspect status
        rejectqty: inputRejectedQty ? parseInt(inputRejectedQty, 10) : 0,
        porevisionnum: porevisionnum ?? 0,
        // rejectedcode: inputRejectedCode || '',
      }));
    };

    fetchData2();
  }, [inputAceptedQty, inputRejectedQty, inputRejectedCode]);

  // Add this function inside your component:
  const handleInputAcceptedChange = (text: string) => {
    // Only allow numbers, fallback to 0 if empty or invalid
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    // Max is item.receiptquantity - inputRejectedQty
    const max = item.receiptquantity - inputRejectedQty;
    if (isNaN(num)) {
      setInputAcceptedQty(0);
    } else if (num > max) {
      setInputAcceptedQty(max);
    } else {
      setInputAcceptedQty(num);
    }
  };

  const handleInputRejectedChange = (text: string) => {
    // Only allow numbers, fallback to 0 if empty or invalid
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    // Max is item.receiptquantity - inputAceptedQty
    const max = item.receiptquantity - inputAceptedQty;
    if (isNaN(num)) {
      setInputRejectedQty(0);
    } else if (num > max) {
      setInputRejectedQty(max);
    } else {
      setInputRejectedQty(num);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {console.log('tempPayload:', tempPayload)}
      <View className="w-full bg-blue-400 ">
        <View className="flex-row my-1 ml-2">
          <Text className="w-20 font-bold text-white">Material</Text>
          <Text className="text-white ">
            : {datas.itemnum} / {datas.description}
          </Text>
        </View>

        <View className="flex-row my-1 ml-2">
          <Text className="w-20 font-bold text-white">Order QTY</Text>
          <Text className="text-white ">
            : {datas.quantity} {datas.orderunit}
          </Text>
        </View>
      </View>

      <View className="mx-3">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">Accepted Qty</Text>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity
              disabled={inputAceptedQty === 0}
              style={styles.circleBtn}
              onPress={handleDecrease}>
              <Text style={styles.circleBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.countBox}>
              {/* <Text style={styles.countText}>{inputAceptedQty}</Text> */}
              <TextInput
                style={[styles.countText, {textAlign: 'center'}]}
                keyboardType="numeric"
                value={inputAceptedQty.toString()}
                onChangeText={handleInputAcceptedChange}
                maxLength={item.receiptquantity.toString().length}
              />
            </View>
            <TouchableOpacity
              disabled={
                inputRejectedQty + inputAceptedQty === item.receiptquantity
              }
              style={styles.circleBtn}
              onPress={handleIncrease}>
              <Text style={styles.circleBtnText}>+</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="ml-3 bg-green-600 border border-green-500 rounded-full">
              <Icon
                library="Feather"
                name="check"
                size={30}
                color="white"></Icon>
            </TouchableOpacity> */}
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">Rejected Qty</Text>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={handleDecreaseReject}>
              <Text style={styles.circleBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.countBox}>
              {/* <Text style={styles.countText}>{inputRejectedQty}</Text> */}
              <TextInput
                style={[styles.countText, {textAlign: 'center'}]}
                keyboardType="numeric"
                value={inputRejectedQty.toString()}
                onChangeText={handleInputRejectedChange}
                maxLength={item.receiptquantity.toString().length}
              />
            </View>
            <TouchableOpacity
              disabled={
                inputRejectedQty + inputAceptedQty === item.receiptquantity
              }
              style={styles.circleBtn}
              onPress={handleIncreaseReject}>
              <Text style={styles.circleBtnText}>+</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="ml-3 bg-green-600 border border-green-500 rounded-full">
              <Icon
                library="Feather"
                name="check"
                size={30}
                color="white"></Icon>
            </TouchableOpacity> */}
          </View>
        </View>
        <View className="flex flex-row items-center justify-between my-5">
          <View>
            <Text className="text-xl font-bold">Rejected Code</Text>
          </View>
          <Dropdown
            style={[styles.dropdown]}
            data={rejectCode}
            labelField="label"
            valueField="id"
            placeholder="Select option"
            // value={value} // to set default value
            onChange={item => {
              console.log(item);
            }}
            // disable={disabled} // Apply disabled prop
          />
        </View>
        {/* <View className="pt-6">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl "
            style={{backgroundColor: 'red', height: 50, width: '50%'}}>
            <Icon library="Feather" name="plus" size={20} color="white"></Icon>
            <Text className="justify-end text-white ">ADD REJECT</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      <View
        style={styles.buttonContainer}
        // onPress={() => navigation.navigate('InspectionReceivingApprove')}
      >
        <ButtonApp
          label="Approve"
          onPress={() => {
            setModalConfirmVisible(true);
          }}
          size="large"
          color="primary"
        />
      </View>

      {/* modal confirm */}
      <ModalApp
        visible={modalConfirmVisible}
        title="Confirmation"
        content="Do you want to approve the inspection?"
        type="confirmation"
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={() => {
          // Handle confirmation logic
          handleApprove();
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
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  circleBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#3674B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  countBox: {
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    marginHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // paddingVertical: 8,
  },
  countText: {
    fontSize: 24,
    paddingVertical: 5,
  },
  dropdown: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 12,
    color: '#333',
  },
});

export default InspectionReceivingApproveScreen;
