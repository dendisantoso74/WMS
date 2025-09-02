import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation, useRoute} from '@react-navigation/native';

const dummy = [
  // {binum: '12www', qty: 12, sn: 'SN12345'},
  // {binum: '34abc', qty: 8, sn: 'SN67890'},
  // {binum: '56xyz', qty: 5, sn: 'SN54321'},
];

const DetailMaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item, invuselinenum, invinvUseId} = route.params;
  console.log('RFIDs from params:', item, invuselinenum, invinvUseId);

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const handleReceive = () => {
    setModalVisible(true);
  };

  const renderItem = ({item}: {item: any}) => (
    <View className="flex-row items-center px-4 mb-4 bg-white shadow-sm rounded-xl">
      {/* <View className="w-4 h-full mr-4 bg-gray-300 rounded-tl-xl rounded-bl-xl" /> */}
      <View className="flex-1 py-3">
        <View className="flex-row items-center mb-1">
          <Text className="font-bold text-gray-700">Serial Number :</Text>
          <Text className="flex-1 ml-2 text-gray-700" numberOfLines={1}>
            {item.sn}
          </Text>
          <TouchableOpacity
            className="items-center justify-center ml-2 bg-red-400 rounded-full w-7 h-7"
            onPress={() => {
              /* handle remove */
            }}>
            <Text className="text-lg font-bold text-white">×</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Text className="text-gray-500">Bin :</Text>
          <Text className="flex-1 ml-2 text-gray-700" numberOfLines={1}>
            {item.binum}
          </Text>
          <Text className="mr-1 text-gray-500">Qty :</Text>
          <Text className="font-bold text-gray-700">{item.qty} PCS</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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

      <View className="items-end my-1 mr-3 ">
        <TouchableOpacity
          className="items-center justify-center w-16 h-8 bg-blue-500 border border-blue-500 rounded"
          onPress={() =>
            navigation.navigate('Pick Item', {
              item: item,
              invuselinenum: invuselinenum,
              invinvUseId: invinvUseId,
            })
          }>
          <Icon library="Feather" name="plus" size={15} color="white"></Icon>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummy}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="Back"
          onPress={() => navigation.goBack()}
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
});

export default DetailMaterialScreen;
