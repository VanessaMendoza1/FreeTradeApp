import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import CheckBox from '@react-native-community/checkbox';
import Firebase from '../../utils/Firebase';

import Colors from '../../utils/Colors';
import AppInput from '../../Components/AppInput';
import Appbutton from '../../Components/Appbutton';
import SocialButton from '../../Components/SocialButton';
import LoadingScreen from '../../Components/LoadingScreen';

import {DataInsert} from '../../redux/counterSlice';
import {useSelector, useDispatch} from 'react-redux';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PostAdd,
  TradingAdd,
  SellingAdd,
  ServiceAdd,
} from '../../redux/postSlice';
import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';

const ForgetPassword = ({navigation}) => {
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        alert('Check your Email for Reset Link');
      })
      .catch(function (error) {
        if (error.code === 'auth/user-not-found') {
          alert('User Not Found');
        }
      });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ImageBackground
          style={styles.imgbg}
          source={require('../../../assets/login.png')}>
          <View style={styles.ImgOverlay}>
            <Text style={styles.FreetradeText}>FreeTrade</Text>
            <Text style={styles.SigninText}>Forget Password</Text>
            <View style={styles.space} />
            <AppInput
              placeholder={'Enter Email'}
              onChangeText={e => setEmail(e)}
            />

            <View style={styles.space2} />

            <Appbutton
              onPress={async () => {
                onSubmit();
              }}
              text={'Reset'}
            />
            <View style={styles.space3} />
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.SignupText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  imgbg: {
    backgroundColor: 'white',
    width: '100%',
    height: h('100%'),
  },
  ImgOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0009',
    alignItems: 'center',
    paddingTop: h('7.5%'),
  },
  FreetradeText: {
    color: Colors.Primary,
    fontSize: h('5%'),
    fontWeight: 'bold',
  },
  SigninText: {
    color: '#fff',
    fontSize: h('3.5%'),
    marginTop: h('3%'),
    // fontWeight: 'bold',
  },
  space: {
    width: '100%',
    height: h('5%'),
  },
  space2: {
    width: '100%',
    height: h('10%'),
  },
  space3: {
    width: '100%',
    height: h('30%'),
  },
  LoginText: {
    color: '#fff',
    fontSize: h('2.2%'),
    marginTop: h('4%'),
  },
  RemebermeText: {
    color: '#fff',
    fontSize: h('2.2%'),
    marginLeft: h('1%'),
  },
  RemeberMebOx: {
    width: '90%',
    height: h('8%'),
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RemeberMebOx2: {
    width: '40%',
    height: h('8%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RemeberMebOx3: {
    width: '60%',
    height: h('8%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  SignupText: {
    color: '#fff',
    fontSize: h('2.2%'),
  },
  SocialButtonContainer: {
    // backgroundColor: '#fff',
    width: '75%',
    height: h('10%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: h('2%'),
    marginTop: h('2%'),
  },
});
