import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MAX_TRANSLATE_Y = SCREEN_HEIGHT - 100;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.26; // 30% of screen height

interface BottomSheetProps {
  onPressButton: () => void;
  buttonTitle: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  onPressButton,
  buttonTitle,
}) => {
  const pan = useRef(
    new Animated.ValueXY({x: 0, y: SCREEN_HEIGHT - 50}),
  ).current;
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // Initialize PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // If swiping up (negative velocity)
        if (gestureState.vy < -0.5 || gestureState.dy < -50) {
          openBottomSheet();
        }
        // If swiping down (positive velocity)
        else if (gestureState.vy > 0.5 || gestureState.dy > 50) {
          closeBottomSheet();
        }
        // Otherwise check position
        else {
          if ((pan.y as any)._value < SCREEN_HEIGHT / 2) {
            openBottomSheet();
          } else {
            closeBottomSheet();
          }
        }
      },
    }),
  ).current;

  const openBottomSheet = useCallback(() => {
    setIsOpen(true);
    Animated.spring(pan.y, {
      toValue: SCREEN_HEIGHT - MODAL_HEIGHT - insets.bottom - 80,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [pan.y]);

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false);
    Animated.spring(pan.y, {
      toValue: SCREEN_HEIGHT - 50,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [pan.y]);

  // Calculate bottom sheet transform
  const bottomSheetStyle = {
    transform: [{translateY: pan.y}],
  };

  return (
    <View>
      <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle]}>
        <View {...panResponder.panHandlers}>
          <View style={styles.handle}>
            <View style={styles.line} />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
          style={{flex: 1}}>
          <ScrollView
            style={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            {/* <Text style={styles.title}>Bottom Sheet Modal</Text> */}
            <View className="flex-col gap-3">
              <TextInput
                placeholder="Type here..."
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: '#fafafa',
                }}
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeBottomSheet}>
                <Text style={styles.closeButtonText}>Close Sheet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bottomButton}
                onPress={onPressButton}>
                <Text style={styles.buttonText}>{buttonTitle}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT + 28,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 10,
    height: 36,
  },
  line: {
    width: 60, // wider
    height: 8, // thicker
    backgroundColor: '#111', // black
    borderRadius: 8, // fully rounded
    marginTop: 0,
    marginBottom: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
  },
  bottomButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    marginTop: 10,
  },
});

export default BottomSheet;
