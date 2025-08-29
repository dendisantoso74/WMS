import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
} from 'react-native';
import rfid from '../../assets/images/rfid.png'; // Adjust the path as necessary

interface ModalInputRfidProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title?: string;
  placeholder?: string;
  suggestBin?: string;
  serialNumber?: string;
  mode?: 'bin' | 'item';
  bin?: string;
}

const ModalInputRfid: React.FC<ModalInputRfidProps> = ({
  visible,
  value,
  onChangeText,
  onSubmit,
  onCancel,
  title = 'Enter Value',
  placeholder = 'Type here...',
  suggestBin = '',
  serialNumber = '',
  mode = 'item',
  bin = '',
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
          {title}
        </Text>
        <View className="flex-row justify-center py-3 align-items-center">
          <Image
            source={rfid}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
        {bin ? (
          <Text style={{color: '#6c757d', marginTop: 8}}>
            Bin:{'\n'}
            {bin}
          </Text>
        ) : null}
        {serialNumber ? (
          <Text style={{color: '#6c757d', marginTop: 8}}>
            Serial Number:{'\n'}
            {serialNumber}
          </Text>
        ) : null}
        {suggestBin ? (
          <Text style={{color: '#6c757d', marginTop: 8}}>
            Suggested Bin:{'\n'}
            {suggestBin}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 16,
          }}>
          <Button title="Cancel" onPress={onCancel} />
          <View style={{width: 12}} />
          <Button title="Submit" onPress={onSubmit} />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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

export default ModalInputRfid;
