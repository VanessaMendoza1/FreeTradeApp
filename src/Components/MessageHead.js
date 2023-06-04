import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';

const MessageHead = ({
  onPress,
  username,
  img,
  itemImage,
  itemPrice,
  lastMessage,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.MessageContainer}>
      <View style={styles.leftContainer}>
        <View
          style={{
            // backgroundColor: "pink",
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: "space-between"
          }}>
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
          {/* {lastMessage} */}
          <View style={styles.RightContainer}>
            <Text style={styles.nameText}>{username}</Text>
            <Text>
              {lastMessage.length > 40
                ? lastMessage.substring(0, 40) + '...'
                : lastMessage}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          // flex: 1,
          alignSelf: 'center',
          // flexDirection: "row",
          alignItems: 'flex-end',
          // backgroundColor: 'pink',
        }}>
        <ImageBackground
          style={{
            width: h('7%'),
            height: h('7%'),
            borderRadius: h('3.5%'),
            resizeMode: 'cover',
            overflow: 'hidden',
          }}
          source={{
            uri: itemImage
              ? itemImage
              : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          }}>
          <Text
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              textAlign: 'center',
              marginTop: h('4.5%'),
            }}>
            ${itemPrice}
          </Text>
        </ImageBackground>
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
    justifyContent: 'space-between',
    paddingRight: 10,
    // backgroundColor: 'red',
  },
  leftContainer: {
    width: '50%',
    height: '100%',
    // backgroundColor: 'gold',
    marginLeft: h('1%'),
  },
  RightContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'gold',
  },
  ProfileContainer: {
    width: '40%',
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
