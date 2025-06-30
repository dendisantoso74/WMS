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
import DetailWoScreen from '../screens/MaterialIssue/DetailWo';
import MaterialReturnScanScreen from '../screens/MaterialReturn';
import MaterialReturnDetailScreen from '../screens/MaterialReturn/detail';
import DetailMaterialReturnScreen from '../screens/MaterialReturn/inspect';
import DetailWoMaterialReturnScreen from '../screens/MaterialReturn/detailwo';
import StockOpnameListScreen from '../screens/StockOpname';
import DetailStockOpnameScreen from '../screens/StockOpname/detail';
import DetaliBinStockOpnameScreen from '../screens/StockOpname/inspect';
import DetailMaterialStockOpnameScreen from '../screens/StockOpname/detailmaterial';
import MaterialMovementScreen from '../screens/MaterialMovement';
import MaterialMovementScanScreen from '../screens/MaterialMovement/detail';
import MovementSmartScanScreen from '../screens/MaterialMovement/inspect';
import MovementPageScreen from '../screens/MaterialMovement/Movementpage';

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
          {/* Open Transfer Instruction*/}
          <Stack.Screen
            name="Transfer Instruction"
            component={TransferInstructionScreen}
          />
          <Stack.Screen
            name="Transfer Instruction Assign"
            component={TransferInstructionAssignScreen}
          />
          {/* My Transfer Instruction*/}
          <Stack.Screen
            name="My Transfer Instruction"
            component={MyTransferInstructionScreen}
          />
          <Stack.Screen
            name="My Transfer Instruction Scan"
            component={MyTransferInstructionScanScreen}
          />

          <Stack.Screen
            name="My Transfer Instruction Submit"
            component={MyTransferInstructionSubmitScreen}
          />

          {/*Putaway*/}
          <Stack.Screen name="Scan WO Number" component={PutawayScanWoScreen} />
          <Stack.Screen
            name="Put Away Material"
            component={PutawayMaterialScreen}
          />
          <Stack.Screen
            name="Scan Material"
            component={ScanMaterialPutawayScreen}
          />

          {/* Material Issue Menu */}
          <Stack.Screen
            name="Material Issue Scan"
            component={MaterialIssueScanScreen}
          />
          <Stack.Screen
            name="Material Issue Inspect"
            component={MaterialIssueInspectScreen}
          />
          <Stack.Screen
            name="Detail Material Issue"
            component={DetailMaterialScreen}
          />
          <Stack.Screen name="Pick Item" component={PickItemScreen} />
          <Stack.Screen name="Detail Wo" component={DetailWoScreen} />

          {/* Material Return */}
          <Stack.Screen
            name="Material Return Scan"
            component={MaterialReturnScanScreen}
          />
          <Stack.Screen
            name="Material Return Detail"
            component={MaterialReturnDetailScreen}
          />
          <Stack.Screen
            name="Detail Material"
            component={DetailMaterialReturnScreen}
          />
          <Stack.Screen
            name="Detail Wo Material Return"
            component={DetailWoMaterialReturnScreen}
          />

          {/* Stock Opname */}
          <Stack.Screen
            name="Stock Opname List"
            component={StockOpnameListScreen}
          />
          <Stack.Screen
            name="Detail Stock Opname"
            component={DetailStockOpnameScreen}
          />
          <Stack.Screen
            name="Detail Bin Stock Opname"
            component={DetaliBinStockOpnameScreen}
          />
          <Stack.Screen
            name="Detail Material Stock Opname"
            component={DetailMaterialStockOpnameScreen}
          />
          {/* Material Movement */}
          <Stack.Screen
            name="Material Movement"
            component={MaterialMovementScreen}
          />
          <Stack.Screen
            name="Material Movement Scan"
            component={MaterialMovementScanScreen}
          />
          <Stack.Screen
            name="Movement Smart Scan"
            component={MovementSmartScanScreen}
          />
          <Stack.Screen name="Movement Page" component={MovementPageScreen} />

          {/* inspection menu */}
          <Stack.Screen name="Inspection" component={InspectionScreen} />
          <Stack.Screen
            name="InspectionReceivingPO"
            component={InspectionReceivingScreen}
          />
          <Stack.Screen
            name="InspectionReceivingPOApprove"
            component={InspectionReceivingApproveScreen}
          />

          {/* Tag Menu */}
          <Stack.Screen name="Po to Tag" component={TagScreen} />
          <Stack.Screen name="Po Detail" component={TagDetailScreen} />
          <Stack.Screen name="Item to Tag" component={TagInspectScreen} />

          <Stack.Screen
            name="List"
            component={BottomTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Options" component={OptionsScreen} />
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
