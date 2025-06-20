import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {storeData} from '../utils/store';
import {useNavigation} from '@react-navigation/native';

const DATA = [
  {id: '1', name: 'TJB56', position: 'BJS'},
  {id: '2', name: 'BJPHO', position: 'BJP'},
];

const ChangeSiteScreen = () => {
  const navigation = useNavigation<any>();
  const handlePress = async item => {
    storeData('site', item.name);
    storeData('org', item.position);

    navigation.navigate('HomeWMS');
  };

  const renderItem = ({item}: {item: (typeof DATA)[0]}) => (
    <TouchableOpacity
      onPress={() => {
        handlePress(item);
      }}
      style={styles.card}>
      <View className="flex-row ">
        <Text>Site</Text>
        <Text style={styles.name}>: {item.name}</Text>
      </View>
      <View className="flex-row ">
        <Text>Org</Text>
        <Text style={styles.position}>: {item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#22223b',
    marginLeft: 12,
  },
  position: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
    marginLeft: 12,
  },
});

export default ChangeSiteScreen;
