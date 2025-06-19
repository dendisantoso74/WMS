import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';

const TagInfoDetailScreen = () => {
  // Dummy data for preview
  const tagCode = 'E2000020340A0144042071E8';
  const serialNumber = '3070657A5C9BE8CF69108DC3';
  const itemNumber = 'FHQ125DAVMA_FILTER';
  const itemName = 'Air Filter - FHQ125DAVMA_Filter';
  const storedQty = '5.0';
  const issueUnit = 'SET';
  const bin = 'MS-A1L-4-3-2-1';

  const handleUpdate = () => {
    // TODO: Implement update logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Text style={styles.label}>Tag Code</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={tagCode}
              editable={false}
              placeholder="Tag Code"
              placeholderTextColor="#b0b0b0"
            />
            <Text style={styles.label}>Serial Number</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={serialNumber}
              editable={false}
              placeholder="Serial Number"
              placeholderTextColor="#b0b0b0"
            />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Item Number</Text>
              <Text style={styles.infoValue}>{itemNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Item Name</Text>
              <Text style={styles.infoValue}>{itemName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stored Qty</Text>
              <Text style={styles.infoValue}>{storedQty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Issue Unit</Text>
              <Text style={styles.infoValue}>{issueUnit}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bin</Text>
              <Text style={styles.infoValue}>{bin}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{bin}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Condition Code</Text>
              <View style={styles.conditionBox}>
                <Text style={styles.conditionText}>NEW</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Remark</Text>
              <TextInput
                style={[styles.input, styles.remarkInput]}
                value={'-'}
                // editable={false}
                multiline
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainerFixed}>
          <ButtonApp
            label="Update"
            onPress={handleUpdate}
            size="large"
            color="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    marginTop: 10,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#b0b0b0',
    marginBottom: 8,
    // backgroundColor: '#f8f9fa',
  },
  disabledInput: {
    color: '#b0b0b0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    color: '#222',
    fontSize: 15,
    flex: 1.5,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  buttonContainerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  conditionBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // backgroundColor: '#e7f0ff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 100,
    width: '60%',
    // textAlign: 'left',
  },
  conditionText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 15,
  },
  remarkInput: {
    height: 60,
    textAlignVertical: 'center',
    width: '60%',
  },
});

export default TagInfoDetailScreen;
