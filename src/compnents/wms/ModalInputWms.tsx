import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

type ModalInputWmsProps = {
  visible: boolean;
  material: string;
  orderQty: string | number;
  remainingQty: string | number;
  total?: number;
  orderunit?: string;
  onClose: () => void;
  onReceive: (total: number) => void;
};

const ModalInputWms: React.FC<ModalInputWmsProps> = ({
  visible,
  material,
  orderQty,
  remainingQty,
  total,
  orderunit,
  onClose,
  onReceive,
}) => {
  const [count, setCount] = useState(total);
  console.log('ModalInputWms count:', remainingQty);

  // Reset count when modal is closed or opened with a new total
  useEffect(() => {
    if (!visible) {
      setCount(0);
    } else {
      setCount(remainingQty);
    }
  }, [visible, total]);

  const handleDecrease = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleInputChange = (text: string) => {
    // Only allow numbers, fallback to 0 if empty or invalid
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    const max = Number(remainingQty);
    if (isNaN(num)) {
      setCount(0);
    } else if (num > max) {
      setCount(max);
    } else {
      setCount(num);
    }
  };

  const handleReceive = () => {
    onReceive(count);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.row}>
              <Text style={styles.label}>Material</Text>
              <Text style={styles.value} numberOfLines={1}>
                {material}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Order Qty</Text>
              <Text style={styles.value}>
                {orderQty} {orderunit ? orderunit : ''}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Remaining Qty</Text>
              <Text style={styles.value}>
                {remainingQty} {orderunit ? orderunit : ''}
              </Text>
            </View>
          </View>
          <View style={styles.counterRow}>
            <TouchableOpacity
              disabled={count === 0}
              style={styles.circleBtn}
              onPress={handleDecrease}>
              <Text style={styles.circleBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.countBox}>
              <TextInput
                style={styles.countText}
                value={count.toString()}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                textAlign="center"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              disabled={count >= remainingQty}
              style={styles.circleBtn}
              onPress={handleIncrease}>
              <Text style={styles.circleBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={count === 0}
            style={styles.receiveBtn}
            onPress={handleReceive}>
            <Text style={styles.receiveBtnText}>Receive Material</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#285a8d',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  value: {
    color: '#fff',
    fontSize: 15,
    maxWidth: 200,
    textAlign: 'right',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7eaf3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtnText: {
    fontSize: 28,
    color: '#285a8d',
    fontWeight: 'bold',
  },
  countBox: {
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#b0b0b0',
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  countText: {
    fontSize: 28,
    color: '#222',
    fontWeight: '500',
    padding: 0,
  },
  receiveBtn: {
    backgroundColor: '#285aee',
    borderRadius: 8,
    marginHorizontal: 40,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  receiveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ModalInputWms;
