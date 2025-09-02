import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {storeData} from '../utils/store';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ZebraEvent,
  ZebraEventEmitter,
  connectToDevice,
  getAllDevices,
  type ZebraResultPayload,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import Loading from '../compnents/Loading';
import {set} from 'lodash';

const ConnectRFIDReader = () => {
  const navigation = useNavigation<any>();
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [listDevices, setListDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const deviceConnectEvent = ZebraEventEmitter.addListener(
      ZebraEvent.ON_DEVICE_CONNECTED,
      (e: ZebraResultPayload) => {
        ToastAndroid.show(e.data, ToastAndroid.SHORT);
        setConnectedDevice(e.data); // Track connected device
      },
    );
  }, []);

  const getListRfidDevices = async () => {
    const devices = await getAllDevices();
    setListDevices(devices);
  };

  useFocusEffect(
    React.useCallback(() => {
      getListRfidDevices();

      const deviceConnectEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_DEVICE_CONNECTED,
        (e: ZebraResultPayload) => {
          ToastAndroid.show(e.data, ToastAndroid.SHORT);
          setConnectedDevice(e.data);
          setLoading(false);
        },
      );

      // Clean up listeners when screen is unfocused
      return () => {
        deviceConnectEvent.remove();
      };
    }, []),
  );

  const renderItem = ({item}: {item: (typeof DATA)[0]}) => (
    <TouchableOpacity
      onPress={() => {
        connectToDevice(item), setLoading(true);
      }}
      style={[
        styles.deviceCard,
        connectedDevice === item && {
          borderColor: '#22c55e',
          borderWidth: 2,
          backgroundColor: '#e0ffe7',
        },
      ]}
      activeOpacity={0.7}>
      <Text style={styles.deviceCardText}>{item}</Text>
      {connectedDevice === item ? (
        <Text
          style={{
            color: '#22c55e',
            fontWeight: 'bold',
            marginTop: 4,
          }}>
          Connected
        </Text>
      ) : (
        <Text style={styles.deviceCardHint}>Tap to connect</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Loading visible={loading} text="Connecting..." />
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1e40af',
          margin: 16,
          marginBottom: 8,
        }}>
        Connect to RFID Reader via Bluetooth
      </Text>
      <View
        className="gap-2"
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}>
        <Text className="text-black">
          1. Make sure your RFID reader is powered on and Bluetooth is enabled.
        </Text>
        <Text className="text-black">
          2. The blue LED on the RFID reader will{' '}
          <Text style={{fontWeight: 'bold'}}>blink</Text> when not connected.
        </Text>
        <Text className="text-black">
          3. When the reader is connected, the blue LED will{' '}
          <Text style={{fontWeight: 'bold'}}>stay ON</Text> (not blinking).
        </Text>
        <Text className="text-black">4. Tap a device below to connect.</Text>

        <Text
          style={{
            // fontSize: 13,
            marginTop: 12,
            color: '#2563eb',

            // fontWeight: 'bold',
          }}>
          If the blue LED on your RFID reader is{' '}
          <Text style={{fontWeight: 'bold'}}>not blinking</Text>, the reader is
          already connected. You don't need to connect again.
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1e40af',
          marginLeft: 16,

          marginBottom: 2,
        }}>
        Devices Reader
      </Text>
      <FlatList
        data={listDevices}
        keyExtractor={(item, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#22223b',
    marginLeft: 12,
  },
  position: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
    marginLeft: 12,
  },
  // rfidCard
  deviceListContainer: {
    // maxHeight: 80,
    marginBottom: 16,
  },
  deviceListTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#22223b',
  },
  deviceListContent: {
    paddingHorizontal: 8,
  },
  deviceCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    // marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  deviceCardHint: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default ConnectRFIDReader;
