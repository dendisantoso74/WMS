import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ButtonApp from '../compnents/ButtonApp';
import ModalApp from '../compnents/ModalApp';
import {clearAllData, getData} from '../utils/store';
import {useAppContext} from '../context/AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';

const OptionsScreen = () => {
  const {setIsAuthenticated} = useAppContext();
  const navigation = useNavigation<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patternEnabled, setPatternEnabled] = useState(false);

  const [user, setUser] = useState<string | null>(null);
  const [site, setSite] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userAsync = await getData('user');
      setUser(userAsync);
      const siteAsync = await getData('site');
      setSite(siteAsync);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const confirmLogout = () => {
    setIsModalVisible(false);
    clearAllData();
    setIsAuthenticated(false);
  };

  // Dummy handlers for menu actions
  const handleChangeSite = () => {
    //navigate to ChangeSiteScreen
    navigation.navigate('ChangeSiteScreen');
  };
  const handleChangeLanguage = () => {};
  const handleViewLogs = () => {};
  const handleClearCache = () => {};
  const handleAbout = () => {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Password Pattern Section */}
      {/* <Text style={styles.sectionTitle}>Password Pattern</Text>
      <TouchableOpacity style={styles.menuRow} onPress={() => {}}>
        <Text style={styles.menuText}>Change Password Pattern</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>
      <View style={styles.menuRow}>
        <Text style={styles.menuText}>Enable Password Pattern</Text>
        <Switch value={patternEnabled} onValueChange={setPatternEnabled} />
      </View> */}

      {/* Change Site */}
      <Text style={styles.sectionTitle}>User</Text>
      <TouchableOpacity style={styles.menuRow} onPress={() => {}}>
        <Text style={styles.menuText}>{user}</Text>
        {/* <Icon name="chevron-right" size={24} color="#888" /> */}
      </TouchableOpacity>

      {/* Change Site */}
      <Text style={styles.sectionTitle}>Change Site</Text>
      <TouchableOpacity style={styles.menuRow} onPress={handleChangeSite}>
        <Text style={styles.menuText}>{site}</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity>

      {/* Language */}
      {/* <Text style={styles.sectionTitle}>Language</Text>
      <TouchableOpacity style={styles.menuRow} onPress={handleChangeLanguage}>
        <Text style={styles.menuText}>English</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity> */}

      {/* Logs */}
      {/* <Text style={styles.sectionTitle}>Logs</Text>
      <TouchableOpacity style={styles.menuRow} onPress={handleViewLogs}>
        <Text style={styles.menuText}>View Logs</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity> */}

      {/* Cache */}
      {/* <Text style={styles.sectionTitle}>Cache</Text>
      <TouchableOpacity style={styles.menuRow} onPress={handleClearCache}>
        <Text style={styles.menuText}>Clear Cache</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity> */}

      {/* About */}
      {/* <Text style={styles.sectionTitle}>About</Text>
      <TouchableOpacity style={styles.menuRow} onPress={handleAbout}>
        <Text style={styles.menuText}>About This</Text>
        <Icon name="chevron-right" size={24} color="#888" />
      </TouchableOpacity> */}

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <ButtonApp
          color="danger"
          label="Logout"
          size="large"
          onPress={handleLogout}
        />
      </View>
      <Text className="text-center">Version {Config.VERSION}</Text>
      {/* <View style={styles.buttonContainer}>
        <ButtonApp
          color="primary"
          label="Chgane address"
          size="large"
          onPress={() => navigation.navigate('ServerAddress')}
        />
      </View> */}

      <ModalApp
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={confirmLogout}
        title="Logout"
        content="Are you sure you want to logout?"
        type="confirmation"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#888',
    marginTop: 18,
    marginBottom: 4,
    fontSize: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 8,
    // borderBottomWidth: 0.5,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingRight: 4,
  },
  menuText: {
    fontSize: 16,
    color: '#222',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  },
});

export default OptionsScreen;
