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
import OptionsScreen from '../screens/OptionsScreen';
import ServerAddressScreen from '../screens/ServerAddressScreen';
import InspectionScreen from '../screens/Inspection';
import InspectionReceivingScreen from '../screens/Inspection/detail';
import InspectionReceivingApproveScreen from '../screens/Inspection/inspect';
import TagScreen from '../screens/Tag';
import TagDetailScreen from '../screens/Tag/detail';
import TagInspectScreen from '../screens/Tag/inspect';
import TransferInstructionScreen from '../screens/OpenTransferIntuction';
import TransferInstructionAssignScreen from '../screens/OpenTransferIntuction/detail';
import MyTransferInstructionScreen from '../screens/MyTransferInstruction';
import MyTransferInstructionScanScreen from '../screens/MyTransferInstruction/detail';
import MyTransferInstructionSubmitScreen from '../screens/MyTransferInstruction/inspect';
import PutawayScanWoScreen from '../screens/Putaway';
import PutawayMaterialScreen from '../screens/Putaway/detail';
import ScanMaterialPutawayScreen from '../screens/Putaway/inspect';
import MaterialIssueScanScreen from '../screens/MaterialIssue';
import MaterialIssueInspectScreen from '../screens/MaterialIssue/inspect';
import DetailMaterialScreen from '../screens/MaterialIssue/DetailMaterial';
import PickItemScreen from '../screens/MaterialIssue/PickItem';
import MaterialReturnScanScreen from '../screens/MaterialReturn';
import MaterialReturnDetailScreen from '../screens/MaterialReturn/detail';
import DetailMaterialReturnScreen from '../screens/MaterialReturn/inspect';
import StockOpnameListScreen from '../screens/StockOpname';
import DetailStockOpnameScreen from '../screens/StockOpname/detail';
import DetaliBinStockOpnameScreen from '../screens/StockOpname/inspect';
import DetailMaterialStockOpnameScreen from '../screens/StockOpname/detailmaterial';
import MaterialMovementScreen from '../screens/MaterialMovement';
import MaterialMovementScanScreen from '../screens/MaterialMovement/detail';
import MovementSmartScanScreen from '../screens/MaterialMovement/inspect';
import ScanBinScreen from '../screens/TagBin/scanBin';
import RegisterBinScreen from '../screens/TagBin/registerBin';
import BinDetailScreen from '../screens/RetagingItem/binDetail';
import ConnectRFIDReader from '../screens/ConnectRFIDReader';
import ScanPoInspect from '../screens/Inspection/scanPoInspect';

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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: '#2f5589'}, // <-- Set header background color
        headerTintColor: '#fff', // <-- Set header text/icon color
      }}>
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
            // options={{headerBackVisible: false}}
            options={({navigation}) => ({
              headerTitle: 'Warehouse Home', // Custom title
              // headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Options')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="settings"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
              // You can also add headerLeft if needed
              // headerLeft: () => (
              //   <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 16}}>
              //     <Icon library="Feather" name="arrow-left" size={24} color="#3674B5" />
              //   </TouchableOpacity>
              // ),
            })}
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
          <Stack.Screen name="TagBin Scan" component={ScanBinScreen} />
          <Stack.Screen
            name="Register RFID Bin"
            component={RegisterBinScreen}
          />

          {/* Retaging Item Menu */}
          <Stack.Screen name="RetagingItem" component={RetagingItemScreen} />
          <Stack.Screen
            name="Bin Detail"
            component={BinDetailScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />

          {/* Retaging Bin Menu */}
          <Stack.Screen
            name="RetagingBin"
            component={RetagingBinScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          {/* Material Receive Menu */}
          <Stack.Screen
            name="Material Receive"
            component={MaterialReceiveScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Material Receive Detail"
            component={MaterialReceiveDetailScreen}
          />

          {/* Tag Info Menu */}
          <Stack.Screen
            name="TagInfo"
            component={TagInfoScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              title: 'Tag Info',
            })}
          />
          <Stack.Screen
            name="Tag Info Detail"
            component={TagInfoDetailScreen}
          />
          {/* Open Transfer Instruction*/}
          <Stack.Screen
            name="Transfer Instruction"
            component={TransferInstructionScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Transfer Instruction Assign"
            component={TransferInstructionAssignScreen}
            options={{title: 'Transfer Instruction'}}
          />
          {/* My Transfer Instruction*/}
          <Stack.Screen
            name="My Transfer Instruction"
            component={MyTransferInstructionScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="My Transfer Instruction Scan"
            component={MyTransferInstructionScanScreen}
            options={{title: 'My Transfer Instruction'}}
          />

          <Stack.Screen
            name="My Transfer Instruction Submit"
            component={MyTransferInstructionSubmitScreen}
            options={{title: 'My Transfer Instruction'}}
          />

          {/*Putaway*/}
          <Stack.Screen
            name="Scan WO Number"
            component={PutawayScanWoScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              title: 'Put Away Material',
            })}
          />
          <Stack.Screen
            name="Put Away Material"
            component={PutawayMaterialScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Scan Material"
            component={ScanMaterialPutawayScreen}
          />

          {/* Material Issue Menu */}
          <Stack.Screen
            name="Material Issue Scan"
            component={MaterialIssueScanScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              title: 'Scan WO Number',
            })}
          />
          <Stack.Screen
            name="Material Issue Inspect"
            component={MaterialIssueInspectScreen}
            options={{title: 'Detail WO'}}
          />
          <Stack.Screen
            name="Detail Material Issue"
            component={DetailMaterialScreen}
            options={{title: 'Detail Material'}}
          />
          <Stack.Screen name="Pick Item" component={PickItemScreen} />

          {/* Material Return */}
          <Stack.Screen
            name="Material Return Scan"
            component={MaterialReturnScanScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              title: 'Scan WO Number',
            })}
          />
          <Stack.Screen
            name="Material Return Detail"
            component={MaterialReturnDetailScreen}
            options={{title: 'Detail WO'}}
          />
          <Stack.Screen
            name="Detail Material"
            component={DetailMaterialReturnScreen}
          />

          {/* Stock Opname */}
          <Stack.Screen
            name="Stock Opname List"
            component={StockOpnameListScreen}
            options={{title: 'Stock Opname'}}
          />
          <Stack.Screen
            name="Detail Stock Opname"
            component={DetailStockOpnameScreen}
          />
          <Stack.Screen
            name="Detail Bin Stock Opname"
            component={DetaliBinStockOpnameScreen}
            options={{title: 'Detail Bin'}}
          />
          <Stack.Screen
            name="Detail Material Stock Opname"
            component={DetailMaterialStockOpnameScreen}
            options={{title: 'Detail Material'}}
          />
          {/* Material Movement */}
          <Stack.Screen
            name="Material Movement"
            component={MaterialMovementScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Material Movement Scan"
            component={MaterialMovementScanScreen}
            options={{title: 'Material Movement'}}
          />
          <Stack.Screen
            name="Movement Smart Scan"
            component={MovementSmartScanScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />

          {/* inspection menu */}
          <Stack.Screen
            name="Inspection"
            component={InspectionScreen}
            // component={ScanPoInspect}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
              title: 'PO to Inspect',
            })}
          />
          <Stack.Screen
            name="InspectionReceivingPO"
            component={InspectionReceivingScreen}
            options={{title: 'Inspection Receiving PO'}}
          />
          <Stack.Screen
            name="InspectionReceivingPOApprove"
            component={InspectionReceivingApproveScreen}
            options={{title: 'Receiving PO'}}
          />

          {/* Tag Menu */}
          <Stack.Screen
            name="Po to Tag"
            component={TagScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="Po Detail"
            options={{title: 'Tagging Item'}}
            component={TagDetailScreen}
          />
          <Stack.Screen
            name="Item to Tag"
            component={TagInspectScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Reader Connect')}
                  style={{marginRight: 16}}>
                  <Icon
                    library="Feather"
                    name="bluetooth"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="List"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Options" component={OptionsScreen} />
          <Stack.Screen name="Reader Connect" component={ConnectRFIDReader} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ServerAddress"
            component={ServerAddressScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
            // initialParams={{setIsAuthenticated}}
          />
        </>
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
