import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {ScanPo} from '../../services/materialRecive';

const dummyRfids = ['00000000000000000000'];

const MaterialReceiveDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;

  const [search, setSearch] = useState('');

  const [rfids, setRfids] = useState(dummyRfids);
  const [modalVisible, setModalVisible] = useState(false);
  const [datas, setDatas] = useState([]);
  const [selectedData, setSelectedData] = useState<string | null>(null);

  const handleReceive = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    ScanPo(listrfid[listrfid.length - 1]).then((res: any) => {
      console.log('RFIDs fetched successfully:', res.member.length);
      if (res.member.length === 0) {
        navigation.goBack();
        Alert.alert(
          'No Data',
          'No data found for this PO number.',
          // [{text: 'OK', onPress: () => navigation.goBack()}],
          // {cancelable: false},
        );
      }
      setDatas(res.member[0].poline);
    });
  }, []);

  const renderItem = item => (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
        setSelectedData(item.item.polinenum);
      }}
      style={styles.rfidCard}>
      <View style={[styles.sideBar, {backgroundColor: 'gray'}]} />
      <View className="my-2">
        <Text className="font-bold">{item.item.itemnum}</Text>
        <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
          {item.item.description}
        </Text>
        <View className="flex-row justify-between">
          <Text className="w-1/3 ml-3 text-lg font-bold">
            {item.item.conditioncode}
          </Text>
          <Text className="w-1/2 text-right">Order / Receive</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="w-1/3 ml-3"></Text>
          <Text className="w-1/2 text-right">
            {item.item.orderqty} {item.item.orderunit} / {item.item.orderqty}{' '}
            {item.item.orderunit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <Text className="font-bold text-white">PO Number</Text>
        <Text className="ml-10 font-bold text-white">
          {listrfid[listrfid.length - 1]}
        </Text>
      </View>
      <TextInput
        style={styles.filterInput}
        placeholder="Enter Material Code or Material Name"
        placeholderTextColor="#b0b0b0"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={datas}
        renderItem={renderItem}
        keyExtractor={item => item.polinenum}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="RECEIVE"
          onPress={handleReceive}
          size="large"
          color="primary"
        />
      </View>

      <ModalInputWms
        visible={modalVisible}
        material={
          datas.find(item => item.polinenum === selectedData)?.description || ''
        }
        orderQty={
          datas.find(item => item.polinenum === selectedData)?.orderqty || ''
        }
        orderunit={
          datas.find(item => item.polinenum === selectedData)?.orderunit || ''
        }
        remainingQty={
          datas.find(item => item.polinenum === selectedData)?.orderqty || ''
        }
        total={3}
        onClose={() => setModalVisible(false)}
        onReceive={handleReceive}
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
  maxWidthFullMinus8: {
    maxWidth: 300,
    // marginRight: 8,
  },
});

export default MaterialReceiveDetailScreen;
