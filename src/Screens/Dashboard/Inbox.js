import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageHead from '../../Components/MessageHead';
import {getCurrentTimeStamp} from '../../utils/time';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MsgComponent from '../../Components/MsgComponent';
import {useFocusEffect} from '@react-navigation/native';

const msgvalid = txt => txt && txt.replace(/\s/g, '').length;

const indicateOtherUserAsHavingUnreadMessages = otherUserId => {
  firestore()
    .collection('Users')
    .doc(otherUserId)
    .update({hasUnseenMessages: true});
};

const sendMsg = (msg, setMsg, setdisabled, userData, receiverData) => {
  console.log({msg, receiverData});
  const currentUserId = auth().currentUser.uid;
  try {
    if (msg == '' || msgvalid(msg) == 0) {
      alert('Enter something....');

      return false;
    }
    setdisabled(true);
    let msgData = {
      roomId: receiverData.roomId,
      message: msg,
      from: currentUserId,
      to: receiverData.id,
      sendTime: getCurrentTimeStamp(),
      msgType: 'text',
    };

    const newReference = database()
      .ref('/messages/' + receiverData.roomId)
      .push();
    msgData.id = newReference.key;
    newReference
      .set(msgData)
      .then(() => {
        console.log({NEW_MESSAGE_SENT_DATA: msgData});
        indicateOtherUserAsHavingUnreadMessages(receiverData.id);
        console.log('MESSAGE SENT');
        console.log({msgData});
        let chatListupdate = {
          lastMsg: msg,
          sendTime: msgData.sendTime,
        };
        database()
          .ref('/chatlist/' + receiverData?.id + '/' + currentUserId)
          .update(chatListupdate)
          .then(() =>
            console.log({
              CHAT_NODE_UPDATED_1:
                '/chatlist/' + receiverData?.id + '/' + currentUserId,
            }),
          );

        database()
          .ref('/chatlist/' + currentUserId + '/' + receiverData?.id)
          .update(chatListupdate)
          .then(() =>
            console.log({
              CHAT_NODE_UPDATED_2:
                '/chatlist/' + currentUserId + '/' + receiverData?.id,
            }),
          );

        setMsg('');
        setdisabled(false);
      })
      .catch(err => {
        console.log('ERROR CAUGHT WHILE SENDING MESSAGE');
        console.log(err);
      });
  } catch (_err) {
    console.log({_err});
  }
};

const Inbox = ({navigation, route}) => {
  const userData = useSelector(state => state.counter.data);

  const {receiverData, txt} = route.params;

  React.useEffect(() => {
    if (txt !== '') {
      // AutSender(); dont know why this was added
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Focussed Notification.js, running getNotification');
      let {
        itemPrice,
        itemImage,
        sellersName,
        sellersImage: _sellersImage,
        roomId,
        id: otherUserId,
      } = route.params.receiverData;

      setItemOfDiscussionImage(itemImage);
      setItemOfDiscussionPrice(itemPrice);
      setSellersImage(_sellersImage);
      return () => null;
    }, []),
  );

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
  const [itemOfDiscussionImage, setItemOfDiscussionImage] = React.useState('');
  const [sellersImage, setSellersImage] = React.useState('');
  const [itemOfDiscussionPrice, setItemOfDiscussionPrice] = React.useState(0);

  React.useEffect(() => {
    console.log({allChat});
  }, [allChat]);

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

  return (
    <ScrollView
      // automaticallyAdjustKeyboardInsets={true}
      keyboardShouldPersistTaps="handled">
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
                    uri: sellersImage
                      ? sellersImage
                      : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                  }}
                />
              </View>
            </View>

            <View style={styles.ProfileContainer2}>
              <Text style={styles.FontWork}>{receiverData.sellersName}</Text>
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ImageBackground
              style={{
                width: h('8%'),
                height: h('8%'),
                resizeMode: 'cover',
                borderRadius: 10,
                marginBottom: 2,
                borderRadius: h('4%'),
                overflow: 'hidden',
              }}
              source={{
                uri: itemOfDiscussionImage
                  ? itemOfDiscussionImage
                  : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
              }}>
              <Text
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  textAlign: 'center',
                  marginTop: h('5.5%'),
                }}>
                ${itemOfDiscussionPrice}
              </Text>
              {/* <Text style={{textAlign: "center", color: "white"}}>
              </Text> */}
            </ImageBackground>
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
              return (
                <>
                  <MsgComponent
                    sender={item.from == userData.UserID}
                    item={item}
                  />
                </>
              );
            }}
          />
        </View>

        <View
          style={{
            // backgroundColor: Colors.Primary,

            height: 70,
            flexDirection: 'row',
            alignContent: 'center',
            // paddingVertical: 7,
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}
          disabled={disabled}>
          <TextInput
            style={{
              backgroundColor: '#ffff',
              width: '75%',
              height: '75%',
              borderRadius: 30,
              padding: 15,
              color: '#000',
              fontSize: h('2%'),
              borderColor: Colors.Primary,
              // borderRadius: 10,
              borderWidth: h('0.2%'),
              alignSelf: 'center',
              textAlignVertical: 'center',
              paddingTop: 13,
              // marginTop: h('1%'),
            }}
            placeholder="Type a Message"
            blurOnSubmit
            placeholderTextColor={Colors.Primary}
            multiline={true}
            value={msg}
            secureTextEntry
            onChangeText={val => setMsg(val)}
            // onChangeText={val => setMsg(val)}
          />
          <TouchableOpacity
            style={styles.BtnCCW}
            onPress={() => {
              Keyboard.dismiss();
              sendMsg(msg, setMsg, setdisabled, userData, receiverData);
            }}>
            <Icon name="chatbubbles" size={25} color={'#fff'} />
            <Text style={{color: '#fff', fontSize: 18}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Inbox;

export {sendMsg};

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('95%'),
    backgroundColor: '#fff',
  },
  Header: {
    paddingRight: 15,
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
    // display: "flex",
    // flexDirection: "row",
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
    width: '62%',
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
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
    borderRadius: 30,
  },
});
