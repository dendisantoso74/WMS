import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from '../compnents/Icon';
import {useNavigation} from '@react-navigation/native';
import MenuCard from '../compnents/MenuCard';
import {StyleSheet} from 'react-native';

const HomeWMSScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{paddingBottom: 24}}>
        {/* Header Section */}
        <View className="px-2 pt-6 pb-4 bg-white">
          <Text className="text-xl font-bold text-gray-900">
            Welcome Back, User Name
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-base text-gray-700">
                Site: TJB56 <Text className="font-bold">Org: BJS</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeSiteScreen')}>
              <Text className="font-semibold text-blue-500">Change Site</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              onPress={() => navigation.navigate('Transfer Instruction')}
              title="Open Transfer Instruction"
              count={0}
              icon="arrow-up-right"
              color="bg-yellow-400"
              textColor="text-white"
            />
            <MenuCard
              onPress={() => navigation.navigate('My Transfer Instruction')}
              title="My Transfer Instruction"
              count={0}
              icon="file-text"
              color="bg-green-600"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Menu Options have 3 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3 ">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              className="flex-row w-1/2 space-x-3 bg-blue-400"
              onPress={() => navigation.navigate('Material Receive')}
              style={styles.roundedCard}>
              <View className="py-3">
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
              className="flex-1 bg-white shadow"
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

            <TouchableOpacity
              className="flex-1 bg-white shadow rounded-xl"
              onPress={() => navigation.navigate('Po to Tag')}>
              <View className="py-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="tag" size={24} />
                  <Text className="mr-4 text-lg font-bold ">0</Text>
                </View>

                <Text className="p-1 ml-5 font-bold text-nowrap">Tag</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              onPress={() => navigation.navigate('Material Issue Scan')}
              className="px-3"
              title="Material Issue"
              // count={0}
              icon="upload"
              color="bg-red-400"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Menu Options have 2 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              className="w-1/2 bg-blue-400 shadow"
              style={styles.roundedCard}
              onPress={() => navigation.navigate('Material Return Scan')}>
              <View className="py-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="home" color="white" size={24} />
                  <Text className="mr-4 text-lg font-bold text-white">0</Text>
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
                  <Text className="mr-4 text-lg font-bold">0</Text>
                </View>

                <Text className="p-1 font-bold text-center text-nowrap">
                  Putaway
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-2 mt-4 space-y-3">
          {/* Top Row */}
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              onPress={() => navigation.navigate('Stock Opname List')}
              className="px-3"
              title="Stock Opname"
              count={0}
              icon="archive"
              color="bg-orange-400"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Menu Options have 2 menu in 1 line */}
        <View className="px-2 mt-4 space-y-3">
          <View className="flex-row space-x-3" style={styles.shadowCard}>
            <TouchableOpacity
              className="w-1/2 shadow bg-gray-950"
              onPress={() => navigation.navigate('RegisterRFID')}
              style={styles.roundedCard}>
              <View className="py-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="cast" color="white" size={24} />
                  <Text className={'text-lg font-bold mr-4 text-white'}>0</Text>
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
              className={'w-1/2 shadow bg-pink-400'}
              style={styles.roundedCard}>
              <View className="py-3">
                <View className="flex-row justify-between px-4 mb-3">
                  <Icon library="Feather" name="cast" color="white" size={24} />
                  <Text className={'text-lg font-bold mr-4 text-white'}>0</Text>
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
          <View className="flex-row gap-2 space-x-3">
            <MenuCard
              className="px-3"
              title="Material Movement"
              // count={0}
              icon="move"
              color="bg-green-400"
              textColor="text-white"
              onPress={() => navigation.navigate('Material Movement')}
            />
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
              color="bg-cyan-400"
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
