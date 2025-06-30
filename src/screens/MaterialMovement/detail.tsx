import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, View} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';
import ButtonApp from '../../compnents/ButtonApp';
// import {View} from 'react-native-reanimated/lib/typescript/Animated';

const MaterialMovementScanScreen = () => {
  const navigation = useNavigation<any>();
  const [listRfid, setListRfid] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text>TAG INFO SCREEN</Text> */}

      <ScanRFIDScreen
        onScanRfid={rfids => console.log('RFIDs:', rfids)}
        onScanBarcode={barcodes => console.log('Barcodes:', barcodes)}
        onDevicesChange={devices => console.log('Devices:', devices)}
        autoNavigate={true}
        mode="rfid"
        onAutoNavigate={rfids =>
          navigation.navigate('Movement Smart Scan', {listrfid: rfids})
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
});

export default MaterialMovementScanScreen;
