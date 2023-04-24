import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';

const SocialButton = ({BgColor, img, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.BtnColor, {backgroundColor: BgColor ? BgColor : '#fff'}]}>
      <Image
        style={styles.img}
        source={img ? img : require('../../assets/apple.png')}
      />
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  BtnColor: {
    width: 50,
    height: 50,
    borderRadius: h('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
});
