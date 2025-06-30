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
import {Dropdown} from 'react-native-element-dropdown';

const dummyRfids = ['00000000000000000000'];

const DetailMaterialStockOpnameScreen = () => {
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
    <TouchableOpacity>
      <View className="flex-col ">
        <View className="flex-row items-center">
          <View className="w-1/2">
            <Text className="font-bold text-xl">Current Balance</Text>
          </View>
          <View className="w-1/2 items-center" style={styles.counterRow}>
            <View className="w-36" style={styles.countBox}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-bold text-xl">Physical Count</Text>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.circleBtn} onPress={handleDecrease}>
              <Text style={styles.circleBtnText}>-</Text>
            </TouchableOpacity>
            <View className="w-36" style={styles.countBox}>
              <Text style={styles.countText}>{count}</Text>
            </View>
            <TouchableOpacity style={styles.circleBtn} onPress={handleIncrease}>
              <Text style={styles.circleBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className=" p-2 bg-blue-400 flex-col">
        <View className="flex-row gap-3">
          <View className="flex-col justify-start">
            <Text className="font-bold text-white">Material</Text>
            <Text className="font-bold text-white">Serial Number</Text>
            <Text className="font-bold text-white">Bin</Text>
            <Text className="font-bold text-white">Unit</Text>
          </View>
          <View className=" flex-col justify-start">
            <Text className=" text-white">
              TRO2-FO24M / FIBER OPTIC 24 CORE 100m
            </Text>
            <Text className=" text-white">23873268943682843787bvvh</Text>
            <Text className=" text-white">MS-A1L-4-4-2-1</Text>
            <Text className=" text-white">Meter</Text>
          </View>
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
        <ButtonApp label="ADJUSMENT MATERIAL" size="large" color="primary" />
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

export default DetailMaterialStockOpnameScreen;
