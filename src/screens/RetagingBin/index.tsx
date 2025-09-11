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
  Modal,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getTagBinList} from '../../services/tagBin';
import ButtonApp from '../../compnents/ButtonApp';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import {retagBIN, retagSerializedItem} from '../../services/retagingItem';
import rfid from '../../assets/images/rfid.png'; // Adjust the path as necessary
import {Image} from 'react-native';
import {
  ZebraEvent,
  ZebraEventEmitter,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {debounce, set} from 'lodash';
import ModalApp from '../../compnents/ModalApp';

const RetagingBinScreen = () => {
  const navigation = useNavigation<any>();

  const [bins, setBins] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const pageSize = 10;
  const [tag, setTag] = useState<string>('');
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  // rfid scanner
  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      console.log('RFID Data:', newData);
      // if newdata is array make popup to select item for set to search

      setTag(newData[0]);
    }, 200),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );

      // Clean up listeners when screen is unfocused
      return () => {
        rfidEvent.remove();
      };
    }, []),
  );

  const fetchBins = async (page: number) => {
    setLoading(true);
    try {
      const res = await getTagBinList('*', pageSize, page, '*');
      console.log('Fetched bins:', res);

      const newBins = Array.isArray(res.member) ? res.member : [];
      setBins(prev =>
        page === 1
          ? newBins
          : [
              ...prev,
              ...newBins.filter(
                (item: any) =>
                  !prev.some(
                    (prevItem: any) => prevItem.wms_binid === item.wms_binid,
                  ),
              ),
            ],
      );
      setHasMore(newBins.length === pageSize);
    } catch (e) {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBins(1);
  }, []);

  const handleSearch = async (bin: string) => {
    const res = await getTagBinList('*', pageSize, 1, bin);
    console.log('Search text:', res.member);
    setBins(res.member || []);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchBins(nextPage);
    }
  };

  // Filter bins by bin number
  const filteredBins = bins.filter(item =>
    item.bin?.toLowerCase().includes(search.toLowerCase()),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRetag = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    console.log('slectedItem:', selectedItem?.wms_binid, tag);
    await retagBIN(selectedItem?.wms_binid, tag ? tag : inputValue)
      .then(res => {
        console.log('Retagging response:', res);

        Alert.alert('Success', 'Item retagged successfully!');
        console.log('Item retagged successfully:', res);
        setModalVisible(false);
        setInputValue('');
        setSearch('');
        fetchBins(1);
      })
      .catch(error => {
        console.error('Error in retagging:', error);
        ToastAndroid.show(error.Error.message, ToastAndroid.SHORT);
      });
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => handleRetag(item)} style={styles.binCard}>
      <Text style={styles.binText}>Tag: {item.tagcode}</Text>
      <Text style={styles.binText}>Bin: {item.bin}</Text>
      <Text style={styles.binText}>Zone: {item.wms_zone}</Text>
      <Text style={styles.binText}>Store: {item.storeloc}</Text>
      <Text style={styles.binText}>SN: {item.serialnumber}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{paddingBottom: 4}}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search Bin"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => handleSearch(search)}
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
        keyExtractor={item => item.wms_binid?.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        // ListFooterComponent={
        //   loading ? (
        //     <ActivityIndicator className="mt-1" size="large" color="#3674B5" />
        //   ) : null
        // }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Please scan new RFID bin
            </Text>
            <View className="flex-row justify-center py-3 align-items-center">
              <Image
                source={rfid}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tag"
              value={inputValue || tag}
              onChangeText={setInputValue}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              {/* <Button title="Cancel" onPress={() => setModalVisible(false)} /> */}
              {/* <View style={{width: 12}} /> */}
              {inputValue || tag ? (
                <ButtonApp
                  label="SUBMIT"
                  color="primary"
                  onPress={() => setModalConfirmVisible(true)}
                />
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

      {/* confirmation modal */}
      <ModalApp
        content="Are you sure you want to retag this Bin?"
        onClose={() => setModalConfirmVisible(false)}
        title="Confirmation"
        type="confirmation"
        visible={modalConfirmVisible}
        onConfirm={() => handleModalSubmit()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  binCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    padding: 16,
  },
  binText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginBottom: 4,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
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

export default RetagingBinScreen;
