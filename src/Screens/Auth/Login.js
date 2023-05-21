import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {cloneElement, useState} from 'react';
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
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const Login = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  // const allmypost = async () => {
  //   let SellingData = [];
  //   let TradingData = [];
  //   let ServiceData = [];
  //   await firestore()
  //     .collection('Post')
  //     .get()
  //     .then(async querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         if (documentSnapshot.data().status === false) {
  //           if (documentSnapshot.data().PostType === 'Trading') {
  //             TradingData.push(documentSnapshot.data());
  //           }
  //           if (documentSnapshot.data().PostType === 'Selling') {
  //             SellingData.push(documentSnapshot.data());
  //           }
  //           if (documentSnapshot.data().PostType === 'Service') {
  //             ServiceData.push(documentSnapshot.data());
  //           }
  //         }
  //       });
  //     });

  //   await dispatch(SellingAdd(SellingData));
  //   await dispatch(TradingAdd(TradingData));
  //   await dispatch(ServiceAdd(ServiceData));
  //   // navigation.navigate('LocationPage');
  //   navigation.navigate('TabNavigation');
  //   setloading(false);
  // };
  const Allads = async () => {
    let ImageData = [];
    let VideoData = [];

    await firestore()
      .collection('Ads')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          console.warn(documentSnapshot.data());
          if (documentSnapshot.data().MediaType === 'Image') {
            ImageData.push(documentSnapshot.data());
          }
          if (documentSnapshot.data().MediaType === 'Videos') {
            VideoData.push(documentSnapshot.data());
          }
        });
      });

    await dispatch(AddImageAds(ImageData));
    await dispatch(AddVideoAds(VideoData));
    console.warn(ImageData);
  };

  // const ABC = () => {
  //   firestore()
  //     .collection('BBB')
  //     .doc('123')
  //     .collection('Reviews')
  //     .doc('31223')
  //     .add({
  //       password: '123',
  //       name: '12332',
  //       rollno: '123',
  //     });
  // };

  const ABC = () => {
    firestore()
      .collection('BBB')
      .doc('123')
      .collection('booksList')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          console.warn(documentSnapshot.data());
        });
      });
  };

  const onSubmit = () => {
    setloading(true);
    if (email === '' || password === '') {
      alert('All fields  are required');
      setloading(false);
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(async userCredential => {
          const user = userCredential.user;

          if (user.emailVerified) {
            let userData = [];
            await firestore()
              .collection('Users')
              .doc(user.uid)
              .get()
              .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                  userData.push(documentSnapshot.data());
                }
              })
              .catch(err => {
                setloading(false);
                console.warn(err);
              });

            console.warn(userData[0]);
            await dispatch(DataInsert(userData[0]));
            if (toggleCheckBox) {
              await AsyncStorage.setItem(
                '@userData2',
                JSON.stringify(userData[0].UserID),
              );
            }

            try {
              const value = await AsyncStorage.getItem('@user');
              if (value !== null) {
                // allmypost();
                navigation.navigate('TabNavigation');
                console.warn(value);
              } else {
                navigation.navigate('TabNavigation');

                // navigation.navigate('LocationPage');
                console.warn(value);
                setloading(false);
              }
            } catch (e) {
              setloading(false);
              console.warn(e);
              // error reading value
            }

            // saveUser(userData[0]);
          } else {
            setloading(false);
            alert('Email is not verified Please check your Inbox');
          }
        })
        .catch(error => {
          setloading(true);
          const errorMessage = error.code;
          console.warn(error);
          if (errorMessage === 'auth/wrong-password') {
            alert('Wrong Password');
            setloading(false);
          }
          if (errorMessage === 'auth/operation-not-allowed') {
            alert('Operation not alloweded');
            setloading(false);
          }

          if (errorMessage === 'auth/user-not-found') {
            alert('This Email is Not Register');
            setloading(false);
          }
          setloading(false);
        });
    }
  };
  //  =================== Facebook Authenication ================
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
    ]);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    } else {
      // initUser(data?.accessToken);
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    console.log('facebookCredential', facebookCredential);
    // Sign-in the user with the credential
    return auth()
      .signInWithCredential(facebookCredential)
      .then(async res => {
        console.log(res?.user?.uid, 'fbid');
        await dispatch(DataInsert(res));
        if (toggleCheckBox) {
          await AsyncStorage.setItem(
            '@userData2',
            JSON.stringify(res?.user?.uid),
          );
        }

        try {
          const value = await AsyncStorage.getItem('@user');
          if (value !== null) {
            // allmypost();
            navigation.navigate('TabNavigation');
            console.warn(value);
          } else {
            navigation.navigate('TabNavigation');

            // navigation.navigate('LocationPage');
            console.warn(value);
            setloading(false);
          }
        } catch (e) {
          setloading(false);
          console.warn(e);
          // error reading value
        }
      })
      .catch(e => {
        console.log(e, 'e');
        alert('Something went wrong');
      });
  }
  // ================== Google Login =========================
  async function onGoogleButtonPress() {
    // Get the users ID token
    try {
      const {idToken, user} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);
      // Sign-in the user with the credential
      return auth()
        .signInWithCredential(googleCredential)
        .then(async res => {
          console.log(res?.user?.uid, 'res?.user?.uid');
          await dispatch(DataInsert(res));
          if (toggleCheckBox) {
            await AsyncStorage.setItem(
              '@userData2',
              JSON.stringify(res?.user?.uid),
            );
          }

          try {
            const value = await AsyncStorage.getItem('@user');
            if (value !== null) {
              // allmypost();
              navigation.navigate('TabNavigation');
              console.warn(value);
            } else {
              navigation.navigate('TabNavigation');

              // navigation.navigate('LocationPage');
              console.warn(value);
              setloading(false);
            }
          } catch (e) {
            setloading(false);
            console.warn(e);
            // error reading value
          }
        })
        .catch(e => {
          alert('Something went wrong');
          console.log(e, 'e');
        });
      // Singup(user?.name, user?.email, '', '', 'gmail');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert(error);

        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert(error);
      } else {
        // some other error happened
        alert(error);
      }
    }
  }
  ////apple login
  const applelogin = async () => {
    // const appleAuthRequestResponse = await appleAuth.performRequest({
    //   requestedOperation: appleAuth.Operation.LOGIN,
    //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    // });
    // const {identityToken, nonce} = appleAuthRequestResponse;
    // const appleCredential = appleAuth.AppleAuthProvider.credential(
    //   identityToken,
    //   nonce,
    // );
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    console.log(appleCredential, 'appleCredential');

    // Sign the user in with the credential
    // return auth().signInWithCredential(appleCredential);
    return auth()
      .signInWithCredential(appleCredential)
      .then(async res => {
        await dispatch(DataInsert(res));
        if (toggleCheckBox) {
          await AsyncStorage.setItem(
            '@userData2',
            JSON.stringify(res?.user?.uid),
          );
        }

        try {
          const value = await AsyncStorage.getItem('@user');
          if (value !== null) {
            // allmypost();
            navigation.navigate('TabNavigation');
            console.warn(value);
          } else {
            navigation.navigate('TabNavigation');

            // navigation.navigate('LocationPage');
            console.warn(value);
            setloading(false);
          }
        } catch (e) {
          setloading(false);
          console.warn(e);
          // error reading value
        }
      })
      .catch(e => {
        console.log(e, 'e');
        alert('Something went wrong');
      });

    // console.log('signed in', appleAuthRequestResponse);
    // console.log(appleAuthRequestResponse.email);
    // var user_email = appleAuthRequestResponse.email;
    // var user_name = appleAuthRequestResponse.fullName.givenName;
    // // Singup(user_name, user_email, '', '', 'apple');
    // const credentialState = await appleAuth.getCredentialStateForUser(
    //   appleAuthRequestResponse.user,
    // );
    // // use credentialState response to ensure the user is authenticated
    // if (credentialState === appleAuth.State.AUTHORIZED) {
    //   // user is authenticated
    //   //alert(JSON.stringify(appleAuthRequestResponse));
    // }
  };
  // /////init user
  // const initUser = token => {
  //   fetch(
  //     'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' +
  //       token,
  //   )
  //     .then(response => response.json())
  //     .then(json => {
  //       // Singup(json?.name, json?.email, '', '', 'fb');
  //     })
  //     .catch(() => {
  //       console.log('ERROR GETTING DATA FROM FACEBOOK');
  //     });
  // };
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '836632075133-icfofnqj20u7f3n2c9986eamlfobveg3.apps.googleusercontent.com',
    });
    Allads();
  }, []);

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
            <Text style={styles.SigninText}>Sign in</Text>
            <View style={styles.space} />
            <AppInput placeholder={'Email'} onChangeText={e => setEmail(e)} />
            <AppInput
              placeholder={'Password'}
              Show
              onChangeText={e => setPassword(e)}
            />
            <View style={styles.RemeberMebOx}>
              <View style={styles.RemeberMebOx2}>
                <CheckBox
                  value={toggleCheckBox}
                  style={{width: 20, height: 20}}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                  boxType={'circle'}
                  tintColors={{true: '#fff'}}
                  onTintColor={'#fff'}
                />
                <Text style={styles.RemebermeText}>Remember me</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgetPassword');
                }}
                style={styles.RemeberMebOx3}>
                <Text style={styles.RemebermeText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.space2} />
            <Appbutton
              onPress={async () => {
                onSubmit();
              }}
              text={'Sign in'}
            />

            <Text style={styles.LoginText}>or Log in via</Text>
            <View style={styles.SocialButtonContainer}>
              <SocialButton
                onPress={() => {
                  onGoogleButtonPress();
                }}
                BgColor={'#EA4335'}
                img={require('../../../assets/google.png')}
              />
              <SocialButton
                onPress={() => {
                  onFacebookButtonPress();
                }}
                BgColor={'#3B5998'}
                img={require('../../../assets/facebook.png')}
              />
              {Platform.OS === 'ios' && (
                <SocialButton
                  onPress={() => {
                    applelogin();
                  }}
                  BgColor={'#ffff'}
                  img={require('../../../assets/apple.png')}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={styles.SignupText}>
                Don’t have an acoount? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </>
  );
};

export default Login;

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
