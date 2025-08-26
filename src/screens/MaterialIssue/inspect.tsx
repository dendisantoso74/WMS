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
  Alert,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {
  completeIssue,
  generateIssueHeader,
  getWorkOrderDetails,
  putToStage,
} from '../../services/materialIssue';
import {set} from 'lodash';
import {formatDateTime} from '../../utils/helpers';
import {WoDetail} from '../../utils/types';
import PreventBackNavigate from '../../utils/preventBack';

const dummyRfids = [''];

const MaterialIssueInspectScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;
  const woNumber = listrfid[listrfid.length - 1];

  const [search, setSearch] = useState('');

  const [rfids, setRfids] = useState(dummyRfids);
  const [modalVisible, setModalVisible] = useState(false);
  const [datas, setDatas] = useState<WoDetail[]>([]); // <-- Use WoDetail[] type
  const [invUse, setInvUse] = useState([]); // <-- Use WoDetail[] type
  const [invreserve, setInvreserve] = useState([]); // <-- Use WoDetail[] type
  const [invreserveid, setInvreserveid] = useState([]);
  const [invreserveIndex, setInvreserveIndex] = useState(0);

  const handleReceive = () => {
    setModalVisible(true);
  };

  const fetchWo = async () => {
    getWorkOrderDetails(woNumber)
      .then(res => {
        if (res.error) {
          console.error('Error fetching work order details:', res.error);
        } else {
          // Check if the work order exists
          console.log('chec exist:', res.member[0]);

          setDatas(res.member);

          setInvreserve(res.member[0].invreserve);
          const filteredInvUse = res.member[0].invuse.filter(
            (item: any) =>
              Array.isArray(item.invuseline) && item.invuseline.length > 0,
          );
          setInvUse(res.member[0].invuse);

          console.log('Work order details:', res);

          // search entered index of array
          let enteredIndex = res.member[0].invuse.findIndex(
            (item: any) => item.status === 'ENTERED',
          );
          if (enteredIndex === -1) {
            enteredIndex = res.member[0].invuse.findIndex(
              (item: any) => item.status === 'STAGED',
            );
          }
          // search inv with status entered
          const enteredInv = res.member[0].invuse.filter(
            (item: any) => item.status === 'ENTERED',
          );
          console.log('Entered inventory:', enteredInv, enteredIndex);
          setInvreserveIndex(enteredIndex);
          setInvreserveid(enteredInv[0]?.invuseid);
          // Process the work order details as needed
        }
      })
      .catch(err => {
        console.error('Error in getWorkOrderDetails:', err);
      });
  };

  useEffect(() => {
    console.log('RFIDs from params:', woNumber);
    //fetchwo
    generateIssueHeader(woNumber)
      .then(x => {
        fetchWo();
      })
      .catch(err => {
        navigation.goBack();

        Alert.alert(
          'Information',
          `${woNumber} Not Found `,
          // [{text: 'OK', onPress: () => navigation.goBack()}],
          // {cancelable: false},
        );
      });
  }, [woNumber]);

  const handlePutToStage = async () => {
    // console.log('Put to stage pressed', invUse[0]?.status);

    if (invUse[invreserveIndex]?.status === 'STAGED') {
      console.log('Already staged', invUse[invreserveIndex]?.invuseid);

      completeIssue(invUse[invreserveIndex]?.invuseid).then(res => {
        console.log('Complete issue response:', res);
        ToastAndroid.show('Issue completed successfully', ToastAndroid.SHORT);
        fetchWo();
      });
    } else {
      console.log('Not staged');

      putToStage(invUse[invreserveIndex]?.invuseid).then(res => {
        console.log('Put to stage response:', res);
        ToastAndroid.show('Put to stage successfully', ToastAndroid.SHORT);
        fetchWo();
      });
    }
  };

  const renderItem = ({item, index}: {item: string; index: number}) => {
    const sideBarColor =
      item?.reservedqty === item?.pendingqty + item?.stagedqty
        ? '#A4DD00'
        : 'gray';
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Detail Material Issue', {
            item: item,
            invuselinenum: index + 1,
            invinvUseId: invreserveid,
            indexInvEntered: invreserveIndex,
          })
        }
        style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">{item?.itemnum}</Text>
            <Text className="">
              Reserved : {item?.reservedqty} {item?.wms_unit}
            </Text>
          </View>

          <Text className="font-bold max-w-64">{item?.description}</Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold">
              {item?.conditioncode}
            </Text>
            <Text className="w-1/2 text-right">Outstanding / Issue</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="w-1/3 font-bold">
              {/* {item?.conditioncode} */}
              {item?.invreserveid}
            </Text>
            <Text className="w-1/2 text-right">
              {invUse[invreserveIndex]?.status === 'STAGED'
                ? item?.reservedqty - item?.stagedqty
                : item?.reservedqty - item?.pendingqty}
              {item?.wms_unit} / {''}
              {invUse[invreserveIndex]?.status === 'STAGED'
                ? item?.stagedqty
                : item?.pendingqty}
              {item?.wms_unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="Material Issue Scan" />
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
        data={invreserve}
        renderItem={renderItem}
        keyExtractor={item => item.invreserveid}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      {invreserve && (
        <View style={styles.buttonContainer}>
          <ButtonApp
            label={
              invUse[invreserveIndex]?.status === 'STAGED'
                ? 'COMPLETE'
                : 'PUT TO STAGE'
            }
            onPress={() => handlePutToStage()}
            disabled={invUse[invreserveIndex]?.status === 'COMPLETE'}
            size="large"
            color="primary"
          />
        </View>
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

export default MaterialIssueInspectScreen;
