import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from './Icon';

type MenuCardProps = {
  title: string;
  icon: string;
  count?: number;
  color: string;
  textColor: string;
  className?: string;
  iconColor?: string;
  onPress?: () => void;
};

const MenuCard = ({
  title,
  icon,
  count,
  color,
  textColor,
  className = '',
  iconColor = 'white',
  onPress,
}: MenuCardProps) => (
  <TouchableOpacity
    className={`flex-1 rounded-xl ${color} ${className}`}
    style={styles.shadow}
    onPress={onPress}>
    <View className="py-3">
      <View className="flex-row justify-between px-4 mb-3">
        <Icon library="Feather" name={icon} color={iconColor} size={24} />
        {typeof count === 'number' && (
          <Text className={`text-lg font-bold mr-4 ${textColor}`}>{count}</Text>
        )}
      </View>

      <Text className={`font-bold p-1 text-nowrap ${textColor}`}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
};

export default MenuCard;
