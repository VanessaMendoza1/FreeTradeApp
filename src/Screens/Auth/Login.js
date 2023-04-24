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

const Login = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();
  React.useEffect(() => {
    auth()
      .signInWithEmailAndPassword("arsalan.ahmad.ishaq@gmail.com", "animation")
      .then(async userCredential => {
        const user = userCredential.user;

        
        if (user.emailVerified) {
          let userData = [];
          await firestore()
            .collection('Users')
            .doc("bx6tcozmzePrl0bSANlsXNPvfD03") //16X3IO7AiUbcyp0EJgliljmAlDQ2 G7t8asZeawP3ZqHCOkJOpklHwH32  bx6tcozmzePrl0bSANlsXNPvfD03 THIS IS TEMPORARY HARDCODED
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
  }, [])
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
              .doc("G7t8asZeawP3ZqHCOkJOpklHwH32") // G7t8asZeawP3ZqHCOkJOpklHwH32  bx6tcozmzePrl0bSANlsXNPvfD03 THIS IS TEMPORARY HARDCODED
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

  React.useEffect(() => {
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
                  alert('This is in Production');
                }}
                BgColor={'#EA4335'}
                img={require('../../../assets/google.png')}
              />
              <SocialButton
                onPress={() => {
                  alert('This is in Production');
                }}
                BgColor={'#3B5998'}
                img={require('../../../assets/facebook.png')}
              />
              <SocialButton
                onPress={() => {
                  alert('This is in Production');
                }}
                BgColor={'#ffff'}
                img={require('../../../assets/apple.png')}
              />
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
