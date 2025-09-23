// unused screen
import React, {useEffect, useState} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {set} from 'lodash';

const DetailMaterialStockOpnameScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, wms_opinid, itemBin} = route.params;
  // console.log('item from params detail material:', item);
  const [count, setCount] = useState(0);
  const [tempPayload, setTempPayload] = useState([]);

  useEffect(() => {
    setCount(item.qtystored);
  }, []);

  const handleDecrease = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleInputChange = (text: string) => {
    // Only allow numbers, fallback to 0 if empty or invalid
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    // Max is item.receiptquantity - inputAceptedQty
    const max = item.qtystored;
    if (isNaN(num)) {
      setCount(0);
    } else if (num > max) {
      setCount(max);
    } else {
      setCount(num);
    }
  };

  const handleAdjust = () => {
    // Create the payload object
    const payload = {
      binnum: item.wms_bin,
      wms_opinid: wms_opinid,
      physicalcount: count,
      serialnumber: item.serialnumber,
    };
    setTempPayload([payload]); // Save to state (array for possible multiple entries)
    // console.log('Adjusting material:', payload);
    navigation.navigate('Detail Bin Stock Opname', {
      item: item,
      wms_opinid: wms_opinid,
      itemBin: itemBin,
      tempPayload: [payload],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-col p-2 bg-blue-400 ">
        <View className="flex-row gap-3">
          <View className="flex-col justify-start">
            <Text className="h-20 font-bold text-white">Material</Text>
            <Text className="font-bold text-white">Serial Number</Text>
            <Text className="font-bold text-white">Bin</Text>
            <Text className="font-bold text-white">Unit</Text>
          </View>
          <View className="flex-col justify-start ">
            <Text className="h-20 text-white ">
              {item.itemnum} / {item?.description}
            </Text>
            <Text className="text-white ">{item.serialnumber}</Text>
            <Text className="text-white ">{item.wms_bin}</Text>
            <Text className="text-white ">{item.unitstored}</Text>
          </View>
        </View>
      </View>

      <View className="mx-3">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">Current Balance</Text>
          </View>
          <View style={styles.counterRow}>
            <View style={styles.countBoxDisabled}>
              <TextInput
                style={[styles.countText, {textAlign: 'center'}]}
                value={item.qtystored.toString()}
                editable={false}
              />
            </View>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold">Physical Count</Text>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity
              disabled={count === 0}
              style={styles.circleBtn}
              onPress={handleDecrease}>
              <Text style={styles.circleBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.countBox}>
              <TextInput
                style={[styles.countText, {textAlign: 'center'}]}
                keyboardType="numeric"
                value={count.toString()}
                onChangeText={handleInputChange}
              />
            </View>
            <TouchableOpacity
              disabled={count >= item.qtystored}
              style={styles.circleBtn}
              onPress={handleIncrease}>
              <Text style={styles.circleBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonApp
          onPress={() => handleAdjust()}
          label="ADJUSTMENT MATERIAL"
          size="large"
          color="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#285a8d',
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 40, // To center title visually
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  rfidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // paddingVertical: 18,
    // paddingHorizontal: 16,
    paddingRight: 16,
  },
  sideBar: {
    width: 18,
    height: '100%',
    backgroundColor: '#b0b0b0',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 16,
  },
  rfidText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginVertical: 16,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  filterInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 3,
    fontSize: 14,
    color: '#222',
    // marginBottom: 4,
    marginTop: 6,
    marginHorizontal: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  circleBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#3674B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  countBoxDisabled: {
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    marginHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 32,
    // paddingVertical: 8,
  },
  countBox: {
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    marginHorizontal: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // paddingVertical: 8,
  },
  countText: {
    fontSize: 24,
    paddingVertical: 5,
    color: 'black',
  },
  dropdown: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 12,
    color: '#333',
  },
});

export default DetailMaterialStockOpnameScreen;
