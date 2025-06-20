/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListScreen from '../screens/ListScreen';
import ScanScreen from '../screens/ScanScreen';
import LoginScreen from '../screens/LoginScreen';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from '../compnents/Icon';
import {useAppContext} from '../context/AppContext';
import {isMobile} from '../utils/helpers';
import HomeWMSScreen from '../screens/HomeWMSScreen';
import ScanRFIDScreen from '../screens/ScanRFIDScreen';
import ChangeSiteScreen from '../screens/ChangeSiteScreen';
import RegisterRfidScreen from '../screens/registerRfid';
import AddRfidScreen from '../screens/registerRfid/register';
import TagBinScreen from '../screens/TagBin';
import RetagingItemScreen from '../screens/RetagingItem';
import RetagingBinScreen from '../screens/RetagingBin';
import TagInfoScreen from '../screens/TagInfo';
import TagInfoDetailScreen from '../screens/TagInfo/detail';
import MaterialReceiveDetailScreen from '../screens/MaterialReceive/detail';
import MaterialReceiveScreen from '../screens/MaterialReceive';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Tab Navigator (Visible only after login)
const BottomTabNavigator = (props: any) => {
  // const { logout } = useAuth();

  const handleLogPress = () => {
    props.navigation.navigate('ScanCamera');
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold', paddingBottom: 12},
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 72,
          paddingTop: 5,
        },
      })}>
      <Tab.Screen
        name="List View"
        component={ListScreen}
        options={({navigation}) => ({
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: isMobile() ? 18 : 20,
          },
          tabBarActiveTintColor: '#3674B5',
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon library="Feather" name="home" color={color} size={size} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{marginLeft: 20, marginRight: 32}}>
              <Icon
                library="Feather"
                name="arrow-left"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="scan"
        options={{
          tabBarButton: () => (
            <View style={styles.centerButtonWrapper}>
              <TouchableOpacity
                style={styles.centerButton}
                onPress={() => handleLogPress()}>
                <Icon
                  library="FontAwesome"
                  name="qrcode"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          ),
        }}>
        {() => null}
      </Stack.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarActiveTintColor: '#3674B5',
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon library="Feather" name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated} = useAppContext();

  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      {isAuthenticated ? (
        <>
          {/* <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerBackVisible: false}}
          /> */}
          <Stack.Screen
            name="HomeWMS"
            component={HomeWMSScreen}
            options={{headerBackVisible: false}}
          />
          <Stack.Screen
            name="ScanRFIDScreen"
            component={ScanRFIDScreen}
            options={{headerBackVisible: false}}
          />
          <Stack.Screen name="ScanCamera" component={ScanScreen} />
          <Stack.Screen name="ChangeSiteScreen" component={ChangeSiteScreen} />
          {/* Register RFID Menu */}
          <Stack.Screen name="RegisterRFID" component={RegisterRfidScreen} />
          <Stack.Screen name="AddRFID" component={AddRfidScreen} />
          {/* Tag Bin Menu */}
          <Stack.Screen name="TagBin" component={TagBinScreen} />
          {/* Retaging Item Menu */}
          <Stack.Screen name="RetagingItem" component={RetagingItemScreen} />
          {/* Retaging Bin Menu */}
          <Stack.Screen name="RetagingBin" component={RetagingBinScreen} />
          {/* Material Receive Menu */}
          <Stack.Screen
            name="Material Receive"
            component={MaterialReceiveScreen}
          />
          <Stack.Screen
            name="Material Receive Detail"
            component={MaterialReceiveDetailScreen}
          />

          {/* Tag Info Menu */}
          <Stack.Screen name="TagInfo" component={TagInfoScreen} />
          <Stack.Screen
            name="Tag Info Detail"
            component={TagInfoDetailScreen}
          />

          <Stack.Screen
            name="List"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
          // initialParams={{setIsAuthenticated}}
        />
        // <BottomTabNavigator/>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  centerButtonWrapper: {
    // position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerButton: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#3674B5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#777',
  },
  activeText: {
    color: '#5D5FEF',
  },
  textTitle: {
    fontSize: isMobile() ? 2 : 18,
  },
});

export default AppNavigator;
