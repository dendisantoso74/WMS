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
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {
  findSuggestedBinReturn,
  receiveMaterial,
} from '../../services/materialReturn';
import PreventBackNavigate from '../../utils/preventBack';
import {getData} from '../../utils/store';
import {Dropdown} from 'react-native-element-dropdown';

const DetailMaterialReturnScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, invuseid, maxqty} = route.params;
  console.log('item from params:', item, invuseid);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const [suggestBin, setSuggestBin] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userMX, setUserMX] = useState('');
  const [remark, setRemark] = useState('');
  const [suggestedBinSelect, setSuggestedBinSelect] = useState('');

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleReceive = () => {
    setModalVisible(true);
  };

  const handleInputCount = (text: string) => {
    // Only allow numbers, fallback to 0 if empty or invalid
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    // Max is item.receiptquantity - inputAceptedQty
    const max = item.qtyrequested - maxqty;
    if (isNaN(num)) {
      setCount(0);
    } else if (num > max) {
      setCount(max);
    } else {
      setCount(num);
    }
  };

  useEffect(() => {
    setCount(item.qtyrequested - maxqty);
    getData('MAXuser').then(res => {
      setUserMX(res);
    });

    suggestedBin();
  }, [item]);

  const buildReturnPayload = (
    item: any,
    invuseid: number,
    count: number,
    remark: string = '',
  ) => ({
    invuseline: [
      {
        frombin: item.frombin || item.binnum,
        fromconditioncode: item.fromconditioncode || item.conditioncode,
        fromstoreloc: item.storeloc,
        inspectionrequired: true,
        // invuseId: 0,
        invuselinenum:
          item.invuselinenum ||
          item.invuseline?.invuselinenum ||
          item.invuselinenum ||
          0,
        issueid: item.matusetransid,
        issueto: userMX,
        itemnum: item.itemnum,
        itemsetid: item.itemsetid,
        linetype: item.linetype,
        orgid: item.orgid,
        quantity: count,
        refwo: item.refwo,
        remark: remark,
        toorgid: 'BJS',
        tositeid: 'TJB56',
        usetype: 'RETURN',
        validated: false,
        wms_usetype: 'RETURN',
        returnagainstissue: true,
      },
    ],
  });

  // Usage example (inside your handleAdd or similar function):

  const handleAdd = async () => {
    const payload = buildReturnPayload(item, invuseid, count);
    if (count <= 0) {
      ToastAndroid.show(
        'Please enter a valid return quantity',
        ToastAndroid.SHORT,
      );
      console.log('payload:', payload);

      return;
    } else {
      await receiveMaterial(invuseid, payload).then(res => {
        ToastAndroid.show('Material received successfully', ToastAndroid.SHORT);
        navigation.navigate('Material Return Detail', {
          listrfid: [item.refwo],
        });
      });
    }
    // navigation.goBack();
  };

  const suggestedBin = async () => {
    const res = await findSuggestedBinReturn(item.itemnum, item.fromstoreloc);
    setSuggestBin(res.member);
    setSuggestedBinSelect(res.member[0]?.binnum);
    console.log('Suggested Bin:', res.member);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="p-2 bg-blue-400">
        <View className="flex-row items-start justify-start">
          <Text className="w-1/5 font-bold text-white">Material</Text>
          <Text className="w-4/5 text-white">
            {item.itemnum} / {item.description}
          </Text>
        </View>

        <View className="flex-row items-start justify-start">
          <Text className="w-1/5 font-bold text-white">Issue Qty</Text>
          <Text className="text-white ">
            {item.qtyrequested} {item.issueunit}
          </Text>
        </View>

        <View className="flex-row items-start justify-start">
          <Text className="w-1/5 font-bold text-white">Bin</Text>
          <Text className="text-white ">{item.binnum}</Text>
        </View>
      </View>

      <View className="px-3 mt-4 mr-5">
        <View className="flex-row items-center ">
          <Text className="w-1/3 font-bold">Return Qty</Text>
          <TouchableOpacity style={styles.circleBtn} onPress={handleDecrease}>
            <Text style={styles.circleBtnText}>-</Text>
          </TouchableOpacity>
          <View style={styles.countBox} className="w-36">
            {/* <Text style={styles.countText}>{count}</Text> */}
            <TextInput
              style={[styles.countText, {textAlign: 'center'}]}
              keyboardType="numeric"
              value={count.toString()}
              onChangeText={handleInputCount}
              // maxLength={item.receiptquantity.toString().length}
            />
          </View>
          <TouchableOpacity
            disabled={count == item.qtyrequested - maxqty}
            style={styles.circleBtn}
            onPress={handleIncrease}>
            <Text style={styles.circleBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-5">
          <Text className="w-1/3 font-bold">Suggestion Bin</Text>
          {/* <View className="w-2/3 py-2 ml-5 bg-gray-200">
            <Text className="ml-2 font-bold text-left ">{suggestBin}</Text>
          </View> */}
          <View className="w-2/3 py-2 ml-5 bg-gray-200">
            <Dropdown
              data={suggestBin}
              labelField="binnum"
              valueField="binnum"
              value={suggestedBinSelect}
              onChange={item => setSuggestedBinSelect(item.binnum)}
              style={{
                backgroundColor: 'transparent',
                // width: '100%',
                paddingHorizontal: 8,
              }}
              // placeholder="Select Suggested Bin"
            />
          </View>
        </View>
        <View className="flex-row items-center mt-5">
          <Text className="w-1/3 font-bold">Condition Code</Text>
          <View className="w-2/3 py-2 ml-5 bg-gray-200">
            <Text className="ml-2 font-bold text-left">
              {item.conditioncode}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mt-5">
          <Text className="w-1/3 font-bold">Remark</Text>
          <TextInput
            multiline
            placeholder=""
            className="w-2/3 py-2 ml-5 border rounded"
            value={remark}
            onChangeText={setRemark}></TextInput>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Add"
          onPress={() => handleAdd()}
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
  circleBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#3674B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    fontSize: 22,
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
    paddingVertical: 8,
  },
  countText: {
    fontSize: 20,
    paddingVertical: 0,
  },
});

export default DetailMaterialReturnScreen;
