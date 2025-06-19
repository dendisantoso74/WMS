import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {getStatusAndColor} from '../utils/helpers';

interface StatusBoxProps {
  value: number;
  min: number;
  max: number;
  style?: ViewStyle; // Add style prop
}

const StatusBox: React.FC<StatusBoxProps> = ({value, min, max, style}) => {
  const {status, color} = getStatusAndColor(value, min, max);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.box, {backgroundColor: color}]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff', // Ensure the text is visible on colored backgrounds
  },
  box: {
    width: 80,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
});

export default StatusBox;
