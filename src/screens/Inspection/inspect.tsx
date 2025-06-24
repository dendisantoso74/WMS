import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {Dropdown} from 'react-native-element-dropdown';

const dummyRfids = ['00000000000000000000'];

const data = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

const InspectionReceivingApproveScreen = () => {
  const navigation = useNavigation<any>();

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');

  const [count, setCount] = useState(0);

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const renderItem = ({item}: {item: string}) => (
    <View className="">
      <View className="flex flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-xl">Accepted Qty</Text>
        </View>
        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleDecrease}>
            <Text style={styles.circleBtnText}>-</Text>
          </TouchableOpacity>
          <View style={styles.countBox}>
            <Text style={styles.countText}>{count}</Text>
          </View>
          <TouchableOpacity style={styles.circleBtn} onPress={handleIncrease}>
            <Text style={styles.circleBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-green-500 rounded-full bg-green-600 ml-3">
            <Icon library="Feather" name="check" size={30} color="white"></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-xl">Rejected Qty</Text>
        </View>
        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleDecrease}>
            <Text style={styles.circleBtnText}>-</Text>
          </TouchableOpacity>
          <View style={styles.countBox}>
            <Text style={styles.countText}>{count}</Text>
          </View>
          <TouchableOpacity style={styles.circleBtn} onPress={handleIncrease}>
            <Text style={styles.circleBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-green-500 rounded-full bg-green-600 ml-3">
            <Icon library="Feather" name="check" size={30} color="white"></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between my-5">
        <View>
          <Text className="font-bold text-xl">Rejected Code</Text>
        </View>
        <Dropdown
          style={[styles.dropdown]}
          data={data}
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
      <View className="pt-6">
        <TouchableOpacity
          className="flex-row items-center justify-center  rounded-xl "
          style={{backgroundColor: 'red', height: 50, width: '50%'}}>
          <Icon library="Feather" name="plus" size={20} color="white"></Icon>
          <Text className=" text-white justify-end">ADD REJECT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className=" bg-blue-400 w-full">
        <View className="flex-row ml-2 my-1">
          <Text className="font-bold text-white">Material</Text>
          <Text className="ml-10 font-bold text-white">: TR02-FOM</Text>
        </View>
        <View className="flex-row ml-2 my-1">
          <Text className="font-bold text-white">PO QTY</Text>
          <Text className="ml-10 font-bold text-white">: 3.0 ROLL</Text>
        </View>
      </View>
      <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('InspectionReceivingApprove')}>
        <ButtonApp
          label="Approve"
          // onPress={console.log('Inspect button pressed')}
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
    paddingVertical: 8,
  },
  countText: {
    fontSize: 28,
    color: '#222',
    fontWeight: '500',
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
