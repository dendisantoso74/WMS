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

const dummyRfids = ['00000000000000000000'];

const TagInspectScreen = () => {
  const navigation = useNavigation<any>();

  const [rfids, setRfids] = useState(dummyRfids);

  const renderItem = ({item}: {item: string}) => (
    <SafeAreaView style={styles.rfidCard}>
      <View className="my-2">
        <Text className="font-bold px-4 text-red-600">PO - 1631</Text>
        <Text className="font-semibold px-4">IPWR</Text>
        <Text className="px-4">15-Jul-2020 15:12</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-col p-2 bg-blue-400">
        <View className="flex-row justify-start items-start">
          <Text className="font-bold text-white">Material</Text>
          <Text className="ml-10 font-light w-64 text-white">
            TRO2-FO24M / FIBER OPTIC 24 CORE 100 Meters
          </Text>
        </View>
        <View className="flex-row justify-start items-start">
          <Text className="font-bold text-white">Serial</Text>
          <Text className="font-bold text-white"></Text>
        </View>
        <View className="flex-row justify-start items-start">
          <Text className="font-bold text-white">Unit Order</Text>
          <Text className="ml-10 font-light w-64 text-white">1.0 ROLL</Text>
        </View>
      </View>
      <View className="items-center">
        <Text className="font-bold">Available RFID Tags</Text>
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

export default TagInspectScreen;
