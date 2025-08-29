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
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalInputWms from '../../compnents/wms/ModalInputWms';
import {findInvuselineByIdReturn, formatDateTime} from '../../utils/helpers';
import {
  changeInvUseStatusComplete,
  createInvUseReturnHeader,
  scanWoForReturn,
} from '../../services/materialReturn';
import PreventBackNavigate from '../../utils/preventBack';
import rfid from '../../assets/images/rfid.png'; // Adjust the path as necessary
import {
  ZebraEvent,
  ZebraEventEmitter,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {set} from 'lodash';

const MaterialReturnDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;
  const woNum = listrfid[listrfid.length - 1];
  const [datas, setDatas] = useState([]);
  const [woList, setWoList] = useState([]);
  const [woListIssue, setWoListIssue] = useState([]);
  const [woListReturn, setWoListReturn] = useState([]);
  const [woListmatusetrans, setWoListmatusetrans] = useState([]);
  const [headerReturn, setHeaderReturn] = useState({});

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [returnInvuseId, setReturnInvuseId] = useState('');
  const [filteredMatusetrans, setFilteredMatusetrans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleReceive = () => {
    setModalVisible(true);
  };
  // Update this function to also add invuselinenum from invuse.invuseline
  const enrichMatusetransWithInvuseid = (matusetrans: any[], invuse: any[]) => {
    return (
      matusetrans
        // .filter(mt => mt.issuetype === 'RETURN') // <-- Only items with issuetype RETURN
        .map(mt => {
          let foundInvuseid: number | undefined;
          let foundInvuselinenum: number | undefined;
          for (const inv of invuse) {
            if (Array.isArray(inv.invuseline)) {
              const foundLine = inv.invuseline.find(
                (line: any) => line.invuselineid === mt.invuselineid,
              );
              if (foundLine) {
                foundInvuseid = inv.invuseid;
                foundInvuselinenum = foundLine.invuselinenum;
                break;
              }
            }
          }
          return {
            ...mt,
            invuseid: foundInvuseid,
            invuselinenum: foundInvuselinenum,
          };
        })
    );
  };

  const getReturnInvuse = (datas: any) => {
    if (!datas || !Array.isArray(datas.invuse)) return 'not found';
    const found = datas.invuse.find(
      (inv: any) =>
        typeof inv.description === 'string' &&
        inv.description.toUpperCase().includes('RETURN'),
    );

    return found || 'not found';
  };

  // Usage example:
  // returnInvuse will be the invuse object or 'not found'

  useEffect(() => {
    if (!search) {
      setFilteredMatusetrans(woListmatusetrans);
    } else {
      const filtered = woListmatusetrans.filter((item: any) => {
        const itemnum = item.itemnum?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';
        return (
          itemnum.includes(search.toLowerCase()) ||
          description.includes(search.toLowerCase())
        );
      });
      setFilteredMatusetrans(filtered);
    }
  }, [search, woListmatusetrans]);

  useEffect(() => {
    //this will create invuse header for return and then get the list
    setLoading(true);
    createInvUseReturnHeader(woNum)
      .then(x => {
        scanWoForReturn(woNum).then((res: any) => {
          if (res.member.length === 0) {
            navigation.goBack();
            Alert.alert(
              'No Data',
              'No data found for this WO number.',
              // [{text: 'OK', onPress: () => navigation.goBack()}],
              // {cancelable: false},
            );
          }
          setDatas(res.member[0]);
          console.log('Work order details:', res);
          // setreturnn invuse id
          const returnInvuse = getReturnInvuse(res.member[0]);
          setReturnInvuseId(returnInvuse.invuseid);
          console.log('Return invuse:', returnInvuse);

          // Filter only items that have invuseline and it's not empty
          const filteredInvUse = res.member[0].invuse.filter(
            (item: any) =>
              Array.isArray(item.invuseline) && item.invuseline.length > 0,
          );
          setWoList(filteredInvUse);
          setWoListIssue(
            filteredInvUse.filter((item: any) => item.usetype === 'ISSUE'),
          );
          setWoListReturn(
            res.member[0].invuse.filter(
              (item: any) =>
                item.usetype === 'MIXED' && item.status === 'ENTERED',
            ),
          );

          //set header return
          const mixedInvuse = datas.invuse?.find(
            (inv: any) => inv.usetype === 'MIXED' && inv.status !== 'COMPLETE',
          );
          setHeaderReturn(mixedInvuse);
          console.log('Mixed Invuse:', mixedInvuse);

          // Enrich matusetrans with invuseid
          const enrichedMatusetrans = enrichMatusetransWithInvuseid(
            res.member[0].matusetrans,
            res.member[0].invuse,
          );

          setWoListmatusetrans(enrichedMatusetrans);
        });
      })
      .catch(err => {
        navigation.goBack();
        Alert.alert(
          'No Data',
          'No data found for this WO number.',
          // [{text: 'OK', onPress: () => navigation.goBack()}],
          // {cancelable: false},
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (returnInvuseId: string) => {
    // this is func to complete the return - moved to putaway module
    // changeInvUseStatusComplete(returnInvuseId)
    //   .then(res => {
    //     console.log('Change invuse status response:', res);
    //     Alert.alert('Success', 'Material return completed successfully');
    //   })
    //   .catch(err => {
    //     console.error('Error changing invuse status:', err);
    //     Alert.alert(
    //       'Error',
    //       err.Error.message || 'Failed to complete material return',
    //     );
    //   });
    // ToastAndroid.show('Return completed successfully', ToastAndroid.SHORT);
    // Alert.alert('Information', 'Go to Putaway to complete the return')
    Alert.alert(
      'Information',
      'Go to Putaway to complete the return',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Put Away Material', {item: datas}), // <-- Navigate on OK
          // onPress: () => console.log('Navigating to Putaway'),
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}: {item: string}) => {
    console.log('Rendering item:', item);

    const returnItem = findInvuselineByIdReturn(
      woListReturn,
      item.matusetransid,
    );

    const sideBarColor =
      item?.qtyrequested === (returnItem ? returnItem.quantity : 0)
        ? '#A4DD00'
        : 'gray';

    return (
      <TouchableOpacity
        disabled={item?.qtyrequested === (returnItem ? returnItem.quantity : 0)}
        onPress={() =>
          navigation.navigate('Detail Material', {
            item: item,
            invuseid: returnInvuseId,
          })
        }
        style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2 mr-4">
          <View className="flex-row justify-between">
            <Text className="font-bold">{item.itemnum}</Text>
            <Text className=""></Text>
          </View>

          <Text className="mr-2 font-bold">{item.description}</Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold"></Text>
            <Text className="w-1/2 text-right">Issue / Return</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3"></Text>
            <Text className="w-1/2 text-right">
              {item?.qtyrequested} {item.wms_unit} /{' '}
              {returnItem ? returnItem.quantity : 0} {item.wms_unit}
              {/* {item?.quantity} {item.wms_unit} / {item?.receivedqty}{' '}
              {item.wms_unit} */}
            </Text>
          </View>
          {/* <Text>{returnInvuseId}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate toScreen="Material Return Scan" />
      <View className="flex-row p-2 bg-blue-400">
        <View>
          <Text className="font-bold text-white">WO Number</Text>
          <Text className="font-bold text-white">WO Date</Text>
        </View>
        <View>
          <Text className="ml-10 font-bold text-white">{woNum}</Text>
          <Text className="ml-10 font-bold text-white">
            {formatDateTime(datas?.reportdate)}
          </Text>
        </View>
      </View>
      <View>
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
      </View>
      {loading ? (
        <ActivityIndicator className="mt-6" size="large" color="#3674B5" />
      ) : (
        <FlatList
          data={filteredMatusetrans}
          renderItem={renderItem}
          keyExtractor={(item, i) => i.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 32}}>
              <Text style={{color: '#888'}}>No data found</Text>
            </View>
          }
        />
      )}
      {
        <View style={styles.buttonContainer}>
          <ButtonApp
            label="RETURN"
            onPress={() => handleComplete(returnInvuseId)}
            size="large"
            color="primary"
          />
        </View>
      }
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

export default MaterialReturnDetailScreen;
