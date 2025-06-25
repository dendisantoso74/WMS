import {debounce} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Animated,
  PanResponder,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  ZebraEvent,
  ZebraEventEmitter,
  connectToDevice,
  getAllDevices,
  type ZebraResultPayload,
  type ZebraRfidResultPayload,
} from 'react-native-zebra-rfid-barcode';
import logoRfid from '../assets/images/rfid.png'; // Adjust the path as necessary
import logoQrcode from '../assets/images/qrcode.png'; // Adjust the path as necessary
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput} from 'react-native';

const {width} = Dimensions.get('window');
const FRAME_SIZE = width * 0.7;

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MAX_TRANSLATE_Y = SCREEN_HEIGHT - 100;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.26; // 30% of screen height

type ScanRFIDScreenProps = {
  onScanRfid?: (rfids: string[]) => void;
  onScanBarcode?: (barcodes: string[]) => void;
  onDevicesChange?: (devices: string[]) => void;
  autoNavigate?: boolean;
  onAutoNavigate?: (rfids: string[]) => void;
  showBarcodes?: boolean;
  showRfids?: boolean;
  showDevices?: boolean;
  promptText?: string;
  iconSource?: any;
  mode?: 'rfid' | 'qrcode' | 'multi'; // 'rfid' or 'qrcode'
};

const ScanRFIDScreen: React.FC<ScanRFIDScreenProps> = ({
  onScanRfid,
  onScanBarcode,
  onDevicesChange,
  autoNavigate = false,
  onAutoNavigate,
  showBarcodes = false,
  showRfids = false,
  showDevices = true,
  promptText = 'Take your device to scan\nPO Number',
  iconSource = require('../assets/images/rfid.png'),
  mode = 'multi', // 'rfid' or 'barcode'
}) => {
  const [listDevices, setListDevices] = useState<string[]>([]);
  const [listBarcodes, setListBarcodes] = useState<string[]>([]);
  const [listRfid, setListRfid] = useState<string[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  const pan = useRef(
    new Animated.ValueXY({x: 0, y: SCREEN_HEIGHT - 50}),
  ).current;
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // Initialize PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // If swiping up (negative velocity)
        if (gestureState.vy < -0.5 || gestureState.dy < -50) {
          openBottomSheet();
        }
        // If swiping down (positive velocity)
        else if (gestureState.vy > 0.5 || gestureState.dy > 50) {
          closeBottomSheet();
        }
        // Otherwise check position
        else {
          if ((pan.y as any)._value < SCREEN_HEIGHT / 2) {
            openBottomSheet();
          } else {
            closeBottomSheet();
          }
        }
      },
    }),
  ).current;

  const openBottomSheet = useCallback(() => {
    setIsOpen(true);
    Animated.spring(pan.y, {
      toValue: SCREEN_HEIGHT - MODAL_HEIGHT - insets.bottom - 80,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [pan.y]);

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false);
    Animated.spring(pan.y, {
      toValue: SCREEN_HEIGHT - 50,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
    onAutoNavigate && onAutoNavigate(['PO-BJS-25-1673-MMT']);
  }, [pan.y]);

  // Calculate bottom sheet transform
  const bottomSheetStyle = {
    transform: [{translateY: pan.y}],
  };
  // useEffect(() => {
  //   getListRfidDevices();

  //   const barcodeEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_BARCODE,
  //     (e: ZebraResultPayload) => {
  //       handleBarcodeEvent(e.data);
  //     },
  //   );

  //   const rfidEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_RFID,
  //     (e: ZebraRfidResultPayload) => {
  //       handleRfidEvent(e.data);
  //     },
  //   );

  //   const deviceConnectEvent = ZebraEventEmitter.addListener(
  //     ZebraEvent.ON_DEVICE_CONNECTED,
  //     (e: ZebraResultPayload) => {
  //       ToastAndroid.show(e.data, ToastAndroid.SHORT);
  //     },
  //   );

  //   return () => {
  //     barcodeEvent.remove();
  //     rfidEvent.remove();
  //     deviceConnectEvent.remove();
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getListRfidDevices();

      const barcodeEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_BARCODE,
        (e: ZebraResultPayload) => {
          handleBarcodeEvent(e.data);
        },
      );

      const rfidEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_RFID,
        (e: ZebraRfidResultPayload) => {
          handleRfidEvent(e.data);
        },
      );

      const deviceConnectEvent = ZebraEventEmitter.addListener(
        ZebraEvent.ON_DEVICE_CONNECTED,
        (e: ZebraResultPayload) => {
          ToastAndroid.show(e.data, ToastAndroid.SHORT);
          setConnectedDevice(e.data);
        },
      );

      // Clean up listeners when screen is unfocused
      return () => {
        barcodeEvent.remove();
        rfidEvent.remove();
        deviceConnectEvent.remove();
      };
    }, []),
  );

  useEffect(() => {
    if (onDevicesChange) onDevicesChange(listDevices);
  }, [listDevices, onDevicesChange]);

  useEffect(() => {
    if (onScanBarcode) onScanBarcode(listBarcodes);
  }, [listBarcodes, onScanBarcode]);

  // useEffect(() => {
  //   if (onScanRfid) onScanRfid(listRfid);
  //   if (autoNavigate && listRfid.length > 0 && onAutoNavigate) {
  //     onAutoNavigate(listRfid);
  //   }
  // }, [listRfid, onScanRfid, autoNavigate, onAutoNavigate]);

  useEffect(() => {
    if (autoNavigate && onAutoNavigate) {
      if (mode === 'rfid' && listRfid.length > 0) {
        onAutoNavigate(listRfid);
      } else if (mode === 'qrcode' && listBarcodes.length > 0) {
        onAutoNavigate(listBarcodes);
      } else if (mode === 'multi') {
        if (listRfid.length > 0) {
          onAutoNavigate(listRfid);
        } else if (listBarcodes.length > 0) {
          onAutoNavigate(listBarcodes);
        }
      }
    }
  }, [listRfid, listBarcodes, mode, autoNavigate, onAutoNavigate]);

  useEffect(() => {
    const deviceConnectEvent = ZebraEventEmitter.addListener(
      ZebraEvent.ON_DEVICE_CONNECTED,
      (e: ZebraResultPayload) => {
        ToastAndroid.show(e.data, ToastAndroid.SHORT);
        setConnectedDevice(e.data); // Track connected device
      },
    );
  }, []);

  // const handleRfidEvent = useCallback(
  //   debounce((newData: string[]) => {
  //     setListRfid(prev => {
  //       // Prevent duplicates
  //       const set = new Set(prev);
  //       newData.forEach(item => set.add(item));
  //       return Array.from(set);
  //     });
  //   }, 200),
  //   [],
  // );

  //   Prevent duplicates

  // const handleBarcodeEvent = useCallback(
  //   debounce((newData: string) => {
  //     setListBarcodes(prev => {
  //       if (prev.includes(newData)) return prev;
  //       return [...prev, newData];
  //     });
  //   }, 200),
  //   [],
  // );

  const handleRfidEvent = useCallback(
    debounce((newData: string[]) => {
      setListRfid(pre => [...pre, ...newData]);
    }, 200),
    [],
  );

  const handleBarcodeEvent = useCallback(
    debounce((newData: string) => {
      setListBarcodes(pre => [...pre, newData]);
    }, 200),
    [],
  );

  const getListRfidDevices = async () => {
    const devices = await getAllDevices();
    setListDevices(devices);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View className="h-full border">
          {showDevices && (
            <View style={styles.deviceListContainer}>
              <Text style={styles.deviceListTitle}>
                Device:
                {/* {listDevices.length} */}
              </Text>
              <FlatList
                data={listDevices}
                // horizontal
                // showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.deviceListContent}
                // className="border"
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => connectToDevice(item)}
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
                )}
                keyExtractor={item => item}
              />
            </View>
          )}

          {/* logo scan */}
          <View style={styles.containerQR}>
            {/* Scan Frame with corners */}
            <View style={styles.frameContainer}>
              {/* Corner borders */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* RFID Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={
                    mode === 'rfid' || mode === 'multi' ? logoRfid : logoQrcode
                  }
                  style={{width: 100, height: 100, resizeMode: 'contain'}}
                />
              </View>
            </View>
            <Text style={styles.promptText}>{promptText}</Text>
          </View>
          {/* showw list */}
          {showBarcodes && (
            <View>
              <Text>Barcodes: {listBarcodes.length}</Text>
              <FlatList
                data={listBarcodes}
                renderItem={({item}) => (
                  <View>
                    <Text className="text-red-600">{item}</Text>
                  </View>
                )}
              />
            </View>
          )}

          {showRfids && (
            <View>
              <Text>RFIDs: {listRfid.length}</Text>
              <FlatList
                data={listRfid}
                renderItem={({item}) => (
                  <View>
                    <Text>{item}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Bootm Sheet */}
        <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.handle}>
              <View style={styles.line} />
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
            style={{flex: 1}}>
            <ScrollView
              style={styles.contentContainer}
              keyboardShouldPersistTaps="handled">
              {/* <Text style={styles.title}>Bottom Sheet Modal</Text> */}
              <View className="flex-col gap-3">
                <TextInput
                  placeholder="Type here..."
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: '#fafafa',
                  }}
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeBottomSheet}>
                  <Text style={styles.closeButtonText}>Close Sheet</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const CORNER_SIZE = 36;
const CORNER_THICKNESS = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  containerQR: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  frameContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: FRAME_SIZE / 2 - 30,
    left: FRAME_SIZE / 2 - 30,
    width: 60,
    height: 60,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#3b82f6',
    zIndex: 1,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 8,
  },
  promptText: {
    marginTop: 28,
    fontSize: 18,
    color: '#22223b',
    fontWeight: '600',
    textAlign: 'center',
  },
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

  // bottomsheet
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT + 28,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 10,
    height: 36,
  },
  line: {
    width: 60, // wider
    height: 8, // thicker
    backgroundColor: '#111', // black
    borderRadius: 8, // fully rounded
    marginTop: 0,
    marginBottom: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
  },
  bottomButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default ScanRFIDScreen;
