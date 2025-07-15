import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ButtonApp from '../compnents/ButtonApp';
import {useAppContext} from '../context/AppContext';
import {authService} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearAllData, storeData} from '../utils/store';
import {getCurrentShift, isExpired, isTablet} from '../utils/helpers';
import {decode} from 'react-native-pure-jwt';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
const LoginScreen = () => {
  // const {setIsAuthenticated} = route.params;
  const {setUser, setIsAuthenticated} = useAppContext();

  const [username, setUsername] = useState(Config.USERNAME);
  const [password, setPassword] = useState(Config.PASSWORD);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('user');

  //       if (value !== null) {
  //         // chec expired token
  //         if (isExpired(JSON.parse(value).exp)) {
  //           clearAllData();
  //           setIsAuthenticated(false);
  //         } else {
  //           setIsAuthenticated(true);
  //           setUser(value);
  //         }
  //       }
  //     } catch (e) {
  //       // error reading value
  //       console.error(e);
  //     }
  //   };
  //   getData();
  // }, [setIsAuthenticated, setUser]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        // error reading value
        console.error(e);
      }
    };
    getData();
  }, [setIsAuthenticated, setUser]);

  const handleLogin = () => {
    // setUser(username);
    setLoading(true);

    if (username && password) {
      setLoading(true);
      // Alert.alert('Login Successful');
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      console.log('formData', btoa(`${username}:${password}`));

      authService
        .login(username, password)
        .then(res => {
          // storeData('userToken', res.access_token);
          // decode(res.access_token, '', {
          //   skipValidation: true,
          // })
          //   .then(decodeRes => {
          //     storeData('user', JSON.stringify(decodeRes.payload));
          //     setUser(JSON.stringify(decodeRes.payload));
          //   }) // already an object. read below, exp key note
          //   .catch(err => console.log('error', err));
          console.log('berhasil login', res);
          storeData('user', username);
          storeData('MAXuser', res.member[0]?.maxuser[0]?.userid);

          storeData('site', 'TJB56');
          storeData('org', 'BJS');

          setIsAuthenticated(true);
        })
        .catch(err => {
          setIsAuthenticated(false);

          Alert.alert('Failed', err?.detail || err);
          console.log('error login', err);

          setLoading(false);
        });
    } else {
      Alert.alert('Error', 'Please fill in all fields');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Login"
          onPress={() => handleLogin()}
          disabled={loading}
          isloading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isTablet() ? 40 : 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: isTablet() ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: isTablet() ? 40 : 20,
  },
  input: {
    width: '80%',
    padding: isTablet() ? 15 : 10,
    marginBottom: isTablet() ? 20 : 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: isTablet() ? 18 : 14,
  },
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet() ? 20 : 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: isTablet() ? 15 : 10,
    fontSize: isTablet() ? 18 : 14,
  },
  iconContainer: {
    padding: 10,
  },
  buttonContainer: {
    width: '80%',
    marginTop: isTablet() ? 20 : 10,
  },
  buttonContainerUpdate: {
    position: 'absolute',
    top: isTablet() ? 40 : 20,
    right: isTablet() ? 40 : 20,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
