import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import Appbutton from '../../Components/Appbutton';
import {useSelector, useDispatch} from 'react-redux';
import { areNotificationsHidden } from '../../utils/appConfigurations'
import database from '@react-native-firebase/database';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { sendMsg } from './Inbox';

const SendOffer = ({navigation, route}) => {
  
  const [offer, setoffer] = React.useState('');
  const [Notii, setNotii] = React.useState(
    route.params.data.user.NotificationToken,
  );
  const [loading, setloading]= React.useState(false);
  const UserData = useSelector(state => state.counter.data);
  // console.warn(UserData.name);

  const NotificationSystem = async (id, name, token) => {
    console.log({PARAMS: route.params})
    firestore()
      .collection('Notification')
      .doc()
      .set({
        seen: false,
        userID: route.params.data.user.UserID,
        text: UserData.name + ' sent you $' + offer + ' offer',
      })
      .then(async () => {
        
        var data = JSON.stringify({
          data: {},
          notification: {
            body: 'Someone sent you a Request',
            title: UserData.name + 'sent you $' + offer + ' offer',
          },
          // to: JSON.parse(Notii),
          to: Notii,
        });
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            "Authorization":
              "key=AAAAwssoW30:APA91bGw2zSndcTuY4Q_o_L9x6up-8tCzIe0QjNLOs-bTtZQQJk--iAVrGU_60Vl1Q41LmUU8MekVjH_bHowDK4RC-mzDaJyjr9ma21gxSqNYrQFNTzG7vfy537eA_ogt1IORC12B5Ls",
            "Content-Type": "application/json",
          },
          data: data,
        };
        
        let callBackIfNotificationsNotHidden = axios(config)
          .then(function (response) {
            areNotificationsHidden((dummyArg) => callBackIfNotificationsNotHidden, route.params.data.user.UserID)
            navigation.goBack();
            alert('Offer Sent');
          })
          .catch(function (error) {
            console.warn(error);
          });
      })
      .catch(err => console.warn(err));
  };

  const data = route.params.data
  
  return (
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
          <Text style={styles.FontWork}>Enter your offer</Text>
        </View>
      </View>
      {/* header */}
      <View style={styles.Headerw}>
        <View style={styles.TxtInputs}>
          <TextInput
            style={styles.inputCon}
            value={offer}
            placeholder={'Enter Amount'}
            keyboardType={'number-pad'}
            placeholderTextColor={'#ffff'}
            onChangeText={e => {
              setoffer(e);
            }}
          />

          {route.params.data.Price && (
            <TouchableOpacity
              onPress={() => {
                setoffer(route.params.data.Price);
              }}
              style={styles.BtnCC}>
              <Text style={styles.manColor}>Full Amount</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* header */}

      <View style={styles.AppBtn}>
        <Appbutton
          onPress={() => {
            // NotificationSystem();


            // navigation.navigate('StartConversation', {
            //   data: route.params.data,
            //   receiverData: {
            //     // roomId,
            //     // lastMsg: txt,
            //     // route.params.data.user.image
            //     id: route.params.data.UserID,
            //     name: route.params.data.name,
            //     img: route.params.data.image,
            //     emailId: route.params.data.email,
            //     about: route.params.data.Bio,
            //     Token: route.params.data.NotificationToken,
                
            //     itemPrice: route.params.data.Price,
            //     itemImage: route.params.data.images[0],
            //     sellersName: route.params.data.user.name,
            //     sellersImage: route.params.data.user.image,
            //   }
            // });


            database()
              .ref('/chatlist/' + UserData.UserID + '/' + data.UserID)
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
                  lastMsg: offer,
                  Token: data.NotificationToken,
                  
                  itemPrice: data.Price,
                  itemImage: data.images[0],
                  sellersName: data.user.name,
                  sellersImage: data.user.image,
                };
                sendMsg(offer, setoffer, setloading, UserData, SendData)
                database()
                  .ref('/chatlist/' + UserData.UserID + '/' + data.UserID)
                  .once('value')
                  .then(async snapshot => {
                    if ((snapshot.val() == null) || (snapshot.val().itemPrice == null && snapshot.val().itemImage == null)) {
                      let myData = {
                        roomId,
                        id: UserData.UserID,
                        name: UserData.name,
                        img: UserData.image,
                        emailId: UserData.emails,
                        about: UserData.Bio,
                        lastMsg: offer,
                        Token: UserData.NotificationToken,
                        
                        itemPrice: data.Price,
                        itemImage: data.images[0],
                        sellersName: data.user.name,
                        sellersImage: data.user.image,
                      };
                      database()
                        .ref('/chatlist/' + data.UserID + '/' + UserData.UserID)
                        .update(myData)
                        .then(() => console.log('Data updated.'));
            
                      data.lastMsg = offer;
                      data.roomId = roomId;
            
                      database()
                        .ref('/chatlist/' + UserData.UserID + '/' + data.UserID)
                        .update(SendData)
                        .then(() => {
                          console.log('Data updated.')
                          alert("Offer Sent")
                          navigation.goBack();
                        });
                      // navigation.navigate('Inbox', {receiverData: SendData}); // STOPPED TAKING TO INBOX AFTER SENDING A MESSAGE
                      setloading(false);
                    } else {
                      alert("Offer Sent")
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
              })

        }}
        text={'Make offer'}
      />
      </View>
    </View>
  );
};

export default SendOffer;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Headerw: {
    width: '100%',
    height: h('10%'),
    backgroundColor: Colors.Primary,
    flexDirection: 'row',
    justifyContent: 'center',
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
  TxtInputs: {
    // backgroundColor: 'red',
    width: '90%',
    height: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomColor: '#fff',
    borderBottomWidth: h('0.2%'),
  },
  inputCon: {
    // backgroundColor: 'green',
    width: '75%',
    height: '70%',
    color: '#fff',
    fontSize: h('2%'),
  },
  BtnCC: {
    // backgroundColor: 'green',
    width: '28%',
    height: '70%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  manColor: {
    color: '#fff',
    fontSize: h('2%'),
  },
  AppBtn: {
    width: '100%',
    height: '70%',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
