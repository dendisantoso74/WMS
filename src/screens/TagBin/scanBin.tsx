import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';

const ScanBinScreen = () => {
  const navigation = useNavigation<any>();
  const [listRfid, setListRfid] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text>Material Receive SCREEN</Text> */}
      <ScanRFIDScreen
        onScanRfid={rfids => console.log('RFIDs:', rfids)}
        onScanBarcode={barcodes => console.log('Barcodes:', barcodes)}
        onDevicesChange={devices => console.log('Devices:', devices)}
        autoNavigate={true}
        mode="rfid"
        onAutoNavigate={rfids =>
          navigation.navigate('Register RFID Bin', {listrfid: rfids})
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
});

export default ScanBinScreen;
