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
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {getDetailStockOpname} from '../../services/stockOpname';
import {formatDateTime} from '../../utils/helpers';

const dummyRfids = ['00000000000000000000'];

const DetailStockOpnameScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {wms_opinid} = route.params;

  const [rfids, setRfids] = useState(dummyRfids);
  const [loading, setLoading] = useState(true);
  const [stockOpname, setStockOpname] = useState();
  const [stockOpnameBin, setStockOpnameBin] = useState();

  useEffect(() => {
    getDetailStockOpname(wms_opinid).then(res => {
      setStockOpname(res.member[0]);
      setStockOpnameBin(res.member[0].wms_opinline_bin);
      console.log('stock opname detail', res.member[0]);

      setLoading(false);
    });
  }, []);

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() => navigation.navigate('Detail Bin Stock Opname')}>
      <View style={[styles.sideBar, {backgroundColor: 'gray'}]} />
      <View className="my-2">
        <View className="flex-col justify-start">
          <Text className="font-bold">MS-A1L-4-3-2-1</Text>
          <Text className="font-bold">MS-A1</Text>
          <Text className="font-bold">MS-AREA</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-col p-2 bg-blue-400 ">
        <Text className="text-white">{stockOpname?.description}</Text>
        <Text className="text-white">
          {formatDateTime(stockOpname?.scanneddate)}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator className="mt-6" size="large" color="#3674B5" />
      ) : (
        <FlatList
          data={stockOpnameBin}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <ButtonApp
          onPress={() => navigation.goBack()}
          label="Done"
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
});

export default DetailStockOpnameScreen;
