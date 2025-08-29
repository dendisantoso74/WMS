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
  ActivityIndicator,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {formatDateTime, generateSerialNumber} from '../../utils/helpers';
import ModalInputRfid from '../../compnents/wms/ModalInputRfid';
import {debounce, set} from 'lodash';
import {
  completePutaway,
  fetchPutawayMixed,
  fetchPutawayMixedSingle,
  findSuggestedBinPutaway,
  tagItemPutaway,
} from '../../services/putaway';
import {checkSerialNumber} from '../../services/materialRecive';
import {changeInvUseStatusComplete} from '../../services/materialReturn';
import {findBinByTagCode} from '../../services/materialIssue';
import {
  ZebraEvent,
  ZebraEventEmitter,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {Alert} from 'react-native';

const PutawayMaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item} = route.params;
  console.log('item from params put away:', item);

  const [search, setSearch] = useState('');
  const [invUse, setInvUse] = useState([]);
  const [modalBinVisible, setModalBinVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);

  const [modalValueBin, setModalValueBin] = useState('');
  const [modalValueItem, setModalValueItem] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [suggestedBin, setSuggestedBin] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [filteredInvUse, setFilteredInvUse] = useState([]);
  // REPLACED previous const allInvUseTagged = ... with state + setter + getter
  const [allInvUseTagged, setAllInvUseTagged] = useState(false);
  const [binScan, setBinScan] = useState('');

  useEffect(() => {
    const allTagged =
      invUse &&
      Array.isArray(invUse.invuseline) &&
      invUse.invuseline.length > 0 &&
      invUse.invuseline.every((line: any) => !!line?.serialnumber);

    console.log('cek status', allTagged);

    setAllInvUseTagged(allTagged);
  }, [invUse]);

  // rfid scanner
  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      console.log('RFID Data:', newData);
      // if newdata is array make popup to select item for set to search

      if (modalValueItem) {
        setModalValueBin(newData[0]);
      }

      setModalValueItem(newData[0]);
    }, 200),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );

      // Clean up listeners when screen is unfocused
      return () => {
        rfidEvent.remove();
      };
    }, []),
  );

  const getdataPutawayMixed = async () => {
    setLoading(true);
    fetchPutawayMixedSingle(item.wonum).then(res => {
      console.log('tes fetch singgle WO', res);
      //set invuse that have status retur entered
      const filteredInvUse = res.member[0].invuse.filter(
        (inv: any) => inv.status === 'ENTERED' && inv.usetype === 'MIXED',
      );

      console.log('tes fetch singgle WO Filtered', filteredInvUse);

      setInvUse(filteredInvUse[0]);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!search) {
      setFilteredInvUse(invUse);
    } else if (invUse && Array.isArray(invUse.invuseline)) {
      const filteredLines = invUse.invuseline.filter((line: any) => {
        const itemnum = line?.itemnum?.toLowerCase() || '';
        const description = line?.description?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        return (
          itemnum.includes(searchLower) || description.includes(searchLower)
        );
      });
      setFilteredInvUse({
        ...invUse,
        invuseline: filteredLines,
      });
    } else {
      setFilteredInvUse(invUse);
    }
  }, [search, invUse]);

  useEffect(() => {
    getdataPutawayMixed();
  }, [item.invuse]);

  const handlePressItem = async (item: any) => {
    setModalBinVisible(true);

    const SN = await generateSerialNumber();
    setSerialNumber(SN);

    const bin = await findSuggestedBinPutaway(
      item.invuseline[item.invuseline.length - 1]?.itemnum,
      item.fromstoreloc,
    );
    setSuggestedBin(bin.member[0]?.binnum || '');
    console.log('Selected InvUse:', bin.member[0].binnum);
  };

  const handleSubmitBin = async () => {
    if (!modalValueBin) {
      ToastAndroid.show('Please enter a BIN', ToastAndroid.SHORT);
      return;
    }

    const checkSN = await checkSerialNumber(serialNumber);
    if (checkSN.error) {
      ToastAndroid.show(checkSN.error, ToastAndroid.SHORT);
      return;
    }
    console.log('selectedItem:', selectedItem);

    const bin = await findBinByTagCode(modalValueBin);
    setBinScan(bin?.member[0]?.bin || 'Undefined');

    console.log('Selected Bin:', bin?.member[0]?.bin);

    const payload = {
      // tag item
      invuselineid: selectedItem.invuselineid,
      tagcode: modalValueItem,
      serialnumber: serialNumber,
      // tess hardcode serial number for testing
      // serialnumber: '3070B0BFD595D3001446F4F7',

      // tag bin
      frombin: selectedItem.frombin,
      wms_finalbin: bin?.member[0]?.bin,
      wms_status: 'COMPLETE',
    };

    console.log('Payload to submit:', payload);

    await tagItemPutaway(
      payload.invuselineid,
      payload.tagcode,
      payload.serialnumber,
    )
      .then(res => {
        console.log('Tagging Response:', res);
        ToastAndroid.show('Item tagged successfully', ToastAndroid.SHORT);
        setModalValueBin('');
        setModalValueItem('');
        setBinScan('');
        setSuggestedBin('');
        // navigation.goBack();
      })
      .catch(err => {
        console.error('Error tagging item:', err);
        ToastAndroid.show('Failed tagging item', ToastAndroid.SHORT);
      });

    await completePutaway(
      payload.invuselineid,
      payload.frombin,
      payload.wms_finalbin,
    );

    getdataPutawayMixed();

    setModalBinVisible(false);
  };

  const handleCompletereturn = async () => {
    console.log('Complete button pressed', invUse.invuseid);
    console.log('status all assign to bin', allInvUseTagged);

    if (allInvUseTagged) {
      changeInvUseStatusComplete(invUse.invuseid)
        .then(res => {
          console.log('Complete return response:', res);
          ToastAndroid.show(
            'Return completed successfully',
            ToastAndroid.SHORT,
          );
          // getdataPutawayMixed();
          // navigation.goBack();
          // reload the list
          navigation.navigate('Scan WO Number');
        })
        .catch(err => {
          console.error('Error completing return:', err);
          ToastAndroid.show('Error completing return', ToastAndroid.SHORT);
        });
    } else {
      Alert.alert(
        'Warning',
        'Please assign all items to a bin before completing the return.',
      );
    }
  };

  const debouncedCompleteReturn = useCallback(
    debounce(
      () => {
        handleCompletereturn();
      },
      1000, // 1 second
      {leading: true, trailing: false},
    ),
    [handleCompletereturn],
  );

  const renderItem = ({item}: {item: string}) => {
    console.log('Render item xxx:', item);
    const invuseline = item;
    const sideBarColor = invuseline?.serialnumber ? '#A4DD00' : 'blue';

    return (
      <TouchableOpacity
        disabled={!!invuseline?.serialnumber}
        style={styles.rfidCard}
        onPress={() => {
          setModalItemVisible(true);
          setSelectedItem(item);
        }}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="flex-col w-10/12 my-1">
          <View className="flex-row justify-between">
            <Text className="font-bold">
              {invuseline ? invuseline.itemnum : '-'}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-bold">
              {invuseline ? invuseline.description : '-'}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-bold text-left ">
              {invuseline ? invuseline.frombin : '-'}
            </Text>
            <Text className="text-right ">Return</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-bold text-left ">
              {invuseline ? invuseline.fromconditioncode : '-'}
            </Text>
            <Text className="text-right ">
              {invuseline ? invuseline.quantity : '-'}{' '}
              {invuseline ? invuseline.wms_unit : '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View>
          <Text className="font-bold text-white">WO Number</Text>
          <Text className="font-bold text-white">WO Date</Text>
        </View>
        <View>
          <Text className="ml-10 font-bold text-white">{item.wonum}</Text>
          <Text className="ml-10 font-bold text-white">
            {formatDateTime(item.statusdate)}
          </Text>
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
          style={{position: 'absolute', right: 20, top: 12}}
        />
      </View>
      {loading ? (
        <ActivityIndicator className="mt-6" size="large" color="#3674B5" />
      ) : (
        <FlatList
          data={filteredInvUse?.invuseline}
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
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="COMPLETE"
          size="large"
          color="primary"
          onPress={debouncedCompleteReturn}
        />
      </View>

      <ModalInputRfid
        visible={modalItemVisible}
        value={modalValueItem}
        onChangeText={setModalValueItem}
        title="Scan Item Tag"
        placeholder="Scan or enter Item Tag"
        onSubmit={() => {
          if (!modalValueItem) {
            ToastAndroid.show('Please enter an Item Tag', ToastAndroid.SHORT);
            return;
          }
          setModalItemVisible(false);
          handlePressItem(selectedItem);
        }}
        onCancel={() => setModalItemVisible(false)}
        // suggestBin={suggestedBin} // Example suggested bin
      />

      <ModalInputRfid
        mode="bin"
        visible={modalBinVisible}
        value={modalValueBin}
        onChangeText={setModalValueBin}
        title="Scan BIN destination"
        onSubmit={() => {
          handleSubmitBin();
        }}
        onCancel={() => setModalBinVisible(false)}
        serialNumber={serialNumber}
        placeholder="Scan or enter BIN Tag"
        suggestBin={suggestedBin} // Example suggested bin
        // bin={binScan}
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

export default PutawayMaterialScreen;
