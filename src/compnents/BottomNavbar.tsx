import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BottomNavBar = (props: any) => {
  const handleCameraPress = () => {
    props.props.navigation.navigate('ScanCamera'); // Assuming you have a ScanCamera screen
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem}>
        <FontAwesome name="home" size={24} color="#5D5FEF" />
        <Text style={[styles.navText, styles.activeText]}>Home</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.navItem}>
        <FontAwesome name="search" size={24} color="#777" />
        <Text style={styles.navText}>Search</Text>
      </TouchableOpacity> */}

      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => handleCameraPress()}>
          <FontAwesome name="camera" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity style={styles.navItem}>
        <FontAwesome name="history" size={24} color="#777" />
        <Text style={styles.navText}>History</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.navItem}>
        <FontAwesome name="user" size={24} color="#777" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    minHeight: 75,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#777',
  },
  activeText: {
    color: '#5D5FEF',
  },
  centerButtonWrapper: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 30,
    backgroundColor: '#344CB7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,
  },
});

export default BottomNavBar;
