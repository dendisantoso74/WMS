import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';

const DUMMY_RFID = '0000000000D9014000000022';
const DUMMY_BINS = [
  {bin: 'MS-A1L-4-3-3-1', rack: 'MS-A1L', area: 'MS-AREA'},
  {bin: 'MS-A1L-4-3-3-2', rack: 'MS-A1L', area: 'MS-AREA'},
  {bin: 'MS-A1L-4-3-4-1', rack: 'MS-A1L', area: 'MS-AREA'},
  {bin: 'MS-A1L-4-3-4-2', rack: 'MS-A1L', area: 'MS-AREA'},
];

const RegisterBinScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {listrfid} = route.params;
  const Tag = listrfid[listrfid.length - 1];
  const [search, setSearch] = useState('');
  const [selectedBin, setSelectedBin] = useState<string | null>(null);

  const filteredBins = DUMMY_BINS.filter(item =>
    item.bin.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RFID TAG</Text>
        <Text style={styles.headerRfid}>{Tag}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Bin"
          placeholderTextColor="#b0b0b0"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <Text style={styles.sectionTitle}>RFID</Text>
      <FlatList
        data={filteredBins}
        keyExtractor={item => item.bin}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.binCard,
              selectedBin === item.bin && styles.selectedBinCard,
            ]}
            onPress={() => setSelectedBin(item.bin)}>
            <Text style={styles.binText}>{item.bin}</Text>
            <Text style={styles.binText}>{item.rack}</Text>
            <Text style={styles.binText}>{item.area}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>TAG</Text>
      </Pressable>
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
    padding: 16,
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
});

export default RegisterBinScreen;
