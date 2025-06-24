import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../compnents/Icon';
import ButtonApp from '../compnents/ButtonApp';
import {storeData} from '../utils/store';
import {useNavigation} from '@react-navigation/native';

const ServerAddressScreen = () => {
  const navigation = useNavigation<any>();

  const [address, setAddress] = useState('http://192.168.77.43:9080');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('apiUrl');
        if (savedAddress) {
          setAddress(savedAddress);
        }
      } catch (e) {
        console.error('Failed to load address from storage', e);
      }
    };
    fetchAddress();
  }, []);

  const handleNext = async () => {
    if (!address || !address.startsWith('http')) {
      setError('Please enter a valid address');
      return;
    }
    await storeData('apiUrl', address);
    setError('');
    // Navigate to next screen or show success
    // if (navigation) navigation.goBack();
    // if (navigation) {
    navigation.navigate('Login'); // Adjust this to your next screen
    // }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.bgWrap}>
        {/* <Image
          source={require('../assets/images/rfid.png')}
          style={styles.bgImg}
          resizeMode="cover"
        /> */}
      </View>
      <View style={styles.container}>
        {/* <Image
          source={require('../assets/images/qrcode.png')}
          style={styles.logo}
        /> */}
        <View style={styles.card}>
          <Text style={styles.title}>Server Address</Text>
          <View style={styles.inputWrap}>
            {/* <Image
              source={require('../assets/images/ip-icon.png')}
              style={styles.icon}
            /> */}
            <Icon
              name="wifi"
              style={styles.icon}
              size={24}
              color="#000"
              library="FontAwesome"
            />
            <View style={{flex: 1}}>
              <Text style={styles.label}>Service Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="http://192.168.77.43:9080"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <ButtonApp
            color="primary"
            label="Next"
            size="large"
            onPress={() => handleNext()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bgImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 24,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '92%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: '100%',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
    tintColor: '#2f5589',
  },
  label: {
    color: '#b0b0b0',
    // fontSize: 12,
    // marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: '#222',
    paddingVertical: 2,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3674B5',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ServerAddressScreen;
