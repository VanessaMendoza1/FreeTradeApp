import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../utils/icons';

const SettingItem = ({text, children, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.IconContaineer}>{children}</View>
      <View style={styles.MiddleContaineer}>
        <Text style={styles.mainText}>{text}</Text>
      </View>
      {/* <View style={styles.ArrowContaineer}>
        <Icon name="arrow-forward-outline" size={30} color={Colors.Primary} />
      </View> */}
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: h('7.5%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    marginTop: h('1%'),
  },
  IconContaineer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  MiddleContaineer: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'purple',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  ArrowContaineer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
});
