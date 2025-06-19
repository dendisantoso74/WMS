import React, {useState} from 'react';
import {Modal, View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import ButtonApp from './ButtonApp';

interface ModalAppProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type: 'confirmation' | 'alert';
  size?: 'small' | 'medium' | 'large'; // Add size prop
  onConfirm?: () => void; // Add onConfirm prop
}

const ModalApp: React.FC<ModalAppProps> = ({
  visible,
  onClose,
  title,
  content,
  type,
  size = 'medium', // Default size is medium
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); // State to disable the button

  const handleOk = () => {
    setButtonDisabled(true); // Disable the button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setButtonDisabled(false); // Re-enable the button when modal closes
      onClose();
    }, 10000); // Simulate a 2-second loading process
  };

  const handleCancel = () => {
    setButtonDisabled(true); // Disable the button
    onClose();
    setButtonDisabled(false); // Re-enable the button when modal closes
  };

  const handleYes = () => {
    setButtonDisabled(true); // Disable the button
    if (onConfirm) {
      onConfirm(); // Execute the function passed from the parent
    }
    setTimeout(() => {
      setButtonDisabled(false); // Re-enable the button when modal closes
      onClose();
    }, 10000); // Simulate a 2-second loading process
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
              <Text style={styles.modalContent}>{content}</Text>
              <View
                style={[
                  styles.buttonContainer,
                  type === 'confirmation' && styles.buttonContainerConfirmation,
                ]}>
                {type === 'confirmation' && (
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
                )}
                {type === 'alert' && (
                  <ButtonApp
                    label="OK"
                    color="secondary"
                    onPress={handleOk}
                    style={styles.button}
                    disabled={buttonDisabled} // Disable the button
                  />
                )}
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

export default ModalApp;
