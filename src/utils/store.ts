import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeyTypes} from './types';

export const storeData = async (key: StorageKeyTypes, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error to store data');
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

export const clearDataByKey = async (key: StorageKeyTypes) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data for key "${key}" cleared`);
  } catch (error) {
    console.error(`Error clearing data for key "${key}":`, error);
  }
};

export const clearDataByKeys = async (keys: StorageKeyTypes[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    console.log(`Data for keys "${keys.join(', ')}" cleared`);
  } catch (error) {
    console.error(`Error clearing data for keys "${keys.join(', ')}":`, error);
  }
};

export const clearDataLogout = async () => {
  const keys = [
    'userToken',
    'user',
    'my-key',
    'unitLevel',
    'totalUnitArea',
    'totalUnitAreaProgres',
    // 'shift',
  ];
  try {
    await AsyncStorage.multiRemove(keys);
    console.log(`Data for keys "${keys.join(', ')}" cleared`);
  } catch (error) {
    console.error(`Error clearing data for keys "${keys.join(', ')}":`, error);
  }
};

export const getData = async (key: StorageKeyTypes): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error(`Error getting data for key "${key}":`, e);
    return null;
  }
};
