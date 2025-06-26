import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';
import ButtonApp from '../../compnents/ButtonApp';

const MaterialReturnScanScreen = () => {
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
        mode="qrcode"
        onAutoNavigate={rfids =>
          navigation.navigate('Material Return Detail', {listrfid: rfids})
        }
      />
      <View className="flex items-center justify-center mt-4">
        <TextInput
          className="text-left border-b-4 w-80 "
          placeholder="Enter WO Number"></TextInput>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonApp
          label="INPUT"
          size="large"
          color="primary"
          onPress={() => navigation.navigate('Material Return Detail')}
        />
      </View>
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

export default MaterialReturnScanScreen;
