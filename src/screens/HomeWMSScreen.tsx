import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from '../compnents/Icon';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MenuCard from '../compnents/MenuCard';
import {StyleSheet} from 'react-native';
import {getPersonByLoginId} from '../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PreventBackNavigate from '../utils/preventBack';

const HomeWMSScreen = () => {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = React.useState(null);
  const [site, setSite] = React.useState<string | null>(null);
  const [org, setOrg] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (user) {
      const res = await getPersonByLoginId(user);
      setUserData(res.member[0]);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const siteAsync = await AsyncStorage.getItem('site');
      const orgAsync = await AsyncStorage.getItem('org');
      const userAsync = await AsyncStorage.getItem('user');
      console.log('asyn name', userAsync);
      setUser(userAsync);
      setSite(siteAsync);
      setOrg(orgAsync);
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  // On mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // When user changes, fetch user data
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    await fetchUserData();
    setRefreshing(false);
  }, [fetchData, fetchUserData]);

  useEffect(() => {
    // This is where you can add any setup code, like fetching user data
    // or initializing services.
    getPersonByLoginId(user).then(res => {
      // Handle the response from getPersonByLoginId;
      setUserData(res.member[0]);
    });
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'NEW WMS',
          'Are you sure want to exit this app?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Exit', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: true},
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* <PreventBackNavigate /> */}
      <ScrollView
        contentContainerStyle={{paddingBottom: 24}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header Section */}
        <View className="px-2 pt-6 pb-4 bg-white">
          {userData ? (
            <>
              <Text className="text-xl font-bold text-gray-900">
                Welcome Back,{' '}
                {userData?.firstname
                  ? userData?.firstname
                  : userData?.displayname}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-gray-900">
                Welcome Back,{' '}
                <View className="w-20 h-4 mb-2 bg-gray-200 rounded-md animate-pulse" />
              </Text>
            </>
          )}

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-base text-gray-700">
                Site:{' '}
                {site ? (
                  site
                ) : (
                  <>
                    <View className="w-20 h-3 mb-2 bg-gray-200 rounded-md animate-pulse" />
                  </>
                )}{' '}
                <Text className="font-bold">
                  Org:{' '}
                  {org ? (
                    org
                  ) : (
                    <>
                      <View className="w-20 h-3 mb-2 bg-gray-200 rounded-md animate-pulse" />
                    </>
                  )}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeSiteScreen')}>
              <Text className="font-semibold text-blue-500">Change Site</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        {site === 'TJB56' && (
          <View className="px-2 mt-4 space-y-3">
            {/* Top Row */}
            <View className="flex-row gap-2 space-x-3">
              <MenuCard
                onPress={() => navigation.navigate('Transfer Instruction')}
                title="Open Transfer Instruction"
                // count={0}
                icon="arrow-up-right"
                color="bg-yellow-400"
                textColor="text-white"
              />
              <MenuCard
                onPress={() => navigation.navigate('My Transfer Instruction')}
                title="My Transfer Instruction"
                // count={0}
                icon="file-text"
                color="bg-green-600"
                textColor="text-white"
              />
            </View>
          </View>
        )}

        {/* Menu Options have 3 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3 ">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              className="flex-row w-1/2 space-x-3 bg-blue-700"
              onPress={() => navigation.navigate('Material Receive')}
              style={styles.roundedCard}>
              <View className="py-3 ml-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon
                    library="Feather"
                    name="download"
                    color="white"
                    size={24}
                  />
                  {/* <Text className={'text-lg font-bold mr-4 text-white'}>0</Text> */}
                </View>

                <Text className="p-1 font-bold text-white text-nowrap">
                  Material Receive
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white shadow rounded-xl"
              onPress={() => navigation.navigate('Inspection')}>
              <View className="py-3">
                <View className="flex-row justify-center px-4 mb-3">
                  <Icon library="Feather" name="check" size={24} />
                </View>

                <Text className={'font-bold p-1 text-center text-nowrap '}>
                  Inspection
                </Text>
              </View>
            </TouchableOpacity>

            {site === 'TJB56' && (
              <TouchableOpacity
                className="flex-1 bg-white shadow rounded-xl"
                onPress={() => navigation.navigate('Po to Tag')}>
                <View className="py-3">
                  <View className="flex-row justify-between px-4 mb-3">
                    <Icon library="Feather" name="tag" size={24} />
                    {/* <Text className="mr-4 text-lg font-bold ">0</Text> */}
                  </View>

                  <Text className="p-1 ml-5 font-bold text-nowrap">Tag</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu Options */}
        {site === 'TJB56' && (
          <View className="px-2 mt-4 space-y-3">
            {/* Top Row */}
            <View className="flex-row gap-2 space-x-3">
              <MenuCard
                onPress={() => navigation.navigate('Material Issue Scan')}
                className="px-3"
                title="Material Issue"
                // count={0}
                icon="upload"
                color="bg-red-600"
                textColor="text-white"
              />
            </View>
          </View>
        )}

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              className="px-3"
              title="Material Movement"
              // count={0}
              icon="move"
              color="bg-green-500"
              textColor="text-white"
              onPress={() => navigation.navigate('Material Movement')}
            />
          </View>
        </View>

        {/* Menu Options have 2 menu in 1 line */}
        {site === 'TJB56' && (
          <View className="px-2 mt-4 space-y-3">
            <View className="flex-row space-x-3" style={styles.shadowCard}>
              <TouchableOpacity
                className="w-1/2 bg-purple-700 shadow"
                style={styles.roundedCard}
                onPress={() => navigation.navigate('Material Return Scan')}>
                <View className="py-3 ml-3">
                  <View className="flex-row justify-between px-4 mb-3">
                    <Icon
                      library="Feather"
                      name="home"
                      color="white"
                      size={24}
                    />
                    {/* <Text className="mr-4 text-lg font-bold text-white">0</Text> */}
                  </View>

                  <Text className={'font-bold p-1 text-nowrap text-white'}>
                    Material Return
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white shadow rounded-xl"
                onPress={() => navigation.navigate('Scan WO Number')}>
                <View className="py-3">
                  <View className="flex-row justify-center px-4 mb-3">
                    <Icon library="Feather" name="tag" size={24} />
                    {/* <Text className="mr-4 text-lg font-bold">0</Text> */}
                  </View>

                  <Text className="p-1 font-bold text-center text-nowrap">
                    Putaway
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              onPress={() => navigation.navigate('Stock Opname List')}
              className="px-3"
              title="Stock Opname"
              // count={0}
              icon="archive"
              color="bg-orange-600"
              textColor="text-white"
              // disabled={true}
            />
          </View>
        </View>

        {/* Menu Options have 2 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              className="w-1/2 bg-gray-800 shadow"
              onPress={() => navigation.navigate('RegisterRFID')}
              style={styles.roundedCard}>
              <View className="py-3 ml-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="cast" color="white" size={24} />
                  {/* <Text className={'text-lg font-bold mr-4 text-white'}>0</Text> */}
                </View>

                <Text className="p-1 font-bold text-white text-nowrap">
                  Register RFID
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('TagBin')}
              className={'flex-1 rounded-xl shadow bg-white'}>
              <View className="py-3">
                <View className="flex-row justify-center px-4 mb-3">
                  <Icon library="Feather" name="database" size={24} />
                </View>

                <Text className="p-1 font-bold text-center text-nowrap">
                  Tag Bin
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options have 2 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('RetagingItem')}
              className={'w-1/2 shadow bg-red-400'}
              style={styles.roundedCard}>
              <View className="py-3 ml-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="cast" color="white" size={24} />
                  {/* <Text className={'text-lg font-bold mr-4 text-white'}>0</Text> */}
                </View>

                <Text className={'font-bold p-1 text-nowrap text-white'}>
                  Retagging Item
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('RetagingBin')}
              className={'flex-1 rounded-xl shadow bg-white'}>
              <View className="py-3">
                <View className="flex-row justify-center px-4 mb-3">
                  <Icon library="Feather" name="database" size={24} />
                </View>

                <Text className="p-1 font-bold text-center text-nowrap">
                  Retagging Bin
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3 bg-">
            <MenuCard
              className="px-3"
              title="Tag Info"
              // count={0}
              icon="cast"
              color="bg-cyan-500"
              textColor="text-white"
              onPress={() => navigation.navigate('TagInfo')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8, // for Android
    borderRadius: 11, // match your rounded-xl
    backgroundColor: '#fff', // ensure background for shadow
    marginVertical: 4,
  },
  roundedCard: {
    borderTopLeftRadius: 11, // top-left corner
    borderBottomLeftRadius: 11, // bottom-left corner
  },
});

export default HomeWMSScreen;
