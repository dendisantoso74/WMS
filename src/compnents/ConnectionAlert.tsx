import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const ConnectionAlert = () => {
  const [wifiOn, setWifiOn] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Subscribe to NetInfo for WiFi state
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state:', state);
      const isWifiConnected = state.type === 'wifi' && state.isConnected;
      setWifiOn(isWifiConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('WiFi status changed - wifiOn:', wifiOn);
    if (!wifiOn) {
      console.log('WiFi is off - showing alert');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      console.log('WiFi is on - hiding alert');
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [wifiOn]);

  console.log('Rendering alert - wifiOn:', wifiOn);

  if (wifiOn) return null;

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Text style={styles.text}>WiFi is turned off</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#d32f2f',
    padding: 12,
    zIndex: 9999,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ConnectionAlert;
