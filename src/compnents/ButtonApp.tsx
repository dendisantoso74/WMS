import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {isExpired, isMobile, isTablet} from '../utils/helpers';
import {useAppContext} from '../context/AppContext';
import {clearAllData} from '../utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ButtonProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'danger';
  icon?: string; // Add icon prop
  isloading?: boolean;
}

const ButtonApp: React.FC<ButtonProps> = ({
  onPress,
  label,
  disabled = false,
  style,
  textStyle,
  size = 'medium',
  color = 'primary',
  icon,
  isloading = false,
}) => {
  const {setIsAuthenticated} = useAppContext();
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      case 'medium':
      default:
        return styles.medium;
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'secondary':
        return styles.secondary;
      case 'danger':
        return styles.danger;
      case 'primary':
      default:
        return styles.primary;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const resUser = await AsyncStorage.getItem('user');
        await AsyncStorage.getItem('user').then(user => {
          const expired = isExpired(JSON.parse(user)?.exp);
          if (expired) {
            clearAllData();
            setIsAuthenticated(false);
            Alert.alert('Logout', 'Your Session is Expired.');
          }
        });
      } catch (error) {
        console.warn('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getSizeStyle(),
        getColorStyle(),
        style,
        disabled && styles.disabled,
      ]}>
      <View style={styles.content}>
        {icon && (
          <FontAwesome
            name={icon}
            size={24}
            color="white"
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, textStyle]}>
          {isloading ? (
            <>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            </>
          ) : (
            label
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: isMobile() ? 12 : 18,
    // margin: 5,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    minWidth: 100,
  },
  text: {
    color: 'white',
    fontSize: isTablet() ? 18 : 12,
    fontWeight: 'bold',
  },
  small: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  medium: {
    paddingVertical: isTablet() ? 15 : 10,
    paddingHorizontal: isTablet() ? 20 : 15,
  },
  large: {
    paddingVertical: isTablet() ? 15 : 10,
    paddingHorizontal: isTablet() ? 30 : 25,
  },
  primary: {
    backgroundColor: '#3674B5',
  },
  secondary: {
    backgroundColor: '#BCCCDC',
  },
  danger: {
    backgroundColor: '#E52020',
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ButtonApp;
