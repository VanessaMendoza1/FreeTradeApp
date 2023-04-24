import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';

const Appbutton = ({text, onPress, Deletes, CustomWidth}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.MainContainer,
        {
          width: CustomWidth ? CustomWidth : '90%',
          backgroundColor: Deletes ? '#FF2D2D' : Colors.Primary,
        },
      ]}>
      <Text style={styles.BtnText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Appbutton;

const styles = StyleSheet.create({
  MainContainer: {
    width: '90%',
    height: h('7%'),
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
});
