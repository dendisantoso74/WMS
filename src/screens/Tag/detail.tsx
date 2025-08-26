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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import {scanPoWtag} from '../../services/materialRecive';
import {getData} from '../../utils/store';
import {SerializedItem} from '../../utils/types';
import PreventBackNavigate from '../../utils/preventBack';

const TagDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;
  const PoNumber = listrfid[listrfid.length - 1];
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'TAGGED' | 'UNTAGGED'
  >('UNTAGGED');
  const [search, setSearch] = useState('');

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const [totalItem, setTotalItem] = useState(0);
  const [totalUnTagged, setTotalUnTagged] = useState(0);

  const filteredData = React.useMemo(() => {
    let filtered = datas;

    // Filter by tag status
    if (activeFilter === 'TAGGED') {
      filtered = filtered.filter((item: any) => !!item.tagcode);
    } else if (activeFilter === 'UNTAGGED') {
      filtered = filtered?.filter((item: any) => !item.tagcode);
    }

    // Local search by material code or material name
    if (search.trim() !== '') {
      const searchText = search.toLowerCase();
      filtered = filtered.filter(
        (item: any) =>
          (item.itemnum?.toLowerCase().includes(searchText) ?? false) ||
          (item.description?.toLowerCase().includes(searchText) ?? false),
      );
    }

    return filtered;
  }, [activeFilter, datas, search]);

  useEffect(() => {
    console.log('RFIDs from params:', PoNumber);

    const fetchData = async () => {
      setLoading(true);
      const site = await getData('site');

      scanPoWtag(PoNumber)
        .then((res: any) => {
          console.log('RFIDs fetched successfully:', res.member);
          if (res.member.length === 0) {
            navigation.goBack();
            Alert.alert(
              'Information',
              `${PoNumber} Not Found at site: ${site} `,
              // [{text: 'OK', onPress: () => navigation.goBack()}],
              // {cancelable: false},
            );
          }
          const items = res.member[0].wms_serializeditem;
          setDatas(items);
          setTotalItem(items.length);
          setTotalUnTagged(items.filter((item: any) => !item.tagcode).length);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchData();
  }, [listrfid]);

  const renderItem = ({item}: {item: SerializedItem}) => {
    const isTagged = !!item.tagcode && !!item.serialnumber;
    const sideBarColor = isTagged ? '#A4DD00' : 'gray';
    return (
      <TouchableOpacity
        disabled={isTagged}
        style={styles.rfidCard}
        onPress={() =>
          navigation.navigate('Item to Tag', {
            item: item,
            poNumber: listrfid,
          })
        }>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-col mr-1">
            <Text className="font-bold">{item.itemnum}</Text>
            <Text className="font-bold">{item.description}</Text>
            <Text className="font-bold">Tag code: {item?.tagcode}</Text>
            <Text className="font-bold">Serial: {item?.serialnumber}</Text>
            <Text className="font-bold">{item.conditioncode}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="Po to Tag" />
      <View className="flex-row p-2 bg-blue-400">
        <Text className="font-bold text-white">PO Number</Text>
        <Text className="ml-10 font-bold text-white">{PoNumber}</Text>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter Material Code or Material Name"
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
        {/* chip filter tag untag */}
        <View className="flex-row gap-2 mx-3 my-1 max-w-fit">
          <TouchableOpacity onPress={() => setActiveFilter('ALL')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'ALL'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              All ({totalItem})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter('TAGGED')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'TAGGED'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              Tagged ({totalItem - totalUnTagged})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter('UNTAGGED')}>
            <Text
              className={`px-3 border rounded-md ${
                activeFilter === 'UNTAGGED'
                  ? 'border-blue-600 bg-blue-200 text-blue-800 font-bold'
                  : 'border-blue-200 bg-blue-50'
              }`}>
              Untagged ({totalUnTagged})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={{flex: 1, marginTop: 32, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3674B5" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
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

export default TagDetailScreen;
