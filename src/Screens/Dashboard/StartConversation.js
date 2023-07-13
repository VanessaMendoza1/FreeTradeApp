import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import Colors from '../../utils/Colors';

import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Appbutton from '../../Components/Appbutton';
import {sendMsg} from './Inbox';
import {all} from 'axios';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import {priceFormatter} from '../../utils/helpers/helperFunctions';

const StartConversation = ({navigation, route}) => {
  const [loading, setloading] = React.useState(false);
  const [txt, settxt] = React.useState('');
  const userData = useSelector(state => state.counter.data);

  const [itemOfDiscussionImage, setItemOfDiscussionImage] = React.useState('');
  const [sellersImage, setSellersImage] = React.useState('');
  const [itemOfDiscussionPrice, setItemOfDiscussionPrice] = React.useState(0);

  const {receiverData, txt: _txt} = route.params;

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Focussed StartConversation.js, running setItemOfDiscussionImage setItemOfDiscussionPrice setSellersImage',
      );
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

  const createChatList = data => {
    setloading(true);
    const currentUserId = auth().currentUser.uid;
    database()
      .ref('/chatlist/' + currentUserId + '/' + data.UserID)
      .once('value')
      .then(async snapshot => {
        console.log({PREVIOUS_CHAT_NODE: snapshot.val()});
        let roomId;
        if (snapshot.val() == null) {
          roomId = uuid.v4();
        } else {
          roomId = snapshot.val().roomId;
        }
        console.log({roomId});
        let SendData = {
          roomId,
          id: data.UserID,
          name: data.name,
          img: data.image,
          emailId: data.email,
          about: data.Bio,
          lastMsg: txt,
          Token: data.NotificationToken,

          itemPrice: data.Price,
          itemImage: data.images[0],
          sellersName: data.user.name,
          sellersImage: data.user.image,
        };
        sendMsg(txt, settxt, setloading, userData, SendData);
        database()
          .ref('/chatlist/' + currentUserId + '/' + data.UserID)
          .once('value')
          .then(async snapshot => {
            if (
              snapshot.val() == null ||
              (snapshot.val().itemPrice == null &&
                snapshot.val().itemImage == null)
            ) {
              let myData = {
                roomId,
                id: currentUserId,
                name: userData.name,
                img: userData.image,
                emailId: userData.emails,
                about: userData.Bio,
                lastMsg: txt,
                Token: userData.NotificationToken,

                itemPrice: data.Price,
                itemImage: data.images[0],
                sellersName: data.user.name,
                sellersImage: data.user.image,
              };
              database()
                .ref('/chatlist/' + data.UserID + '/' + currentUserId)
                .update(myData)
                .then(() => console.log('Data updated.'));

              data.lastMsg = txt;
              data.roomId = roomId;

              database()
                .ref('/chatlist/' + currentUserId + '/' + data.UserID)
                .update(SendData)
                .then(() => {
                  console.log('Data updated.');
                  alert('Message Sent');
                  navigation.goBack();
                });
              // navigation.navigate('Inbox', {receiverData: SendData}); // STOPPED TAKING TO INBOX AFTER SENDING A MESSAGE
              setloading(false);
            } else {
              let myData = {
                // roomId,
                // id: currentUserId,
                name: userData.name,
                img: userData.image,
                emailId: userData.emails,
                // about: userData.Bio,
                lastMsg: txt,
                // Token: userData.NotificationToken,
                itemPrice: data.Price,
                itemImage: data.images[0],
                sellersName: data.user.name,
                sellersImage: data.user.image,
              };
              let SendData = {
                // roomId,
                // id: data.UserID,
                name: data.name,
                img: data.image,
                emailId: data.email,
                // about: data.Bio,
                lastMsg: txt,
                // Token: data.NotificationToken,
                itemPrice: data.Price,
                itemImage: data.images[0],
                sellersName: data.user.name,
                sellersImage: data.user.image,
              };
              database()
                .ref('/chatlist/' + data.UserID + '/' + currentUserId)
                .update(myData)
                .then(() => console.log('Data updated.'));

              data.lastMsg = txt;
              data.roomId = roomId;

              database()
                .ref('/chatlist/' + currentUserId + '/' + data.UserID)
                .update(SendData)
                .then(() => {
                  console.log('Data updated.');
                  alert('Message Sent');
                  navigation.goBack();
                });
              alert('Message Sent');
              navigation.goBack();
              // navigation.navigate('Inbox', {
              //   txt: txt,
              //   receiverData: {
              //     ...snapshot.val(),
              //     itemPrice: data.Price,
              //     itemImage: data.images[0],
              //     sellersName: data.user.name,
              //     sellersImage: data.user.image,
              //   }
              // });
              setloading(false);
            }
          });
      });
  };
  console.log({sellersImage});

  return (
    <View style={styles.MainContaiiner}>
      {/* header */}
      <View style={styles.Header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.LeftContainer}>
          <Icon name="arrow-back-outline" size={30} color="#ffff" />
        </TouchableOpacity>
        {/* <View style={styles.MiddleContainer}>
          <Text style={styles.FontWork}>Send Message</Text>
        </View> */}

        <View style={styles.MiddleContainer}>
          {/* <View style={styles.ProfileContainer}> */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
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
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: 'stretch',
              borderRadius: 10,
              marginBottom: 2,
            }}
            source={{uri: itemOfDiscussionImage}}
          />
          <Text style={{textAlign: 'center', color: 'white'}}>
            {priceFormatter(itemOfDiscussionPrice)}
          </Text>
        </View>
      </View>
      {/* header */}

      <View style={styles.InputContainers}>
        <Text style={{...styles.Txt123, marginBottom: 10}}>New Message</Text>
        <TextInput
          style={styles.inputCC}
          // placeholder="Enter Message"
          // placeholderTextColor={Colors.Primary}
          onChangeText={e => settxt(e)}
          value={txt}
        />
        <TouchableOpacity
          onPress={() => {
            settxt('Hi, is this still available?');
          }}
          style={styles.inputBtn}>
          <Text style={styles.Txt123}>Hi, is this still available?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            settxt('Hi, would you consider trading?');
          }}
          style={styles.inputBtn}>
          <Text style={styles.Txt123}>Hi, would you consider trading?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            settxt('Hi, can we meet today?');
          }}
          style={styles.inputBtn}>
          <Text style={styles.Txt123}>Hi, can we meet today?</Text>
        </TouchableOpacity>
      </View>
      {txt !== '' && (
        <Appbutton
          onPress={() => {
            createChatList(route.params.data);
          }}
          text={'Send'}
        />
      )}
    </View>
  );
};

export default StartConversation;

const styles = StyleSheet.create({
  MainContaiiner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  Header: {
    width: '100%',
    height: h('10%'),
    backgroundColor: Colors.Primary,
    flexDirection: 'row',
  },
  LeftContainer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleContainer: {
    width: '60%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileContainer: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileContainer2: {
    marginLeft: 20,
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
  FontWork: {
    color: 'white',
    fontSize: h('2.4%'),
    fontWeight: 'bold',
  },
  InputContainers: {
    width: '90%',
    height: h('50%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    paddingTop: h('1%'),
  },
  inputCC: {
    alignSelf: 'center',
    width: '100%',
    height: h('7%'),
    // backgroundColor: Colors.Primary,
    // alignSelf: 'center',
    borderRadius: h('1.5%'),
    // borderColor: Colors.Primary,
    borderColor: 'black',
    borderWidth: h('0.2%'),
    fontSize: h('2%'),
  },
  inputBtn: {
    // backgroundColor: Colors.Primary,
    width: '75%',
    height: h('5%'),
    marginTop: h('2%'),
    borderRadius: h('5%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    justifyContent: 'center',
    paddingLeft: h('1%'),
  },
  Txt123: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
});
