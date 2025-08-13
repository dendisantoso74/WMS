import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ButtonApp from '../../compnents/ButtonApp';
import Icon from '../../compnents/Icon';
import {useNavigation} from '@react-navigation/native';
import {getListRfid} from '../../services/registerRfid';

const RegisterRfidScreen = () => {
  const navigation = useNavigation<any>();

  const [rfids, setRfids] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  // Update fetchRfids to keep all object data
  const fetchRfids = async (page: number) => {
    setLoading(true);
    try {
      const res = await getListRfid(pageSize, page);
      const newRfids = Array.isArray(res.member) ? res.member : [];
      setRfids(prev =>
        page === 1
          ? newRfids
          : [
              ...prev,
              ...newRfids.filter(
                (item: any) =>
                  !prev.some(
                    (prevItem: any) => prevItem.tagcode === item.tagcode,
                  ),
              ),
            ],
      );
      setHasMore(newRfids.length === pageSize);
    } catch (e) {
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleRegisterNew = () => {
    navigation.navigate('AddRFID');
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchRfids(nextPage);
    }
  };

  // Update renderItem to use object properties
  const renderItem = ({item}: {item: any}) => {
    let sideBarColor = 'gray';
    if (item.status_description === 'Assigned') sideBarColor = '#A4DD00';
    else if (item.status_description === 'Broken') sideBarColor = 'red';
    else if (item.status_description === 'Blank') sideBarColor = 'gray';

    return (
      <View style={styles.rfidCard}>
        <View style={[styles.sideBar, {backgroundColor: sideBarColor}]} />
        <Text style={styles.rfidText}>{item.tagcode}</Text>
        {/* <Text style={styles.rfidText}>{item.status_description}</Text> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={rfids}
        renderItem={renderItem}
        keyExtractor={item => item.wms_rfidid?.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator className="mt-1" size="large" color="#3674B5" />
          ) : null
        }
      />
      <View style={styles.buttonContainer}>
        <ButtonApp
          label="REGISTER NEW RFID"
          onPress={handleRegisterNew}
          size="large"
          color="primary"
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
});

export default RegisterRfidScreen;
