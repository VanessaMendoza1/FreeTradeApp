import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import Icons from '../utils/icons';
import firestore from '@react-native-firebase/firestore';

const NotificationHead = ({data, onPress, notifications, setNotifications}) => {
  console.log(data?.image, 'data?.image');
  const deleteNotification = notificationId => {
    firestore()
      .collection('Notification')
      .doc(notificationId)
      .delete(null)
      .then(() => {
        let remainingNotifications = notifications.filter(
          item => item.id != notificationId,
        );
        setNotifications(remainingNotifications);
      })
      .catch(err => console.log(err));
  };
  const deleteConfirmation = id =>
    Alert.alert(
      'Delete Notification',
      'Do you want to delete this notification?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteNotification(id);
          },
        },
      ],
    );

  return (
    <TouchableOpacity onPress={onPress} style={styles.MessageContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.ProfileContainer}>
          {data?.image ? (
            <Image source={{uri: data?.image}} style={styles.img} />
          ) : (
            <Icon
              name="notifications"
              size={30}
              color={Colors.Primary}
              style={{marginLeft: 10}}
            />
          )}

          <Text style={styles.nameText}>{data?.text}</Text>
        </View>
        <TouchableOpacity
          style={styles.delete}
          onPress={() => deleteConfirmation(data?.id)}>
          {Icons.CancelIcon({
            tintColor: 'red',
            width: 20,
            height: 20,
          })}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationHead;

const styles = StyleSheet.create({
  MessageContainer: {
    width: '100%',
    height: h('8%'),
    borderBottomWidth: h('0.2%'),
    borderBottomColor: '#0002',
    flexDirection: 'row',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  img: {width: 40, height: 40, borderRadius: 20},
  delete: {
    alignSelf: 'center',
    marginRight: 10,
  },
  leftContainer: {
    width: '90%',
    height: '100%',
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
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
    width: '87%',
    marginLeft: 10,
  },
  nameText2: {
    color: '#0007',
    fontSize: h('1.8%'),
  },
});
