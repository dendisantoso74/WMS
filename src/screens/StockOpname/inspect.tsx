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

const dummyRfids = ['00000000000000000000'];

const DetaliBinStockOpnameScreen = () => {
  const navigation = useNavigation<any>();

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() => navigation.navigate('Detail Material Stock Opname')}>
      <View style={[styles.sideBar, {backgroundColor: 'gray'}]} />
      <View className="my-2 flex-row">
        <View className="flex-col justify-start">
          <Text className="font-bold">
            TRO2-FO24M / FIBER OPTIC 24 CORE 100meters
          </Text>
          <Text className="font-bold">30458094809485</Text>
          <View className="flex-row gap-5">
            <View className="flex-col">
              <Text>Current Balance</Text>
              <Text>Physical Count</Text>
              <Text>Condition code</Text>
            </View>
            <View className="flex-col">
              <Text>100 meter</Text>
              <Text>100 meter</Text>
              <Text>REPAIRED</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="bg-blue-400 p-2">
        <View className="flex-row gap-16">
          <View className="flex-col justify-start">
            <Text className="font-bold text-white">Bin</Text>
            <Text className="font-bold text-white">Zone</Text>
            <Text className="font-bold text-white">Area</Text>
          </View>
          <View className=" flex-col justify-start">
            <Text className="font-bold text-white">MS-A1L-4-4-2-1</Text>
            <Text className="font-bold text-white">MS-A1</Text>
            <Text className="font-bold text-white">MS-AREA</Text>
          </View>
        </View>
        <Text className="text-white">0 Items scanned of 1</Text>
      </View>

      <View className="bg-blue-200 px-2 py-2 ">
        <View className="mr-3 flex-row items-center gap-3">
          <Icon library="Feather" name="info" size={15} color="blue" />
          <Text className="font-bold text-blue-600">
            Scan device to material, then the serial number will be shown
          </Text>
        </View>
      </View>
      <View style={styles.filterContainer}></View>
      <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp label="SAVE" size="large" color="primary" />
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

export default DetaliBinStockOpnameScreen;
