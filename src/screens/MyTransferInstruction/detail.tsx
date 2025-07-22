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
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {formatDateTime} from '../../utils/helpers';

const MyTransferInstructionScanScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {datas} = route.params;
  console.log('item from params:', datas);

  const [search, setSearch] = useState('');
  const [invuse, setInvuse] = useState([]);

  useEffect(() => {
    // You can fetch any initial data here if needed
    setInvuse(datas.invuseline);
  }, [datas]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      onPress={() =>
        navigation.navigate('My Transfer Instruction Submit', {
          item: item,
          invuseid: datas.invuseid,
        })
      }>
      <View style={[styles.sideBar, {backgroundColor: 'gray'}]} />
      <View className="my-2">
        <View className="flex-col justify-start">
          <Text className="font-bold">Bin : {item.tobin}</Text>
          <Text className="font-bold">
            {item?.itemnum} / {item?.description}
          </Text>
          <Text className="font-bold">
            TI Qty : {item.quantity} {item.wms_unit}
          </Text>
          <Text className="font-bold">Putaway Qty : 0 {item.wms_unit}</Text>
          <Text className="font-bold">{item?.toconditioncode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View className="flex-col justify-start">
          <Text className="font-bold text-white">PO Number</Text>
          <Text className="font-bold text-white">PO Date</Text>
          <Text className="font-bold text-white">TI Number</Text>
        </View>
        <View className="flex-col justify-start px-10">
          <Text className="font-bold text-white">{datas.wms_ponum}</Text>
          <Text className="font-bold text-white">
            {formatDateTime(datas.statusdate)}
          </Text>
          <Text className="font-bold text-white">{datas.invusenum}</Text>
        </View>
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
          style={{position: 'absolute', right: 12, top: 12}}
        />
      </View>
      <FlatList
        data={invuse}
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

export default MyTransferInstructionScanScreen;
