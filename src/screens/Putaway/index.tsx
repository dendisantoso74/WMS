import React, {useState, useEffect} from 'react';
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
import {fetchPutawayMixed} from '../../services/putaway';
import {formatDateTime} from '../../utils/helpers';

const PutawayScanWoScreen = () => {
  const navigation = useNavigation<any>();
  const [rfids, setRfids] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch list on mount or when search changes
  useEffect(() => {
    setLoading(true);
    fetchPutawayMixed(search)
      .then(res => {
        setRfids(res.member || []);
      })
      .catch(() => {
        ToastAndroid.show('Failed to fetch data', ToastAndroid.SHORT);
        setRfids([]);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() => navigation.navigate('Put Away Material', {item: item})}>
      <View>
        <View style={{marginVertical: 8}}>
          <Text className="ml-2 font-bold">WO - {item.wonum || 'N/A'}</Text>
          <Text className="my-2 ml-2">
            {item.description || 'No Description'}
          </Text>
          <Text className="ml-2">{formatDateTime(item.statusdate) || ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter invuselineid"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
        {/* <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 12, top: 12}}
        /> */}
      </View>
      <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item =>
          item.wonum?.toString() || Math.random().toString()
        }
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={
          !loading && (
            <View style={{alignItems: 'center', marginTop: 32}}>
              <Text style={{color: '#888'}}>No data found.</Text>
            </View>
          )
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
  filterContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
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
    marginTop: 6,
    marginHorizontal: 8,
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
    paddingRight: 16,
  },
  rfidText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginVertical: 4,
    paddingHorizontal: 4,
  },
});

export default PutawayScanWoScreen;
