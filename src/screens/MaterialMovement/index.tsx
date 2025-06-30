import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, View} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useNavigation} from '@react-navigation/native';
import ButtonApp from '../../compnents/ButtonApp';
// import {View} from 'react-native-reanimated/lib/typescript/Animated';

const MaterialMovementScreen = () => {
  const navigation = useNavigation<any>();
  const [listRfid, setListRfid] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Text>TAG INFO SCREEN</Text> */}
      <View className="gap-3">
        <Text className="font-bold text-xl">
          1. Collect all the material to be moved
        </Text>
        <Text className="font-bold text-xl">
          2. Go to the final bin destination
        </Text>
        <Text className="font-bold text-xl">
          3. Scan bin first and the scan all the materials
        </Text>
      </View>
      <ScanRFIDScreen
        onScanRfid={rfids => console.log('RFIDs:', rfids)}
        onScanBarcode={barcodes => console.log('Barcodes:', barcodes)}
        onDevicesChange={devices => console.log('Devices:', devices)}
        autoNavigate={true}
        mode="rfid"
        onAutoNavigate={rfids => navigation.navigate('', {listrfid: rfids})}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Next"
          size="large"
          color="primary"
          onPress={() => navigation.navigate('Material Movement Scan')}
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

export default MaterialMovementScreen;
