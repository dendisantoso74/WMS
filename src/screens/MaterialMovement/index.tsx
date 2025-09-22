import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Modal,
  Button,
  TextInput,
  Image,
} from 'react-native';
import ScanRFIDScreen from '../ScanRFIDScreen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ButtonApp from '../../compnents/ButtonApp';
import {debounce, set} from 'lodash';
// import {View} from 'react-native-reanimated/lib/typescript/Animated';
import {
  ZebraEvent,
  ZebraEventEmitter,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import {getBinByTagCode} from '../../services/materialMovement';
import materialImage2 from '../../assets/images/move.png'; // Adjust the path as necessary
import materialImage from '../../assets/images/move2.png'; // Adjust the path as necessary
import rfid from '../../assets/images/rfid.png'; // Adjust the path as necessary
import PreventBackNavigate from '../../utils/preventBack';

const MaterialMovementScreen = () => {
  const navigation = useNavigation<any>();
  const [listRfid, setListRfid] = useState<string[]>([]);
  const [isShowScan, setIsShowScan] = useState(false);
  const [search, setSearch] = useState('');
  const [tagBin, setTagBin] = useState('');
  const [binInfo, setBinInfo] = useState<any>(null);

  // rfid scanner
  const handleRfidEvent = useCallback(
    debounce((newData: string) => {
      // if newdata is array make popup to select item for set to search

      setSearch(newData);
      newData && findBin(newData[0]);
    }, 200),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );

      // Clean up listeners when screen is unfocused
      return () => {
        rfidEvent.remove();
      };
    }, []),
  );

  const findBin = useCallback(async (tag: string) => {
    const bin = await getBinByTagCode(tag);
    setBinInfo(bin.member[0]);
  }, []);

  useEffect(() => {
    if (binInfo) {
      navigation.navigate('Movement Smart Scan', {
        binInfo: binInfo,
      });
    }
  }, [binInfo, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PreventBackNavigate />

      {/* <Text>TAG INFO SCREEN</Text> */}
      <View className="m-4">
        <Text className="text-xl font-bold">
          1. Collect all the material to be moved
        </Text>
        <Text className="text-xl font-bold">
          2. Go to the final bin destination
        </Text>
        <Text className="text-xl font-bold">
          3. Scan bin first and the scan all the materials
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <Image
          source={materialImage2}
          style={{width: 250, height: 120, resizeMode: 'contain'}}
        />
        <Image
          source={materialImage}
          style={{width: 250, height: 120, resizeMode: 'contain'}}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonApp
          label="START SCAN"
          size="large"
          color="primary"
          onPress={() => setIsShowScan(!isShowScan)}
        />
      </View>
      <Modal
        visible={isShowScan}
        transparent
        animationType="slide"
        onRequestClose={() => setIsShowScan(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Please scan RFID bin destination
            </Text>
            <View className="flex-row justify-center py-3 align-items-center">
              <Image
                source={rfid}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </View>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Scan Bin"
              value={tagBin || search[0]}
              onChangeText={setTagBin}
              onSubmitEditing={e => findBin(e.nativeEvent.text)}
            />

            {/* <Text>{binInfo ? `Bin Info: ${JSON.stringify(binInfo)}` : ''}</Text> */}
            {binInfo && <Text>Bin : {binInfo.bin}</Text>}
            {/* <Text>Tag : {binInfo && binInfo.tagcode}</Text> */}

            <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              {/* <Button title="Cancel" onPress={() => setIsShowScan(false)} /> */}
              {/* <View style={{width: 12}} /> */}
              {/* {binInfo && (
                <Button
                  title="Next"
                  onPress={() =>
                    navigation.navigate('Movement Smart Scan', {
                      binInfo: binInfo,
                    })
                  }
                />
              )} */}
            </View>
          </View>
        </View>
      </Modal>
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
  // modal stylr
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
});

export default MaterialMovementScreen;
