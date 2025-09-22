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
import Icon from '../../compnents/Icon';

const TagBinScreen = () => {
  const navigation = useNavigation<any>();

  const [bins, setBins] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const pageSize = 10;

  const fetchBins = async (page: number, searchValue: string = '*') => {
    setLoading(true);
    try {
      const res = await getTagBinList('*', pageSize, page, searchValue);

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
    fetchBins(1, '*');
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchBins(nextPage, search === '' ? '*' : search);
    }
  };

  // Filter bins by bin number
  // const filteredBins = bins.filter(item =>
  //   item.bin?.toLowerCase().includes(search.toLowerCase()),
  // );

  // --- Add this function to handle search on Enter key ---
  const handleSearchSubmit = () => {
    setPageNo(1);
    fetchBins(1, search === '' ? '*' : search);
  };

  const handleRegisterNew = () => {
    // TODO: Implement register new RFID logic
    // For now, just add a dummy
    // setRfids(prev => [
    //   ...prev,
    //   `4C50710201900000000${Math.floor(Math.random() * 1000000)}`,
    // ]);

    navigation.navigate('TagBin Scan');
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.binCard}>
      <Text style={styles.binText}>Tag: {item.tagcode}</Text>
      <Text style={styles.binText}>Bin: {item.bin}</Text>
      {/* <Text style={styles.binText}>Serial: {item.serialnumber}</Text>
      <Text style={styles.binText}>Store: {item.storeloc}</Text>
      <Text style={styles.binText}>Qty: {item.curbal}</Text> */}
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
          onSubmitEditing={handleSearchSubmit} // <-- Trigger search on Enter
          returnKeyType="search"
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
        data={bins}
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
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="REGISTER NEW RFID BIN"
          onPress={handleRegisterNew}
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

export default TagBinScreen;
