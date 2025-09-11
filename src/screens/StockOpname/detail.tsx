import React, {useCallback, useEffect, useState} from 'react';
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {
  changeStatusOpname,
  getDetailBin,
  getDetailStockOpname,
} from '../../services/stockOpname';
import {formatDateTime} from '../../utils/helpers';
import {
  ZebraEvent,
  ZebraEventEmitter,
  ZebraResultPayload,
  ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {debounce, uniq} from 'lodash';
import ModalApp from '../../compnents/ModalApp';

const DetailStockOpnameScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {wms_opinid} = route.params;

  const [loading, setLoading] = useState(true);
  const [stockOpname, setStockOpname] = useState();
  const [stockOpnameBin, setStockOpnameBin] = useState([]);
  const [search, setSearch] = useState('');
  const [rfidItems, setRfidItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // rfisd reader setup
  useFocusEffect(
    useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          console.log('scan on stock opname', uniq(e.data));
          handleRfidEvent(uniq(e.data));
        },
      );
      // Clean up listeners when screen is unfocused
      return () => {
        rfidEvent.remove();
      };
    }, []),
  );

  const handleRfidEvent = useCallback(
    debounce((newData: string[]) => {
      setRfidItems(newData[0]);
      getDetailBin(newData[0])
        .then(res => {
          setRfidItems(res.member);
          const binnum = res.member[0].wms_bin[0].bin;
          console.log('detail bin', binnum);
          setSearch(binnum);
        })
        .catch(err => {
          ToastAndroid.show('Bin not found', ToastAndroid.SHORT);
        });
    }, 200),
    [],
  );

  const handleDone = () => {
    changeStatusOpname(wms_opinid, 'WAPPR')
      .then(res => {
        ToastAndroid.show('Stock Opname Completed', ToastAndroid.SHORT);
        navigation.navigate('Stock Opname List');
      })
      .catch(err => {
        ToastAndroid.show('Failed to complete', ToastAndroid.SHORT);
      });
  };

  const handleSearch = (text: string) => {
    setSearch(text);
  };
  useEffect(() => {
    getDetailStockOpname(wms_opinid).then(res => {
      setStockOpname(res.member[0]);
      setStockOpnameBin(res.member[0].wms_opinline_bin);
      console.log('stock opname detail', res.member[0]);

      setLoading(false);
    });
  }, []);

  const filteredBins = Array.isArray(stockOpnameBin)
    ? stockOpnameBin?.filter(
        bin =>
          bin?.binnum?.toLowerCase().includes(search.toLowerCase()) ||
          bin?.wms_zone?.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const renderItem = ({item}: {item: string}) => {
    const sideBarColor =
      item.scannedcount === item.itemcount
        ? '#A4DD00' // green
        : item.scannedcount > 0 && item.scannedcount < item.itemcount
          ? '#FFD600' // yellow
          : 'gray';

    return (
      <TouchableOpacity
        style={styles.rfidCard}
        onPress={() =>
          navigation.navigate('Detail Bin Stock Opname', {
            itemBin: item,
            wms_opinid: wms_opinid,
          })
        }>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-col justify-start">
            <Text className="font-bold">{item.binnum}</Text>
            <Text className="font-bold">Zone: {item.wms_zone}</Text>
            <Text className="font-bold">Area: {item.wms_area}</Text>
            <Text>
              {item.scannedcount} items scaned from {item.itemcount} items
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator className="mt-6" size="large" color="#3674B5" />
      ) : (
        <>
          <View className="flex-col p-2 bg-blue-400 ">
            <Text className="text-xl text-white">
              {stockOpname?.description}
            </Text>
            <Text className="text-white">
              {formatDateTime(stockOpname?.scanneddate)}
            </Text>
          </View>

          <View>
            <TextInput
              style={styles.filterInput}
              placeholder="Search Bin or Zone"
              placeholderTextColor="#b0b0b0"
              value={search}
              onChangeText={e => setSearch(e)}
              autoCapitalize="characters"
            />
            <Icon
              library="Feather"
              name="search"
              size={20}
              color="#b0b0b0"
              style={{position: 'absolute', right: 20, top: 12}}
            />
          </View>

          <FlatList
            data={filteredBins}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            style={styles.list}
          />
          <View style={styles.buttonContainer}>
            <ButtonApp
              onPress={() => setModalVisible(true)}
              label="Done"
              size="large"
              color="primary"
            />
          </View>
        </>
      )}

      <ModalApp
        content="Are you sure want to complete this stock opname?"
        title="Confirmation"
        type="confirmation"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          handleDone();
          setModalVisible(false);
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
});

export default DetailStockOpnameScreen;
