import React from 'react';
import {ViewStyle} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface IconProps {
  library: 'Feather' | 'FontAwesome';
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const Icon: React.FC<IconProps> = ({
  library,
  name,
  size = 24,
  color = 'black',
  style,
}) => {
  if (library === 'Feather') {
    return <Feather name={name} size={size} color={color} style={style} />;
  } else if (library === 'FontAwesome') {
    return <FontAwesome name={name} size={size} color={color} style={style} />;
  } else {
    return null;
  }
};

export default Icon;
