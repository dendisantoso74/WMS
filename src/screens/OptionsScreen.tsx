import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ButtonApp from '../compnents/ButtonApp';
import ModalApp from '../compnents/ModalApp';
import {clearAllData, clearDataLogout} from '../utils/store';
import {useAppContext} from '../context/AppContext';

const OptionsScreen = () => {
  const {setIsAuthenticated} = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const confirmLogout = () => {
    setIsModalVisible(false);
    clearAllData();
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Page Action</Text> */}
      <View style={styles.buttonContainer}>
        <ButtonApp
          color="danger"
          label="Logout"
          size="large"
          onPress={handleLogout}
        />
      </View>
      <ModalApp
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmLogout}
        title="Logout"
        content="Are you sure you want to logout?"
        type="confirmation"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#495057',
  },
  buttonContainer: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default OptionsScreen;
