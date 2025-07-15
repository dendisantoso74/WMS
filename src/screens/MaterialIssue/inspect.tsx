import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {getWorkOrderDetails} from '../../services/materialIssue';
import {set} from 'lodash';
import {formatDateTime} from '../../utils/helpers';
import {WoDetail} from '../../utils/types';

const dummyRfids = [''];

const MaterialIssueInspectScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;

  const [search, setSearch] = useState('');

  const [rfids, setRfids] = useState(dummyRfids);
  const [modalVisible, setModalVisible] = useState(false);
  const [datas, setDatas] = useState<WoDetail[]>([]); // <-- Use WoDetail[] type
  const [invUse, setInvUse] = useState([]); // <-- Use WoDetail[] type

  const handleReceive = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (listrfid) {
      setRfids(listrfid);
    }
    console.log('RFIDs from params:', listrfid);
    //fetchwo
    getWorkOrderDetails(listrfid)
      .then(res => {
        if (res.error) {
          console.error('Error fetching work order details:', res.error);
        } else {
          setDatas(res.member);
          setInvUse(res.member[0].invuse);
          console.log('Work order details:', res.member);
          // Process the work order details as needed
        }
      })
      .catch(err => {
        console.error('Error in getWorkOrderDetails:', err);
      });
  }, [listrfid]);

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail Material Issue', {item: item})}
      style={styles.rfidCard}>
      <View style={[styles.sideBar, {backgroundColor: 'gray'}]} />
      <View className="my-2">
        <View className="flex-row justify-between">
          <Text className="font-bold">{item.invuseline[0].itemnum}</Text>
          <Text className="">
            Reserved : {item.invuseline[0].quantity}{' '}
            {item.invuseline[0].wms_unit}
          </Text>
        </View>

        <Text className="font-bold max-w-64">
          {item.invuseline[0].description}
        </Text>
        <View className="flex-row justify-between">
          <Text className="w-1/3 ml-3 text-lg font-bold">
            {item.invuseline[0].toconditioncode}
          </Text>
          <Text className="w-1/2 text-right">Order / Receive</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="w-1/3 ml-3"></Text>
          <Text className="w-1/2 text-right">
            {' '}
            - {item.invuseline[0].wms_unit} / {}
            {item.invuseline[0].receivedqty} {item.invuseline[0].wms_unit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View>
          <Text className="font-bold text-white">WO Number</Text>
          <Text className="font-bold text-white">WO Date</Text>
        </View>
        <View>
          <Text className="ml-10 font-bold text-white">{datas[0]?.wonum}</Text>
          <Text className="ml-10 font-bold text-white">
            {formatDateTime(datas[0]?.statusdate || '')}
          </Text>
        </View>
      </View>
      <TextInput
        style={styles.filterInput}
        placeholder="Enter Material Code or Material Name"
        placeholderTextColor="#b0b0b0"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={invUse}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="PUT TO STAGE"
          onPress={() => navigation.navigate('Detail Material Issue')}
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

export default MaterialIssueInspectScreen;
