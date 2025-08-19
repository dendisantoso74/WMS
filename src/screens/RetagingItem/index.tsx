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
import {getTagBinList} from '../../services/tagBin';
import ButtonApp from '../../compnents/ButtonApp';
import {useNavigation} from '@react-navigation/native';
import {fetchRetaggingItems} from '../../services/retagingItem';
import Icon from '../../compnents/Icon';

const RetagingItemScreen = () => {
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
      const res = await fetchRetaggingItems(page);
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

  const handleRegisterNew = () => {
    // TODO: Implement register new RFID logic
    // For now, just add a dummy
    // setRfids(prev => [
    //   ...prev,
    //   `4C50710201900000000${Math.floor(Math.random() * 1000000)}`,
    // ]);
    ToastAndroid.show(
      'Register new RFID Bin is not ready.',
      ToastAndroid.SHORT,
    );
    navigation.navigate('TagBin Scan');
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Bin Detail', {item})}
      style={styles.binCard}>
      {/* <Text style={styles.binText}>Tag: {item.tagcode}</Text> */}
      <Text style={styles.binText}>Bin: {item.bin}</Text>
      <Text style={styles.binText}>Zone: {item.wms_zone}</Text>
      <Text style={styles.binText}>Store: {item.storeloc}</Text>
      {/* <Text style={styles.binText}>Qty: {item.curbal}</Text> */}
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
        ListFooterComponent={
          loading ? (
            <ActivityIndicator className="mt-1" size="large" color="#3674B5" />
          ) : null
        }
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

export default RetagingItemScreen;
