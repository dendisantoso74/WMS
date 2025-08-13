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
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import {getTagBinList} from '../../services/tagBin';
import ButtonApp from '../../compnents/ButtonApp';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../compnents/Icon';

const RetagingBinScreen = () => {
  const navigation = useNavigation<any>();

  const [bins, setBins] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const pageSize = 10;

  const fetchBins = async (page: number) => {
    setLoading(true);
    try {
      const res = await getTagBinList('*', pageSize, page);
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

  useEffect(() => {
    console.log('Bin details:', filteredBins);
  }, []);

  const handleRetag = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    console.log('Input value:', inputValue, selectedItem);
    // await retagSerializedItem(
    //   selectedItem.wms_serializeditem[0].wms_serializeditemid,
    //   inputValue,
    // ).then(res => {
    //   console.log('Retagging response:', res);
    //   if (res.error) {
    //     console.error('Error retagging item:', res.error);
    //   } else {
    //     Alert.alert('Success', 'Item retagged successfully!');
    //     console.log('Item retagged successfully:', res);
    //     setModalVisible(false);
    //     setInputValue('');
    //   }
    // });
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => handleRetag(item)} style={styles.binCard}>
      {/* <Text style={styles.binText}>Tag: {item.tagcode}</Text> */}
      <Text style={styles.binText}>Bin: {item.bin}</Text>
      <Text style={styles.binText}>Zone: {item.wms_zone}</Text>
      <Text style={styles.binText}>Store: {item.storeloc}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{paddingBottom: 4}}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Bin Number"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
        <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 12, top: 12}}
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
        ListFooterComponent={
          loading ? (
            <ActivityIndicator className="mt-1" size="large" color="#3674B5" />
          ) : null
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Enter Value
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <View style={{width: 12}} />
              <Button title="Submit" onPress={() => handleModalSubmit()} />
            </View>
          </View>
        </View>
      </Modal>
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
