import React from 'react';
import {Modal, View, ActivityIndicator, StyleSheet, Text} from 'react-native';
// import * as Progress from 'react-native-progress';

interface LoadingProps {
  visible: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'loading' | 'upload';
  progress?: number; // Add progress prop
}

const Loading: React.FC<LoadingProps> = ({
  visible,
  text = 'Loading...',
  size = 'small',
  type = 'loading',
  progress = 0, // Default progress to 0
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // Required for Android
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {type === 'loading' ? (
            <ActivityIndicator size="large" color="#3674B5" />
          ) : (
            <Progress.Bar progress={progress} width={150} color="#3674B5" />
          )}
          {text && (
            <Text style={styles.loadingText}>
              {text}
              {type === 'upload' && ''}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200, // Increased width to accommodate progress bar
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Loading;
