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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import {getListTransferInstructions} from '../../services/transferInstruction';
import {formatDateTime} from '../../utils/helpers';

const dummyRfids = ['00000000000000000000'];

const TransferInstructionScreen = () => {
  const navigation = useNavigation<any>();

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');
  const [transferInstructions, setTransferInstructions] = useState<any[]>([]);
  const [filteredInstructions, setFilteredInstructions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getListTransferInstructions();
        const filtered = Array.isArray(res.member)
          ? res.member.filter((item: any) => !!item.wms_ponum)
          : [];
        setTransferInstructions(filtered);
        setFilteredInstructions(filtered);
      } catch (e) {
        setTransferInstructions([]);
        setFilteredInstructions([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredInstructions(transferInstructions);
    } else {
      setFilteredInstructions(
        transferInstructions.filter((item: any) =>
          item.wms_ponum?.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, transferInstructions]);

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() =>
        navigation.navigate('Transfer Instruction Assign', {item: item})
      }>
      <View>
        <View className="my-2">
          <Text className="px-4 font-bold">{item.wms_ponum}</Text>
          <Text className="px-4">{item.invusenum}</Text>
          <Text className="px-4">{item.fromstoreloc}</Text>
          <Text className="px-4">{formatDateTime(item.statusdate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {console.log('list', transferInstructions)}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter PO Number"
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
        data={filteredInstructions}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
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

export default TransferInstructionScreen;
