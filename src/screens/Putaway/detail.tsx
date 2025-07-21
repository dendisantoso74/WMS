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
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../../compnents/Icon';
import ButtonApp from '../../compnents/ButtonApp';
import {formatDateTime} from '../../utils/helpers';

const dummyRfids = ['00000000000000000000'];

const PutawayMaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {item} = route.params;
  console.log('item from params:', item);

  const [rfids, setRfids] = useState(dummyRfids);
  const [search, setSearch] = useState('');

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.rfidCard}
      // onPress={() => navigation.navigate('Scan Material')}
    >
      <View style={[styles.sideBar, {backgroundColor: 'blue'}]} />
      <View className="flex-col w-10/12 my-1">
        <View className="flex-row justify-between">
          <Text className="font-bold">
            {item.invuseline ? item.invuseline[0]?.itemnum : '-'}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-bold">
            {item.invuseline ? item.invuseline[0]?.description : '-'}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-bold text-left ">
            {item.invuseline ? item.invuseline[0]?.frombin : '-'}
          </Text>
          <Text className="text-right ">Return</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-bold text-left ">
            {item.invuseline ? item.invuseline[0]?.fromconditioncode : '-'}
          </Text>
          <Text className="text-right ">
            {item.invuseline ? item.invuseline[0]?.quantity : '-'}{' '}
            {item.invuseline ? item.invuseline[0]?.wms_unit : '-'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-row p-2 bg-blue-400">
        <View>
          <Text className="font-bold text-white">WO Number</Text>
          <Text className="font-bold text-white">WO Date</Text>
        </View>
        <View>
          <Text className="ml-10 font-bold text-white">{item.wonum}</Text>
          <Text className="ml-10 font-bold text-white">
            {formatDateTime(item.statusdate)}
          </Text>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Enter Material Code or Material Name"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
        <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 12, top: 12}}
        />
      </View>
      <FlatList
        data={item.invuse}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="COMPLETE"
          size="large"
          color="primary"
          onPress={() => navigation.navigate('')}
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

export default PutawayMaterialScreen;
