import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageHead from '../../Components/MessageHead';
import { getCurrentTimeStamp } from '../../utils/time'

import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';

import MsgComponent from '../../Components/MsgComponent';

const Inbox = ({navigation, route}) => {
  const userData = useSelector(state => state.counter.data);

  const {receiverData, txt} = route.params;

  React.useEffect(() => {
    if (txt !== '') {
      // AutSender(); dont know why this was added
    }
  }, []);

  const AutSender = () => {
    let msgData = {
      roomId: receiverData.roomId,
      message: txt,
      from: userData?.UserID,
      to: receiverData.id,
      sendTime: getCurrentTimeStamp(),
      msgType: 'text',
    };

    const newReference = database()
      .ref('/messages/' + receiverData.roomId)
      .push();
    msgData.id = newReference.key;
    newReference.set(msgData).then(() => {
      let chatListupdate = {
        lastMsg: msg,
        sendTime: msgData.sendTime,
      };
      database()
        .ref('/chatlist/' + receiverData?.id + '/' + userData?.UserID)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));

      database()
        .ref('/chatlist/' + userData?.UserID + '/' + receiverData?.id)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));

      setMsg('');
      setdisabled(false);
    });
  };

  const [msg, setMsg] = React.useState('');
  const [disabled, setdisabled] = React.useState(false);
  const [allChat, setallChat] = React.useState([]);

  React.useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/' + receiverData.roomId)
      .on('child_added', snapshot => {
        // console.log('A new node has been added', snapshot.val());
        setallChat(state => [snapshot.val(), ...state]);
      });
    // Stop listening for updates when no longer required
    return () =>
      database()
        .ref('/messages' + receiverData.roomId)
        .off('child_added', onChildAdd);
  }, [receiverData.roomId]);

  const msgvalid = txt => txt && txt.replace(/\s/g, '').length;

  const sendMsg = () => {
    if (msg == '' || msgvalid(msg) == 0) {
      alert('Enter something....');

      return false;
    }
    setdisabled(true);
    let msgData = {
      roomId: receiverData.roomId,
      message: msg,
      from: userData?.UserID,
      to: receiverData.id,
      sendTime: getCurrentTimeStamp(),
      msgType: 'text',
    };

    const newReference = database()
      .ref('/messages/' + receiverData.roomId)
      .push();
    msgData.id = newReference.key;
    newReference.set(msgData).then(() => {
      let chatListupdate = {
        lastMsg: msg,
        sendTime: msgData.sendTime,
      };
      database()
        .ref('/chatlist/' + receiverData?.id + '/' + userData?.UserID)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));

      database()
        .ref('/chatlist/' + userData?.UserID + '/' + receiverData?.id)
        .update(chatListupdate)
        .then(() => console.log('Data updated.'));

      setMsg('');
      setdisabled(false);
    });
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View style={styles.MainContainer}>
        {/* header */}
        <View style={styles.Header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.LeftContainer}>
            <Icon name="arrow-back-outline" size={30} color="#ffff" />
          </TouchableOpacity>
          <View style={styles.MiddleContainer}>
            <View style={styles.ProfileContainer}>
              <View style={styles.ProfileCC}>
                <Image
                  style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                  source={{
                    uri: receiverData.img
                      ? receiverData.img
                      : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                  }}
                />
              </View>
            </View>
            <View style={styles.ProfileContainer2}>
              <Text style={styles.FontWork}>{receiverData.name}</Text>
            </View>
          </View>
        </View>
        {/* header */}

        <View style={{flex: 1}}>
          <FlatList
            style={{flex: 1}}
            data={allChat}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            inverted
            renderItem={({item}) => {
              console.warn(userData.userid);
              return (
                <MsgComponent
                  sender={item.from == userData.UserID}
                  item={item}
                />
              );
            }}
          />
        </View>

        <View
          style={{
            // backgroundColor: Colors.Primary,

            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            // paddingVertical: 7,
            justifyContent: 'space-evenly',
          }}
          disabled={disabled}>
          <TextInput
            style={{
              backgroundColor: '#ffff',
              width: '78%',
              height: h('7%'),
              paddingHorizontal: 15,
              color: '#000',
              fontSize: h('2%'),
              borderColor: Colors.Primary,
              borderWidth: h('0.2%'),
              alignSelf: 'center',
              // marginTop: h('1%'),
            }}
            placeholder="Type a Message"
            placeholderTextColor={Colors.Primary}
            multiline={true}
            value={msg}
            onChangeText={val => setMsg(val)}
            // onChangeText={val => setMsg(val)}
          />
          <TouchableOpacity style={styles.BtnCCW} onPress={sendMsg}>
            <Icon name="chatbubbles" size={25} color={'#fff'} />
            <Text style={{color: '#fff', fontSize: 18}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('100%'),
    backgroundColor: '#fff',
  },
  Header: {
    width: '100%',
    height: h('10%'),
    backgroundColor: Colors.Primary,
    flexDirection: 'row',
  },
  LeftContainer: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleContainer: {
    width: '70%',
    height: '100%',
    // backgroundColor: 'red',
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  FontWork: {
    color: 'white',
    fontSize: h('2.4%'),
    // fontWeight: 'bold',
  },
  ProfileContainer: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileContainer2: {
    width: '82%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    // alignItems: 'center',
  },
  ProfileCC: {
    width: 55,
    height: 55,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  BtnCCW: {
    width: '20%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
});