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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import {ListPoWINSP} from '../../services/materialRecive';
import {formatDateTime} from '../../utils/helpers';
import Loading from '../../compnents/Loading';
import PreventBackNavigate from '../../utils/preventBack';
import ModalApp from '../../compnents/ModalApp';
import {debounce} from 'lodash';
import {
  ZebraEvent,
  ZebraEventEmitter,
  ZebraResultPayload,
} from 'react-native-zebra-rfid-barcode';

const InspectionScreen = () => {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState<any[]>([]); // Adjust type as needed
  const [filteredData, setFilteredData] = useState<any[]>([]); // Store filtered data for display
  const [isLoading, setIsloading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Listen for barcode scan event from Zebra reader
      const barcodeEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_BARCODE,
        (e: ZebraResultPayload) => {
          if (e?.data) {
            setSearch(e.data);
            handleSearch(e.data);
          }
        },
      );
      return () => {
        barcodeEvent.remove();
      };
    }, [datas]),
  );

  const fetchPOWINSP = async () => {
    setIsloading(true);
    // Replace with actual data fetching logic
    const res = await ListPoWINSP();
    const data = res.member || [];
    setDatas(data);
    setFilteredData(data);
    if (res.member) {
      setIsloading(false);
    }
  };
  useEffect(() => {
    fetchPOWINSP();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredData(datas);
    } else {
      // Filter the list based on the search text
      const filtered = datas.filter(item =>
        item.ponum.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
      if (filtered.length === 0) {
        ToastAndroid.show('No items found', ToastAndroid.SHORT);
      }
    }
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() =>
        navigation.navigate('InspectionReceivingPO', {
          ponum: item.ponum,
        })
      }>
      <View>
        <View className="my-2">
          <Text className="px-4 font-bold">PO : {item?.ponum}</Text>
          <Text className="px-4 font-semibold">Vendor : {item?.vendor}</Text>
          <Text className="px-4">
            Date : {item.orderdate ? formatDateTime(item.orderdate) : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="HomeWMS" />

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter PO Number"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={e => handleSearch(e)}
        />
        <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 20, top: 12}}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator className="mt-6" size="large" color="#3674B5" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.poid}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          ListEmptyComponent={
            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
              <Text>No items found</Text>
            </View>
          }
        />
      )}
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

export default InspectionScreen;
