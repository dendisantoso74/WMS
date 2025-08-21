import React, {useState} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {completeTransferInstruction} from '../../services/myTransferInstruction';
import {putAway} from '../../services/materialRecive';
import ModalApp from '../../compnents/ModalApp';
import {set} from 'lodash';

const MyTransferInstructionSubmitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, invuseid, tobin} = route.params;
  console.log('INVUSEID:', invuseid);

  const [search, setSearch] = useState('');
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [modalCompleteVisible, setModalCompleteVisible] = useState(false);
  const [modalPutawayVisible, setModalPutawayVisible] = useState(false);
  const [idTemp, setIdTemp] = useState('');
  const [itemnum, setItemnum] = useState('');

  const handleComplete = () => {
    console.log('Complete pressed', item);
    completeTransferInstruction(invuseid).then(res => {
      if (res.error) {
        console.error('Error completing transfer instruction:', res.error);
        ToastAndroid.show(
          'Error completing transfer instruction',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Transfer instruction completed', ToastAndroid.SHORT);
        // navigation.goBack();
        navigation.navigate('My Transfer Instruction');
      }
    });
  };

  const handleConfirmPutaway = (invuselineid, itemnum) => {
    setModalPutawayVisible(true);
    setIdTemp(invuselineid);
    setItemnum(itemnum);
  };

  const handleModalSubmit = async invuselineid => {
    putAway(invuselineid, tobin)
      .then(res => {
        if (res.error) {
          console.error('Error in put away:', res.error);
          ToastAndroid.show('Error in put away', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Put away successful', ToastAndroid.SHORT);
          setCompletedIds(prev => [...prev, invuselineid]);
          // navigation.navigate('My Transfer Instruction Submit', {
          //   item: invuse,
          //   invuseid: datas.invuseid,
          //   tobin: inputValue,
          // });
        }
      })
      .catch(err => {
        console.error('Error in put away:', err);
        // ToastAndroid.show('Error in put away', ToastAndroid.SHORT);
        Alert.alert('Error', err.Error.message);
      });
  };

  const renderItem = ({item}) => {
    const isCompleted = completedIds.includes(item.invuselineid);
    return (
      <TouchableOpacity
        style={styles.rfidCard}
        onPress={
          // () => handleModalSubmit(item.invuselineid)
          () => handleConfirmPutaway(item.invuselineid, item.itemnum)
          // console.log('My Transfer Instruction Submit', item.invuselineid)
        }>
        <View
          style={[
            styles.sideBar,
            {backgroundColor: isCompleted ? '#A4DD00' : 'gray'},
          ]}
        />
        <View className="flex-row my-2 mr-3">
          <View className="flex-col justify-start mr-3">
            <Text className="text-sm">Serial Number: {item.serialnumber}</Text>
            <Text className="text-sm">
              {/* {item.invuselineid}  */}
              {item.itemnum}/ {item.description}
            </Text>
            <Text className="text-sm">
              TI Qty : {item.quantity} {item.wms_unit}
            </Text>
            <Text className="text-sm">
              Putaway Qty : {item.receivedqty} {item.wms_unit}
            </Text>
          </View>
          {/* <View className="">
            <View className="bg-red-500 border border-red-500 rounded-full">
              <Icon library="Feather" name="x" size={15} color="white"></Icon>
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View className="flex-col justify-start">
          <Text className="font-bold text-white">Bin</Text>
        </View>
        <View className="flex-col justify-start px-10">
          <Text className="font-bold text-white">{tobin}</Text>
        </View>
      </View>
      {/* <View className="px-2 py-2 bg-blue-200">
        <Text className="font-bold text-blue-600">
          Information : This is smartscan, please scan on material tag
        </Text>
      </View> */}
      <View style={styles.filterContainer}></View>
      <FlatList
        data={item}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          // onPress={() => handleComplete()}
          // onPress={handleComplete}
          onPress={() => setModalCompleteVisible(true)}
          label="Complete"
          size="large"
          color="primary"
        />
      </View>
      <ModalApp
        title="Confirmation"
        content="Are you sure you want to complete this Putaway?"
        onClose={() => setModalCompleteVisible(false)}
        type="confirmation"
        visible={modalCompleteVisible}
        onConfirm={() => handleComplete()}
      />

      <ModalApp
        title="Confirmation"
        content={`Are you sure you want to Putaway this item (${itemnum})?`}
        onClose={() => setModalPutawayVisible(false)}
        type="confirmation"
        visible={modalPutawayVisible}
        onConfirm={() => handleModalSubmit(idTemp)}
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

export default MyTransferInstructionSubmitScreen;
