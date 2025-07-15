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
import {findSugestBin} from '../../services/materialIssue';
import {set} from 'lodash';

const dummyRfids = ['00000000000000000000'];

const PickItemScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item} = route.params;

  console.log('RFIDs from params:', item);

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');
  const [suggestedBin, setSuggestedBin] = useState([]);

  useEffect(() => {
    //find sugestion bin
    const findbin = async () => {
      const res = await findSugestBin(
        item.invuseline[0].itemnum,
        item.invuseline[0].fromstoreloc,
      );
      setSuggestedBin(res.member[0]);
      console.log('Suggested Bin:', res.member[0]);
    };

    findbin();
  }, [item]);

  // const renderItem = ({item}: {item: string}) => (
  //   <View className="flex-col ">
  //     <View className="flex-row w-full mt-2 ">
  //       <Text className="w-1/2 font-bold">Item Name</Text>
  //       <Text className="font-bold">{item?.invuseline[0].description}</Text>
  //     </View>
  //     <View className="flex-row w-full mt-5">
  //       <Text className="w-1/2 font-bold">Condition Code</Text>
  //       <Text className="font-bold">BROKEN</Text>
  //     </View>
  //     <View className="flex-row w-full mt-5">
  //       <Text className="w-1/2 font-bold">Issue Unit</Text>
  //       <Text className="font-bold">METER</Text>
  //     </View>
  //     <View className="flex-row items-center w-full mt-5">
  //       <Text className="w-1/2 font-bold">Stored Qty</Text>
  //       <View className="flex-row items-center ">
  //         <TextInput
  //           className="w-24 text-center"
  //           style={styles.filterInput}
  //           placeholder="0"
  //           placeholderTextColor="#b0b0b0"
  //           value={search}
  //           onChangeText={setSearch}
  //         />
  //         <Text className="font-bold">METER</Text>
  //       </View>
  //     </View>
  //     <View className="flex-row items-center w-full mt-5">
  //       <Text className="w-1/2 font-bold">Pick Qty</Text>
  //       <View className="flex-row items-center ">
  //         <TextInput
  //           className="w-24 text-center"
  //           style={styles.filterInput}
  //           placeholder="0"
  //           placeholderTextColor="#b0b0b0"
  //           value={search}
  //           onChangeText={setSearch}
  //         />
  //         <Text className="font-bold">METER</Text>
  //       </View>
  //     </View>

  //     <View className="flex-row items-center w-full mt-5">
  //       <Text className="w-1/2 font-bold">Sugesstion Bin</Text>
  //       <View className="w-1/2 py-2 bg-gray-200">
  //         <Text className="font-bold text-center ">MS-A1L-4-2-2-1</Text>
  //       </View>
  //     </View>
  //     <View className="flex-row items-center w-full mt-5">
  //       <Text className="w-1/2 font-bold">User Type</Text>
  //       <View className="w-1/2 py-2 bg-gray-200">
  //         <Text className="font-bold text-center ">ISSUE</Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  // <Text>Item Name</Text>
  //       <Text>Condition Code</Text>
  //       <Text>Issue Unit</Text>
  //       <Text>Stored Qty</Text>
  //       <Text>Pick Qty</Text>
  //       <Text>Bin</Text>
  //       <Text>Suggestion Bin</Text>
  //       <Text>User Type</Text>

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text className="mt-3 ml-4 font-bold">Serial Number</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Serial Number"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      /> */}

      <View className="flex-col ">
        <View className="flex-row w-full mt-2 ">
          <Text className="w-1/2 font-bold">Item Name</Text>
          <Text className="font-bold">{item?.invuseline[0].description}</Text>
        </View>
        <View className="flex-row w-full mt-5">
          <Text className="w-1/2 font-bold">Condition Code</Text>
          <Text className="font-bold">BROKEN</Text>
        </View>
        <View className="flex-row w-full mt-5">
          <Text className="w-1/2 font-bold">Issue Unit</Text>
          <Text className="font-bold">{item?.invuseline[0].wms_unit}</Text>
        </View>
        <View className="flex-row items-center w-full mt-5">
          <Text className="w-1/2 font-bold">Stored Qty</Text>
          <View className="flex-row items-center ">
            <TextInput
              className="w-24 text-center"
              style={styles.filterInput}
              placeholder="0"
              placeholderTextColor="#b0b0b0"
              value={search}
              onChangeText={setSearch}
            />
            <Text className="font-bold">{item?.invuseline[0].wms_unit}</Text>
          </View>
        </View>
        <View className="flex-row items-center w-full mt-5">
          <Text className="w-1/2 font-bold">Pick Qty</Text>
          <View className="flex-row items-center ">
            <TextInput
              className="w-24 text-center"
              style={styles.filterInput}
              placeholder="0"
              placeholderTextColor="#b0b0b0"
              value={search}
              onChangeText={setSearch}
            />
            <Text className="font-bold">{item?.invuseline[0].wms_unit}</Text>
          </View>
        </View>

        <View className="flex-row items-center w-full mt-5">
          <Text className="w-1/2 font-bold">Sugesstion Bin</Text>
          <View className="w-1/2 py-2 ">
            <Text className="font-bold text-center ">
              {item?.invuseline[0].frombin}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center w-full mt-5">
          <Text className="w-1/2 font-bold">Sugesstion Bin</Text>
          <View className="w-1/2 py-2 bg-gray-200">
            <Text className="font-bold text-center ">
              {suggestedBin.binnum}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center w-full mt-5">
          <Text className="w-1/2 font-bold">User Type</Text>
          <View className="w-1/2 py-2 bg-gray-200">
            <Text className="font-bold text-center ">
              {item?.invuseline[0].wms_usetype}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="ADD"
          size="large"
          color="primary"
          onPress={() => navigation.navigate('Detail Wo')}
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

export default PickItemScreen;
