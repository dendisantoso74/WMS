import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {formatDateTime} from '../../utils/helpers';
import {Text} from 'react-native';

const InstructionItem = React.memo(
  ({item, onPress}: {item: any; onPress: () => void}) => (
    <TouchableOpacity style={styles.rfidCard} onPress={onPress}>
      <View>
        <View className="my-2">
          <Text className="px-4 font-bold">{item.wms_ponum}</Text>
          <Text className="px-4">{item.invusenum}</Text>
          <Text className="px-4">{item.fromstoreloc}</Text>
          <Text className="px-4">{formatDateTime(item.statusdate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ),
);

const styles = {
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
    // paddingVertical: 18,
    // paddingHorizontal: 16,
    paddingRight: 16,
  },
};

export default InstructionItem;
