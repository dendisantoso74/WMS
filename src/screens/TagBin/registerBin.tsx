import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Pressable,
  ToastAndroid,
} from 'react-native';
import ModalApp from '../../compnents/ModalApp';
import {
  getBinUntagList,
  localSearchByBin,
  registerTagToBin,
} from '../../services/tagBin';
import Icon from '../../compnents/Icon';
import {generateSerialNumber} from '../../utils/helpers';
import {set} from 'lodash';

const RegisterBinScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;
  const Tag = listrfid[listrfid.length - 1];
  const [search, setSearch] = useState('');
  const [selectedBin, setSelectedBin] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [bins, setBins] = useState<any[]>([]); // Use dummy data for now
  const [serialNumbers, setSerialNumbers] = useState<string>(''); // Use dummy data for now

  const [allBins, setAllBins] = useState<any[]>([]); // Store all bins for local search

  useEffect(() => {
    getBinUntagList().then(data => {
      const binList = data.member || [];
      setAllBins(binList);
      setBins(binList); // Show all bins initially
    });
  }, []);

  useEffect(() => {
    // Local search by bin or tagcode
    setBins(localSearchByBin(allBins, search));
  }, [search, allBins]);

  const handleOnPress = async item => {
    setSelectedBin(item);
    setModalVisible(true);
    const SN = generateSerialNumber();
    setSerialNumbers(SN);
  };

  const handleConfirm = async () => {
    registerTagToBin(selectedBin?.wms_binid, Tag, serialNumbers)
      .then(res => {
        ToastAndroid.show(
          `Registered ${Tag} to ${selectedBin?.bin}`,
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      })
      .catch(err => {
        console.error('Error registering tag to bin:', err);
        ToastAndroid.show(
          `Failed to register ${Tag} to ${selectedBin?.bin}`,
          ToastAndroid.SHORT,
        );
      });
    // if (selectedBin) {
    //   ToastAndroid.show(
    //     `Registered ${Tag} to ${selectedBin?.bin}`,
    //     ToastAndroid.SHORT,
    //   );
    // }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text className="font-bold text-white">RFID TAG : </Text>
        <Text className="text-white">{Tag}</Text>
      </View>
      <View>
        <TextInput
          style={styles.filterInput}
          placeholder="Search Bin"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="characters"
        />
        <Icon
          library="Feather"
          name="search"
          size={20}
          color="#b0b0b0"
          style={{position: 'absolute', right: 20, top: 12}}
        />
      </View>
      <Text style={styles.sectionTitle}>BIN</Text>
      <FlatList
        data={bins}
        keyExtractor={item => item.bin}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.binCard,
              // selectedBin === item.bin && styles.selectedBinCard,
            ]}
            onPress={() => handleOnPress(item)}>
            <Text style={styles.binText}>BIN : {item.bin}</Text>
            <Text style={styles.binText}>RACK : {item.wms_rack}</Text>
            <Text style={styles.binText}>AREA : {item.wms_area}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={
          <View style={{alignItems: 'center', marginTop: 32}}>
            <Text style={{color: '#888'}}>No bins found.</Text>
          </View>
        }
      />
      {/* <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>TAG</Text>
      </Pressable> */}
      <ModalApp
        visible={modalVisible}
        title="Confirmation"
        content={`Are you sure you want to tag ${Tag} to bin ${selectedBin?.bin}?`}
        onClose={() => setModalVisible(false)}
        type="confirmation"
        onConfirm={() => {
          handleConfirm();
        }}
      />
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
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  headerRfid: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#222',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#222',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 80,
  },
  list: {
    flex: 1,
  },
  binCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  selectedBinCard: {
    borderColor: '#285a8d',
    borderWidth: 2,
  },
  binText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    margin: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
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

export default RegisterBinScreen;
