import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RadioGroup from 'react-native-radio-buttons-group';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CheckBox from 'react-native-checkbox';
import {isMobile} from '../utils/helpers';
interface InputAppProps {
  type: 'text' | 'number' | 'checkbox' | 'radio' | 'dropdown' | 'textarea';
  value: any;
  onChange: (value: any) => void;
  options?: {label: string; value: any}[]; // For radio and dropdown
  label?: string; // Optional label for the input
  style?: ViewStyle | TextStyle; // Custom style for the input
  sub?: boolean; //
  selected?: any; // For radio and dropdown
  disabled?: boolean; // Add disabled prop
  unit?: string;
}

const InputApp: React.FC<InputAppProps> = ({
  type,
  value,
  onChange,
  options = [],
  label,
  style,
  sub,
  selected,
  disabled,
  unit,
}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleTextChange = (text: string) => {
    // Allow only numbers, -, +, and .
    const filteredText = text.replace(/[^0-9+\-\.]/g, '');
    onChange(filteredText);
  };

  const renderInput = () => {
    switch (type.toLocaleLowerCase()) {
      case 'text':
        return (
          <TextInput
            style={[styles.input, style]}
            value={value}
            onChangeText={onChange}
            placeholder="Enter text"
            editable={!disabled} // Apply disabled prop
          />
        );
      case 'number':
        return (
          <>
            {/* <TextInput
              style={[styles.input, style]}
              value={value}
              onChangeText={onChange}
              placeholder="Enter number"
              keyboardType="numeric"
              editable={!disabled} // Apply disabled prop
            /> */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputNumber, style]}
                placeholder="Enter number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={handleTextChange}
                editable={!disabled}
              />
              {unit && <Text style={styles.unit}>{unit}</Text>}
            </View>
          </>
        );
      case 'checkbox':
        return (
          <View style={[styles.checkboxContainer, style]}>
            {options.map((option, index) => (
              <View style={styles.checkbox} key={index}>
                {/* <CheckBox
                  disabled={disabled} // Apply disabled prop
                  value={value}
                  onValueChange={onChange}
                /> */}
                <CheckBox
                  label={option.label}
                  checked={toggleCheckBox}
                  onChange={checked => {
                    console.log(checked),
                      setToggleCheckBox(!toggleCheckBox),
                      onChange(!checked);
                  }}
                />
                {/* <Text style={styles.checkboxLabel}>{option.label}</Text> */}
              </View>
            ))}
          </View>
        );
      case 'radio':
        return (
          <View pointerEvents={disabled ? 'none' : 'auto'}>
            <RadioGroup
              radioButtons={options.map((option, index) => ({
                id: option.id,
                label: option.label,
                value: option.value,
                size: isMobile() ? 16 : 28,
                labelStyle: {
                  fontSize: isMobile() ? 10 : 16,
                },
              }))}
              onPress={onChange}
              selectedId={value}
              containerStyle={[styles.radio, style]}
            />
          </View>
        );
      case 'dropdown':
        return (
          <Dropdown
            style={[styles.dropdown, style]}
            data={options}
            labelField="label"
            valueField="id"
            placeholder="Select option"
            value={value} // to set default value
            onChange={item => {
              onChange(item.id);
            }}
            disable={disabled} // Apply disabled prop
          />
        );
      case 'textarea':
        return (
          <TextInput
            style={[styles.textArea, style]}
            value={value}
            onChangeText={onChange}
            placeholder="Enter text"
            multiline
            numberOfLines={4}
            editable={!disabled} // Apply disabled prop
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      {renderInput()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '50%',
  },
  inputNumber: {
    // height: 40,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // paddingHorizontal: 10,
    width: isMobile() ? '50%' : '40%',
    textAlign: 'center',
    fontSize: isMobile() ? 10 : 16,
  },
  textArea: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: '95%',
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dropdown: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 12,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  radio: {
    flexDirection: 'row',
    paddingVertical: hp('0.5%'),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // paddingHorizontal: 10,
    paddingVertical: isMobile() ? 0 : 2,
    // maxWidth: '100%',
  },
  unit: {
    margin: 0,
    padding: 0,
    width: isMobile() ? '15%' : '10%',
    textAlign: 'center',
    fontSize: isMobile() ? 10 : 12,
    flexShrink: 1,
  },
});

export default InputApp;
