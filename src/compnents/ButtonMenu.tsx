import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Icon from './Icon';
import {isTablet} from '../utils/helpers';

interface ButtonMenuProps {
  navigation: any;
  navigateTo: string;
  iconLibrary: 'Feather' | 'FontAwesome';
  iconName: string;
  iconColor?: string;
  iconStyle?: ViewStyle;
  text: string;
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  disabled?: boolean;
}

const ButtonMenu: React.FC<ButtonMenuProps> = ({
  navigation,
  navigateTo,
  iconLibrary,
  iconName,
  iconColor = '#578FCA',
  iconStyle,
  text,
  textStyle,
  buttonStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.itemMenu,
        buttonStyle,
        disabled && styles.disabledButton, // Apply disabled style conditionally
      ]}
      onPress={() => !disabled && navigation.navigate(navigateTo)} // Disable onPress if disabled
      activeOpacity={disabled ? 1 : 0.7} // Disable opacity change if disabled
    >
      <Icon
        library={iconLibrary}
        name={iconName}
        color={iconColor}
        style={[styles.icon, iconStyle]}
      />
      <Text
        style={[styles.text, textStyle]}
        numberOfLines={1} // Ensure text is always one line
        // ellipsizeMode="tail" // Truncate text with ellipsis if too long
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemMenu: {
    width: '40%',
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Change background color when disabled
  },
  icon: {
    fontSize: isTablet() ? 50 : 30,
    marginBottom: 10,
  },
  text: {
    fontSize: isTablet() ? 16 : 11,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ButtonMenu;
