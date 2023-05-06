import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Colors from '../utils/Colors';
import { convertToLocalTime, getCurrentTimeStamp } from "../utils/time"
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const MsgComponent = props => {
  const {sender, item} = props;
  React.useEffect(() => {
    setMessageSeenTime(item)
  }, [item])

  const isMessageForCurrentUser = (messageData) => {
    const currentUser = auth().currentUser
    return currentUser.uid == messageData.to
  }

  const isMessageForOtherUser = (messageData) => {
    const currentUser = auth().currentUser
    return currentUser.uid != messageData.to
  }

  const setMessageSeenTime = (messageData) => {
    const isMessageSeenBefore = (item.seenTime != null)
    if (!isMessageSeenBefore && isMessageForCurrentUser(messageData)){
      database()
        .ref('/messages/' + messageData.roomId + '/' + messageData.id + '/seenTime')
        .set(getCurrentTimeStamp())
        .then(() => console.log('HERE UPDATED AGAIN !!!' + getCurrentTimeStamp()))
        .catch((err) => console.log(err))
    }
  }


  return (
    <Pressable style={{marginVertical: 0}}>
      <Text style={{
        fontSize: 9,
        color: "grey",
        textAlign: isMessageForOtherUser(item) ? "right" : "left",
        paddingRight: isMessageForOtherUser(item) ? 10 : 0,
        paddingLeft: isMessageForCurrentUser(item) ? 10 : 0,
      }}>
        {convertToLocalTime(item.sendTime)}
      </Text>

      <View
        style={[
          styles.masBox,
          {
            alignSelf: isMessageForCurrentUser(item) ? 'flex-start' : 'flex-end',
            padding: 10,
            // borderWidth:1,
            backgroundColor: isMessageForCurrentUser(item) ? Colors.Primary : '#D3D3D3'
          },
        ]}>
        <Text
          style={{
            paddingLeft: 5,
            color: sender ? '#000' : '#fff',
            fontSize: 14,
          }}>
          {item.message}
        </Text>
      </View>
      
      {isMessageForOtherUser(item) && (
        <Text style={{
          fontSize: 9,
          color: "grey",
          textAlign: "right",
          paddingRight: 10,
          marginBottom: 15,
        }}>
          {(item.seenTime) ? 'Seen' : 'Delivered'}
        </Text>
      )}
      
    </Pressable>
  );
};

export default MsgComponent;

const styles = StyleSheet.create({
  masBox: {
    alignSelf: 'flex-end',
    marginHorizontal: 10,
    minWidth: 80,
    maxWidth: '80%',
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingTop: 5,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 10,
  },
  dayview: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLORS.white,
    borderRadius: 30,
    marginTop: 10,
  },
  iconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: COLORS.themecolor,
  },
  TriangleShapeCSS: {
    position: 'absolute',
    // top: -3,
    width: 0,
    height: 0,
    // borderBottomLeftRadius:5,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',

    // borderBottomColor: '#757474'
  },
  left: {
    borderBottomColor: '#0074',
    left: 2,
    bottom: 10,
    transform: [{rotate: '0deg'}],
  },
  right: {
    borderBottomColor: '#0005',
    right: 2,
    // top:0,
    bottom: 5,
    transform: [{rotate: '103deg'}],
  },
});
