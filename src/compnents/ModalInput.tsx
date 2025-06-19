import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import ButtonApp from './ButtonApp';
import InputApp from './InputApp';

interface ModalInputProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  size?: 'small' | 'medium' | 'large'; // Add size prop
  onConfirm?: () => void; // Add onConfirm prop
  onChange?: (value: string) => void; // Add onChange prop
  value?: string; // Add value prop
}

const ModalInput: React.FC<ModalInputProps> = ({
  visible,
  onClose,
  title,
  size = 'medium', // Default size is medium
  onConfirm,
  onChange,
  value,
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); // State to disable the button

  const handleCancel = () => {
    setButtonDisabled(true); // Disable the button
    onClose();
    setButtonDisabled(false); // Re-enable the button when modal closes
  };

  const handleYes = () => {
    if (!value || value.trim() === '') {
      // Validation: Check if the text area is empty
      Alert.alert('Alert', 'Global replacement cannot be empty.');
      return;
    }

    setButtonDisabled(true); // Disable the button
    if (onConfirm) {
      onConfirm(); // Execute the function passed from the parent
    }
    setTimeout(() => {
      setButtonDisabled(false); // Re-enable the button when modal closes
    }, 1000); // Simulate a 1-second loading process
  };

  // Determine modal size based on the size prop
  const getModalSize = () => {
    switch (size) {
      case 'small':
        return {width: 200, padding: 15};
      case 'large':
        return {width: 400, padding: 25};
      case 'medium':
      default:
        return {width: 300, padding: 20};
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, getModalSize()]}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>{title}</Text>
              <InputApp
                type="textarea"
                onChange={onChange} // Pass the onChange prop
                value={value} // Pass the value prop
              />
              <View
                style={[
                  styles.buttonContainer,
                  styles.buttonContainerConfirmation,
                ]}>
                <>
                  <ButtonApp
                    label="No"
                    color="danger"
                    onPress={handleCancel}
                    style={styles.button}
                    disabled={buttonDisabled} // Disable the button
                  />
                  <ButtonApp
                    label={loading ? 'Loading...' : 'Yes'} // Show "Loading..." when disabled
                    onPress={handleYes}
                    style={styles.button}
                    disabled={buttonDisabled} // Disable the button
                  />
                </>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3D3D3D',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContainerConfirmation: {
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 10,
  },
});

export default ModalInput;
