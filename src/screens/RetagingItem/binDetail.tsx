import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ModalApp from '../../compnents/ModalApp';
import ModalInput from '../../compnents/ModalInput';
import {retagSerializedItem} from '../../services/retagingItem';

const BinDetailScreen = () => {
  const route = useRoute();
  const {item} = route.params as {item: any};

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    console.log('Bin details:', item);
  }, [item]);

  const handleRetag = () => {
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    console.log('Input value:', inputValue);
    await retagSerializedItem(
      item.wms_serializeditem[0].wms_serializeditemid,
      inputValue,
    ).then(res => {
      console.log('Retagging response:', res);
      if (res.error) {
        console.error('Error retagging item:', res.error);
      } else {
        Alert.alert('Success', 'Item retagged successfully!');
        console.log('Item retagged successfully:', res);
        setModalVisible(false);
        setInputValue('');
      }
    });
  };

  const renderItem = item => {
    // Set sidebar color: green if fully received, otherwise gray
    const sideBarColor = 'blue';
    console.log('Item details:', item);

    return (
      <TouchableOpacity onPress={() => handleRetag()} style={styles.rfidCard}>
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
        data={item.wms_serializeditem}
        keyExtractor={si => si.wms_serializeditemid?.toString()}
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
              Enter Value
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <View style={{width: 12}} />
              <Button title="Submit" onPress={handleModalSubmit} />
            </View>
          </View>
        </View>
      </Modal>
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
