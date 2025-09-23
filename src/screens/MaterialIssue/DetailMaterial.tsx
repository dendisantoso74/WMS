import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {pickItem} from '../../services/materialIssue';
import PreventBackNavigate from '../../utils/preventBack';
import Loading from '../../compnents/Loading';

const DetailMaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, invuselinenum, invinvUseId, payload, invuse} = route.params;

  // console.log(
  //   'param detail material',
  //   item,
  //   invuselinenum,
  //   invinvUseId,
  //   payload,
  //   invuse,
  // );

  const [payloads, setPayloads] = useState<any[]>(payload || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  // prevent back nav manualy
  useFocusEffect(
    useCallback(() => {
      const subscription = navigation.addListener('beforeRemove', (e: any) => {
        e.preventDefault();
        navigation.navigate('Material Issue Inspect', {
          listrfid: [item.wogroup],
        });
      });

      return () => {
        subscription();
      };
    }, [navigation]),
  );

  useEffect(() => {
    if (Array.isArray(payload)) {
      // console.log('Payload is an array:', payload);

      setPayloads(payload);
    }

    const total = payload.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
  }, [payload]);

  useEffect(() => {
    const total = payloads.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
  }, [payloads]);

  const handleRemovePayload = (serialnumber: string) => {
    const updated = payloads.filter(p => p.serialnumber !== serialnumber);
    setPayloads(updated);
  };

  const handlePickItems = async () => {
    // Implement your pick items logic here
    setLoading(true);
    await pickItem(invinvUseId, payloads)
      .then(res => {
        ToastAndroid.show('Item picked successfully', ToastAndroid.SHORT);
        navigation.navigate('Material Issue Inspect', {
          listrfid: [item.wogroup],
        });
      })
      .catch(err => {
        console.error('Error picking item:', err);
        Alert.alert(
          'Error',
          err.Error.message || 'An error occurred while picking the item.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}: {item: any}) => (
    <View className="flex-row items-center px-4 mb-4 bg-white shadow-sm rounded-xl">
      {/* <View className="w-4 h-full mr-4 bg-gray-300 rounded-tl-xl rounded-bl-xl" /> */}
      <View className="flex-1 py-3">
        <View className="flex-row items-center mb-1">
          <Text className="text-sm font-bold text-gray-700">
            Serial Number :
          </Text>
          <Text className="flex-1 ml-2 text-sm text-gray-700" numberOfLines={1}>
            {item.serialnumber}
          </Text>
          <TouchableOpacity
            className="items-center justify-center ml-2 bg-red-400 rounded-full w-7 h-7"
            onPress={() => handleRemovePayload(item.serialnumber)}>
            {/* <Text className="text-lg font-bold text-white">×</Text> */}
            <Icon library="Feather" name="trash-2" size={12} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500">Bin :</Text>
          <Text className="flex-1 ml-2 text-sm text-gray-700" numberOfLines={1}>
            {item.frombin}
          </Text>
          <Text className="mr-1 text-sm text-gray-500">Qty :</Text>
          <Text className="text-sm font-bold text-gray-700 ">
            {item.quantity} PCS
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loading visible={loading} text="Loading..." />
      <View className="p-2 bg-blue-400">
        <View className="flex flex-row justify-start">
          <Text className="w-1/4 font-bold text-white">Material</Text>
          <Text className="w-4/6 text-white">{item?.description}</Text>
        </View>
        <View className="flex flex-row mr-4">
          <Text className="w-1/4 font-bold text-white">Reserve Qty</Text>
          <Text className="font-bold text-white">
            {item?.reservedqty} {item?.wms_unit}
          </Text>
        </View>
      </View>

      {totalQuantity < item?.reservedqty && (
        <View className="items-end my-1 mr-3 ">
          <TouchableOpacity
            className="items-center justify-center w-16 h-8 bg-blue-500 border border-blue-500 rounded"
            onPress={() =>
              navigation.navigate('Pick Item', {
                item: item,
                invuselinenum: invuselinenum,
                invinvUseId: invinvUseId,
                payloadPick: payloads,
                invuse: invuse,
              })
            }>
            <Icon library="Feather" name="plus" size={15} color="white"></Icon>
          </TouchableOpacity>
        </View>
      )}
      {payloads && (
        <FlatList
          data={payloads}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Pick Items"
          onPress={() => handlePickItems()}
          size="large"
          disabled={payloads.length === 0}
        />
        {/* <ButtonApp
          label="Back"
          onPress={() => navigation.goBack()}
          size="large"
          color="primary"
        /> */}
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
});

export default DetailMaterialScreen;
