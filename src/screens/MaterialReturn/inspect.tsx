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
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';

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

const DetailMaterialReturnScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const [rfids, setRfids] = useState(dummyRfids);
  const [modalVisible, setModalVisible] = useState(false);

  const handleReceive = () => {
    setModalVisible(true);
  };

  const renderItem = ({item}: {item: string}) => (
    <View className="flex-col w-full px-2 pr-2">
      <View className="flex-row items-center ">
        <Text className="font-bold w-1/3">Return Qty</Text>
        <TouchableOpacity style={styles.circleBtn} onPress={handleDecrease}>
          <Text style={styles.circleBtnText}>-</Text>
        </TouchableOpacity>
        <View style={styles.countBox} className="w-36">
          <Text style={styles.countText}>{count}</Text>
        </View>
        <TouchableOpacity style={styles.circleBtn} onPress={handleIncrease}>
          <Text style={styles.circleBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center mt-5">
        <Text className="font-bold w-1/3">Suggestion Qty</Text>
        <View className="bg-gray-200 w-2/3 py-2 ml-5">
          <Text className="font-bold text-left ml-2 ">MS-A1L-4-2-2-1</Text>
        </View>
      </View>
      <View className="flex-row items-center mt-5">
        <Text className="font-bold w-1/3">Condition Code</Text>
        <View className="bg-gray-200 w-2/3 py-2 ml-5">
          <Text className="font-bold text-left ml-2">REPAIRED</Text>
        </View>
      </View>
      <View className="flex-row items-center mt-5">
        <Text className="font-bold w-1/3">Remark</Text>
        <TextInput className="border rounded w-2/3 py-2 ml-5"></TextInput>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View>
          <Text className="font-bold text-white">Material</Text>
          <Text className="font-bold text-white">Issue Qty</Text>
          <Text className="font-bold text-white">Bin</Text>
        </View>
        <View>
          <Text className="ml-10 font-bold text-white">
            FIBER OPTIC 24 CORE 100 Meters
          </Text>
          <Text className="ml-10 font-bold text-white">100 METER</Text>
          <Text className="ml-10 font-bold text-white">MS-A1L-4-4-2-1</Text>
        </View>
      </View>
      <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Add"
          onPress={() => navigation.navigate('Detail Wo Material Return')}
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
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
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
});

export default DetailMaterialReturnScreen;
