import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import CheckBox from '@react-native-community/checkbox';

import Colors from '../../utils/Colors';
import AppInput from '../../Components/AppInput';
import Appbutton from '../../Components/Appbutton';
import SocialButton from '../../Components/SocialButton';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const Signup = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const [FirstName, setFirstName] = useState('');
  const [SecondName, setSecondName] = useState('');
  const [NotificationToken, setNotificationToken] = useState('');

  requestPermission = () => {
    messaging()
      .requestPermission()
      .then(() => {
        getData();
      })
      .catch(error => {
        console.log(
          '@@@ FCM SERVICE REQUEST PERMISSION REJECTED ===========',
          error,
        );
      });
  };

  checkPermission = async () => {
    const deviceRemote = await messaging().registerDeviceForRemoteMessages();
    try {
      const token = await messaging().getToken();
    } catch (error) {
      console.log(error);
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      messaging()
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            // User has permission
            getData();
          } else {
            // User doesn't have permission
            this.requestPermission();
          }
        })
        .catch(error => {
          console.log(error);
          //  console.log('@@@ FCM SERVICE PERMISSION REJECT ERROR ===========', error);
        });
    } else {
      alert('Permission denied');
    }
  };

  //  notifications gathering
  const tt = async () => {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().setAutoInitEnabled(true);
      }

      const token = await messaging().getToken();

      const jsonValue = JSON.stringify(token);
      await AsyncStorage.setItem('TokensStore', jsonValue);
      setNotificationToken(jsonValue);
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('TokensStore');

      if (value) {
        setNotificationToken(value);
      } else {
        tt();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // React.useEffect(() => {
  //   // getData();
  //   checkPermission();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Focussed Signup.js, running checkPermission');
      checkPermission();
      return () => null;
    }, []),
  );

  const onSubmitUser = () => {
    // navigation.navigate('GetPremium');
    setloading(true);
    if (
      email === '' ||
      password === '' ||
      FirstName === '' ||
      SecondName === ''
    ) {
      setloading(true);

      alert('All  fields are required');
      setloading(false);
    } else {
      if (toggleCheckBox === true) {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            const user = userCredential.user;

            var unsubscribe = auth().onAuthStateChanged(function (user) {
              // if (user == null) return
              user.sendEmailVerification();
              firestore()
                .collection('Users')
                .doc(user.uid)
                .set({
                  UserID: user.uid,
                  email: email.toLowerCase(),
                  password: password,
                  name: FirstName + ' ' + SecondName,
                  image:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYNdMgrRFXgRDPrxcKcc7VA_MAoE3zkphM_g&usqp=CAU',

                  phone: '',
                  reviews: 0,
                  NotificationToken: NotificationToken ? NotificationToken : '',
                  location: '',
                  AccountType: 'Free',
                  Post: 0,
                  ban: false,
                })
                .then(() => {
                  setEmail('');
                  setPassword('');
                  setFirstName('');
                  setSecondName('');

                  alert('Verify Email and Signup');
                  navigation.goBack();
                  setloading(false);
                })
                .catch(err => console.log(err));
            });

            unsubscribe();
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
              setloading(false);
              alert('Email is already in use');
            }

            if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
              setloading(false);
              alert('That email address is invalid!');
            }

            console.error(error);
          });
      } else alert('Terms & condition need to be Checked');

      // end here
    }

    // end here
  };

  return (
    <KeyboardAvoidingScrollView>
      <ImageBackground
        style={styles.imgbg}
        source={require('../../../assets/signup.png')}>
        <View style={styles.ImgOverlay}>
          <Text style={styles.FreetradeText}>FreeTrade</Text>
          <Text style={styles.SigninText}>Sign Up</Text>
          <View style={styles.space} />
          <AppInput
            placeholder={'First Name'}
            onChangeText={e => setFirstName(e)}
          />
          <AppInput
            placeholder={'Last Name'}
            onChangeText={e => setSecondName(e)}
          />
          <AppInput placeholder={'Email'} onChangeText={e => setEmail(e)} />
          <AppInput
            placeholder={'Password'}
            Show
            onChangeText={e => setPassword(e)}
          />
          <View style={styles.RemeberMebOx}>
            <CheckBox
              value={toggleCheckBox}
              style={{width: 20, height: 20}}
              onValueChange={newValue => setToggleCheckBox(newValue)}
              boxType={'circle'}
              tintColors={{true: '#fff'}}
              onTintColor={'#fff'}
            />
            <Text
              onPress={() => {
                navigation.navigate('TermsAndConditions');
              }}
              style={styles.RemebermeText}>
              I accept Terms and Conditions
            </Text>
          </View>
          <View style={styles.space2} />
          <Appbutton
            onPress={() => {
              onSubmitUser();
            }}
            text={'Sign Up'}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.SignupText}>
              Already have an acoount? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  imgbg: {
    backgroundColor: 'white',
    width: '100%',
    height: h('100%'),
  },
  ImgOverlay: {
    width: '100%',
    height: '130%',
    backgroundColor: '#0009',
    alignItems: 'center',
    paddingTop: h('5%'),
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
    height: h('1%'),
  },
  space2: {
    width: '100%',
    height: h('3%'),
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
  SignupText: {
    color: '#fff',
    fontSize: h('2.2%'),
    marginTop: h('3%'),
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
