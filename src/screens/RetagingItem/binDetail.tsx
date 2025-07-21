import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

const BinDetailScreen = () => {
  const route = useRoute();
  const {item} = route.params as {item: any};

  const renderItem = item => {
    // Set sidebar color: green if fully received, otherwise gray
    const sideBarColor = 'blue';
    console.log('Item details:', item);

    return (
      <TouchableOpacity style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <View className="my-2">
          <View className="flex-row justify-between">
            <Text className="font-bold">{item.item.itemnum}</Text>

            <Text className="w-1/2 text-right">
              Qty: {item.item.qtystored} {item.item.unitserialized}
            </Text>
          </View>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            {item.item.description}
          </Text>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            Tag Code: {item.item.tagcode}
          </Text>
          <Text className="font-bold" style={[styles.maxWidthFullMinus8]}>
            Serial: {item.item.serialnumber}
          </Text>
          <View className="flex-row justify-between">
            <Text className="w-1/3 ml-3 text-lg font-bold">
              {item.item.conditioncode}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Bin: {item.bin}</Text>
      </View>
      {/* <Text style={styles.sectionTitle}>Serialized Items</Text> */}
      <FlatList
        data={item.wms_serializeditem}
        keyExtractor={si => si.wms_serializeditemid?.toString()}
        renderItem={renderItem}
        // {({item: si}) => (
        //   <View style={styles.serialItemCard}>
        //     <Text style={styles.serialTitle}>{si.serialnumber}</Text>
        //     <Text style={styles.serialDesc}>{si.description}</Text>
        //     <Text style={styles.serialInfo}>Item: {si.itemnum}</Text>
        //     <Text style={styles.serialInfo}>Qty Stored: {si.qtystored}</Text>
        //     <Text style={styles.serialInfo}>Condition: {si.conditioncode}</Text>
        //     <Text style={styles.serialInfo}>Tag: {si.tagcode}</Text>
        //     <Text style={styles.serialInfo}>PO: {si.ponum}</Text>
        //     <Text style={styles.serialInfo}>
        //       Last Modified: {si.datemodified}
        //     </Text>
        //   </View>
        // )}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: '#285a8d',
    padding: 8,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    // fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 14,
    marginTop: 2,
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
    padding: 12,
    paddingBottom: 80,
  },
  serialItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    padding: 16,
  },
  serialTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976D2',
  },
  serialDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  serialInfo: {
    fontSize: 13,
    color: '#555',
  },
  maxWidthFullMinus8: {
    maxWidth: 300,
    // marginRight: 8,
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
});
export default BinDetailScreen;
