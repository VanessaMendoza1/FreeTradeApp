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
import { sendMsg } from './Inbox'

const StartConversation = ({navigation, route}) => {
  //   console.warn(route.params.data.Notification !== '');
  const [loading, setloading] = React.useState(false);
  const [txt, settxt] = React.useState('');
  const userData = useSelector(state => state.counter.data);

  const createChatList = data => {
    setloading(true);

    database()
      .ref('/chatlist/' + userData.UserID + '/' + data.UserID)
      .once('value')
      .then(async snapshot => {
        let roomId
        if (snapshot.val() == null) {
          roomId = uuid.v4();
        } else {
          roomId = snapshot.val().roomId
        }
        console.log({roomId})
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
        sendMsg(txt, settxt, setloading, userData, SendData)
        database()
          .ref('/chatlist/' + userData.UserID + '/' + data.UserID)
          .once('value')
          .then(async snapshot => {
            if ((snapshot.val() == null) || (snapshot.val().itemPrice == null && snapshot.val().itemImage == null)) {
              let myData = {
                roomId,
                id: userData.UserID,
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
                .ref('/chatlist/' + data.UserID + '/' + userData.UserID)
                .update(myData)
                .then(() => console.log('Data updated.'));
    
              data.lastMsg = txt;
              data.roomId = roomId;
    
              database()
                .ref('/chatlist/' + userData.UserID + '/' + data.UserID)
                .update(SendData)
                .then(() => console.log('Data updated.'));
    
              navigation.navigate('Inbox', {receiverData: SendData});
              setloading(false);
            } else {
              navigation.navigate('Inbox', {
                txt: txt,
                receiverData: {
                  ...snapshot.val(),
                  itemPrice: data.Price,
                  itemImage: data.images[0],
                  sellersName: data.user.name,
                  sellersImage: data.user.image,
                }
              });
              setloading(false);
            }
          });
      })
  };

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
        <View style={styles.MiddleContainer}>
          <Text style={styles.FontWork}>Send Message</Text>
        </View>
      </View>
      {/* header */}

      <View style={styles.InputContainers}>
        <TextInput
          style={styles.inputCC}
          placeholder="Enter Message"
          placeholderTextColor={Colors.Primary}
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
            settxt('Hi, could you send a video?');
          }}
          style={styles.inputBtn}>
          <Text style={styles.Txt123}>Hi, could you send a video?</Text>
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
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '90%',
    height: h('20%'),
    // backgroundColor: Colors.Primary,
    // alignSelf: 'center',
    borderRadius: h('1%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    fontSize: h('2%'),
  },
  inputBtn: {
    // backgroundColor: Colors.Primary,
    width: '75%',
    height: h('7%'),
    marginTop: h('2%'),
    borderRadius: h('0.5%'),
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
