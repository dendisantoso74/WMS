import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';

const ScanPoInspect = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text>Material Receive SCREEN</Text> */}

      <ScanRFIDScreen
        onScanRfid={rfids => console.log('RFIDs:', rfids)}
        onScanBarcode={barcodes => console.log('Barcodes:', barcodes)}
        onDevicesChange={devices => console.log('Devices:', devices)}
        autoNavigate={true}
        mode="qrcode"
        onAutoNavigate={rfids =>
          navigation.navigate('InspectionReceivingPO', {
            ponum: rfids[0], // Assuming rfids is an array and we take the first one
          })
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

export default ScanPoInspect;
