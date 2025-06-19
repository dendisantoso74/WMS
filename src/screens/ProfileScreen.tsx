import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import ButtonApp from '../compnents/ButtonApp';
import ModalApp from '../compnents/ModalApp';
import {
  getCurrentShift,
  getTeamLabelById,
  isMobile,
  isTablet,
} from '../utils/helpers';
import {useAppContext} from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearAllData, clearDataByKeys, clearDataLogout} from '../utils/store';
import {ShiftTypes} from '../utils/types';
import Config from 'react-native-config';
// import Geolocation from '@react-native-community/geolocation';
import {
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
// import {useCurrentLocation} from '../utils/useCurrentLocation';

const ProfileScreen = () => {
  const {setIsAuthenticated} = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentDate = new Date();
  const [shift, setShift] = useState<ShiftTypes>(getCurrentShift(currentDate));
  const [team, setTeam] = useState<string | null>();
  const [load, setLoad] = useState<string | null>();
  const [user, setUser] = useState<any>();
  // const {location, error, loading, refresh} = useCurrentLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamAsync = await AsyncStorage.getItem('team');
        const loadAsync = await AsyncStorage.getItem('statusLoad');
        const shiftAsync = await AsyncStorage.getItem('shift');
        const resUser = await AsyncStorage.getItem('user');
        setUser(JSON.parse(resUser));

        setTeam(teamAsync);
        setLoad(loadAsync);
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = async () => {
    const shiftQR = await AsyncStorage.getItem('shift');
    const curentShift = getCurrentShift();

    if (shiftQR !== getCurrentShift()) {
      Alert.alert('Shift Timeout', 'Please upload and submit your checksheet!');
    } else {
      setIsModalVisible(true);
    }
  };

  const confirmLogout = () => {
    setIsModalVisible(false);
    // removeData();
    clearDataLogout();
    Alert.alert('Logout', 'You have been logged out.');

    // Handle additional logout logic here
    setIsAuthenticated(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Full Name</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{user?.fullname}</Text>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Username</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{user?.username}</Text>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Department</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{user?.department}</Text>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Position</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{user?.position}</Text>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Team</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {getTeamLabelById(team)} / {load === '1' ? 'Onload' : 'Offload'}
          </Text>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Shift</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{shift}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonApp
          color="danger"
          label="Logout"
          size="large"
          onPress={handleLogout}
        />
      </View>
      <Text>Version {Config.VERSION}</Text>
      <View style={styles.buttonContainer} />

      {/* <View>
        <Button title="Refresh Location" onPress={refresh} />

        {loading && <ActivityIndicator size="large" />}

        {location && !loading && (
          <Text>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        )}

        {error && <Text style={{color: 'red'}}>Error: {error}</Text>}
      </View> */}
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
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 100,
    boxShadow: '1px 1px 2px 1px rgba(0, 0, 0, 0.1)',
    width: '90%',
  },
  label: {
    fontSize: isMobile() ? 12 : 18,
    flexShrink: 1,
    fontWeight: 'bold',
    // marginRight: 20,
    color: '#495057',
  },
  value: {
    fontSize: isMobile() ? 14 : 18,
    color: '#495057',
  },
  buttonContainer: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderStartEndRadius: 10,
    borderStartStartRadius: 10,
    shadowColor: '#000',
    width: isMobile() ? '30%' : '25%',
  },
  valueContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderEndStartRadius: 10,
    borderEndEndRadius: 10,
    shadowColor: '#000',
    width: '70%',
  },
});

export default ProfileScreen;
