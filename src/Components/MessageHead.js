import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';

const MessageHead = ({onPress, username, img}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.MessageContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.ProfileContainer}>
          <View style={styles.ProfileCC}>
            <Image
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              source={{
                uri: img
                  ? img
                  : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.RightContainer}>
        <Text style={styles.nameText}>{username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MessageHead;

const styles = StyleSheet.create({
  MessageContainer: {
    width: '100%',
    height: h('10%'),
    borderBottomWidth: h('0.2%'),
    borderBottomColor: '#0002',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  leftContainer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'gold',
    marginLeft: h('1%'),
  },
  RightContainer: {
    width: '70%',
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
    width: 55,
    height: 55,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  nameText: {
    color: '#000',
    fontSize: h('2.2%'),
    fontWeight: 'bold',
  },
  nameText2: {
    color: '#0007',
    fontSize: h('2%'),
  },
});
