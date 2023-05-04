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

import axios from 'axios';

const SendOffer = ({navigation, route}) => {
  const [offer, setoffer] = React.useState('');
  const [Notii, setNotii] = React.useState(
    route.params.data.user.NotificationToken,
  );
  const UserData = useSelector(state => state.counter.data);
  // console.warn(UserData.name);

  const NotificationSystem = async (id, name, token) => {
    firestore()
      .collection('Notification')
      .doc()
      .set({
        userID: route.params.data.user.UserID,
        text: UserData.name + ' send you' + offer + '$ offer',
      })
      .then(async () => {
        var data = JSON.stringify({
          data: {},
          notification: {
            body: 'Someone send you a Request',
            title: UserData.name + 'send you' + offer + '$ offer',
          },
          to: JSON.parse(Notii),
        });
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAwssoW30:APA91bGw2zSndcTuY4Q_o_L9x6up-8tCzIe0QjNLOs-bTtZQQJk--iAVrGU_60Vl1Q41LmUU8MekVjH_bHowDK4RC-mzDaJyjr9ma21gxSqNYrQFNTzG7vfy537eA_ogt1IORC12B5Ls',
            'Content-Type': 'application/json',
          },
          data: data,
        };
        
        let callBackIfNotificationsNotHidden = axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            navigation.goBack();
            alert('Offer Sent');
          })
          .catch(function (error) {
            console.warn(error);
          });

        areNotificationsHidden(callBackIfNotificationsNotHidden, route.params.data.user.UserID)
      })
      .catch(err => console.warn(err));
  };

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
            NotificationSystem();
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
