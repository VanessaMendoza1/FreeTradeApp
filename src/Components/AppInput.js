import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icons from "../utils/icons"

const AppInput = ({placeholder, Show, onChangeText}) => {
  const [hidden, setHidden] = useState(Show);
  return (
    <View style={styles.TxtBg}>
      <TextInput
        onChangeText={onChangeText}
        style={styles.InputContainer2}
        placeholder={placeholder}
        placeholderTextColor={'#fff'}
        secureTextEntry={hidden}
      />

      {/* {hidden ? (
        <TextInput
          onChangeText={onChangeText}
          style={styles.InputContainer2}
          placeholder={placeholder}
          placeholderTextColor={'#fff'}
          secureTextEntry={hidden}
        />
      ) : (
      <TextInput
          onChangeText={onChangeText}
          style={styles.InputContainer2}
          placeholder={placeholder}
          placeholderTextColor={'#fff'}
        />
      )} */}
      
      {Show && (
        <TouchableOpacity
          onPress={() => {
            setHidden(!hidden);
          }}
          style={styles.PasswordContainer}
        >
          {Icons.ToggleShowPasswordIcon({
            tintColor: 'white',
          })}
          {/* <Text style={styles.ShowCOor}>Show</Text> */}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  TxtBg: {
    width: '90%',
    height: h('7%'),
    marginTop: h('2%'),
    borderBottomColor: '#ffff',
    borderBottomWidth: h('0.2%'),
    flexDirection: 'row',
    // backgroundColor: '#fff',
  },
  InputContainer: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',

    color: '#fff',
    fontSize: h('2%'),
  },
  InputContainer2: {
    width: '85%',
    height: '100%',
    // backgroundColor: 'red',

    color: '#fff',
    fontSize: h('2%'),
  },
  PasswordContainer: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ShowCOor: {
    color: '#fff',
    fontSize: h('2%'),
  },
});
