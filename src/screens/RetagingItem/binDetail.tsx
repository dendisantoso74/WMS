import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import ModalApp from '../../compnents/ModalApp';
import ModalInput from '../../compnents/ModalInput';
import {
  fetchRetaggingItems,
  retagSerializedItem,
} from '../../services/retagingItem';
import rfid from '../../assets/images/rfid.png'; // Adjust the path as necessary
import {
  ZebraEvent,
  ZebraEventEmitter,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {debounce, set} from 'lodash';
import ButtonApp from '../../compnents/ButtonApp';

const BinDetailScreen = () => {
  const route = useRoute();
  const {item} = route.params as {item: any};

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [tag, setTag] = useState<string>('');
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // rfid scanner
  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      console.log('RFID Data:', newData);
      // if newdata is array make popup to select item for set to search

      setTag(newData[0]);
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

  const fetchDatas = async () => {
    console.log('Bin detailsxxx:', item);

    fetchRetaggingItems(item.bin).then(res => {
      console.log('Bin details:', res);
      setItemDetails(res.member[0].wms_serializeditem);
    });
  };

  useEffect(() => {
    fetchDatas();
  }, [item.wms_bin]);

  const handleRetag = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    console.log('Input value:', selectedItem);
    await retagSerializedItem(
      selectedItem.item.wms_serializeditemid,
      tag || inputValue,
    )
      .then(res => {
        console.log('Retagging response:', res);
        if (res.error) {
          console.error('Error retagging item:', res.error);
        } else {
          Alert.alert('Success', 'Item retagged successfully!');
          console.log('Item retagged successfully:', res);
          fetchDatas(); // Refresh the data after retagging
          setModalVisible(false);
          setInputValue('');
        }
      })
      .catch(error => {
        console.error('Error in retagging:', error);
        ToastAndroid.show(error.Error.message, ToastAndroid.SHORT);
        // Alert.alert('Error', 'Failed to retag item. Please try again.');
      });
  };

  const renderItem = item => {
    // Set sidebar color: green if fully received, otherwise gray
    const sideBarColor = 'blue';

    return (
      <TouchableOpacity
        onPress={() => handleRetag(item)}
        style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">{item.item.itemnum}</Text>

            <Text className="w-1/2 text-right">
              Qty: {item.item.qtystored} {item.item.unitserialized}
            </Text>
          </View>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            {item.item.description}
          </Text>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            Tag Code: {item.item.tagcode}
          </Text>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            Serial: {item.item.serialnumber}
          </Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold">
              {item.item.conditioncode}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Bin: {item.bin}</Text>
      </View>
      {/* <Text style={styles.sectionTitle}>Serialized Items</Text> */}
      <FlatList
        data={itemDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Please scan new RFID tag
            </Text>
            <View className="flex-row justify-center py-3 align-items-center">
              <Image
                source={rfid}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tag"
              value={inputValue || tag}
              onChangeText={setInputValue}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              {/* <Button title="Cancel" onPress={() => setModalVisible(false)} /> */}
              {/* <View style={{width: 12}} /> */}
              {inputValue ||
                (tag && (
                  // <Button
                  //   title="Submit"
                  //   onPress={() => setModalConfirmVisible(true)}
                  // />
                  <ButtonApp
                    label="SUBMIT"
                    color="primary"
                    onPress={() => setModalConfirmVisible(true)}
                  />
                ))}
            </View>
          </View>
        </View>
      </Modal>
      {/* confirmation modal */}
      <ModalApp
        content="Are you sure you want to retag this item?"
        onClose={() => setModalConfirmVisible(false)}
        title="Confirmation"
        type="confirmation"
        visible={modalConfirmVisible}
        onConfirm={() => handleModalSubmit()}
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
    backgroundColor: '#285a8d',
    padding: 8,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    // fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#222',
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  serialItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    padding: 16,
  },
  serialTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976D2',
  },
  serialDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  serialInfo: {
    fontSize: 13,
    color: '#555',
  },
  maxWidthFullMinus8: {
    maxWidth: 300,
    // marginRight: 8,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
});
export default BinDetailScreen;
