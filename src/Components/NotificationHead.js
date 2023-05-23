import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import Icons from "../utils/icons"
import firestore from '@react-native-firebase/firestore';

const NotificationHead = ({data, onPress, notifications, setNotifications}) => {
  const deleteNotification = (notificationId) => {
    firestore()
    .collection('Notification')
    .doc(notificationId)
    .delete(null)
    .then(() => {
      let remainingNotifications = notifications.filter((item) => item.id != notificationId)
      setNotifications(remainingNotifications)
    })
    .catch(err => console.log(err));
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.MessageContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.ProfileContainer}>
          <Icon name="notifications" size={30} color={Colors.Primary} />
        </View>
      </View>
      <View style={styles.RightContainer}>
        <TouchableOpacity style={{
          alignSelf: "flex-end",
          marginRight: 10,
        }} onPress={() => deleteNotification(data.id)}>
          {Icons.CancelIcon({
              tintColor: 'red',
              width: 15,
              height: 15,
          })}
        </TouchableOpacity>
        <Text style={styles.nameText}>{data.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationHead;

const styles = StyleSheet.create({
  MessageContainer: {
    width: '95%',
    height: h('8%'),
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
    paddingTop: 10,
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
    fontSize: h('1.8%'),
  },
  nameText2: {
    color: '#0007',
    fontSize: h('1.8%'),
  },
});
