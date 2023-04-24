import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';

const NotificationHead = ({data, onPress}) => {
  console.warn(data.text);
  return (
    <TouchableOpacity onPress={onPress} style={styles.MessageContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.ProfileContainer}>
          <Icon name="notifications" size={30} color={Colors.Primary} />
        </View>
      </View>
      <View style={styles.RightContainer}>
        <Text style={styles.nameText}>{data.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationHead;

const styles = StyleSheet.create({
  MessageContainer: {
    width: '95%',
    height: h('7%'),
    borderBottomWidth: h('0.2%'),
    borderBottomColor: '#0002',
    flexDirection: 'row',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  leftContainer: {
    width: '12%',
    height: '100%',
    // backgroundColor: 'gold',
  },
  RightContainer: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'gold',
  },
  ProfileContainer: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 65,
    height: 65,
    borderRadius: 1000 / 2,
    backgroundColor: '#0008',
    overflow: 'hidden',
  },
  nameText: {
    color: '#0008',
    fontSize: h('2%'),
  },
  nameText2: {
    color: '#0007',
    fontSize: h('2%'),
  },
});
