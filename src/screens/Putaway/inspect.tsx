import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';

const ScanMaterialPutawayScreen = () => {
  const navigation = useNavigation<any>();
  const [listRfid, setListRfid] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text>Material Receive SCREEN</Text> */}
      <Text className="mt-5 text-center font-bold text-xl">
        Please Scan On Material Tag
      </Text>
      <ScanRFIDScreen
        onScanRfid={rfids => console.log('RFIDs:', rfids)}
        onScanBarcode={barcodes => console.log('Barcodes:', barcodes)}
        onDevicesChange={devices => console.log('Devices:', devices)}
        autoNavigate={true}
        mode="qrcode"
        onAutoNavigate={rfids =>
          navigation.navigate('Material Receive Detail', {listrfid: rfids})
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

export default ScanMaterialPutawayScreen;
