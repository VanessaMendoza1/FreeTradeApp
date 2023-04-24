import {StyleSheet, Text, View, Animated, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../utils/Colors';

import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {TradingAdd, SellingAdd, ServiceAdd} from '../../redux/postSlice';
import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';
import {DataInsert} from '../../redux/counterSlice';

const SplashScreen = ({navigation}) => {
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

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
  };

  useEffect(() => {
    CheckRemeberME();

    Allads();
  }, []);

  const CheckRemeberME = async () => {
    try {
      const value = await AsyncStorage.getItem('@userData2');
      if (value !== null) {
        let id = JSON.parse(value);

        Signin(id);
      } else {
        setTimeout(() => {
          navigation.replace('Login');
        }, 4000);
      }
    } catch (e) {
      console.warn(e);
      // error reading value
    }
  };

  const Signin = async id => {
    let userData = [];
    await firestore()
      .collection('Users')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          userData.push(documentSnapshot.data());
        }
      })
      .catch(err => {
        console.warn(err);
      });

    console.warn(userData[0]);
    await dispatch(DataInsert(userData[0]));

    navigation.navigate('TabNavigation');
  };

  return (
    <ImageBackground
      style={styles.MainContainer}
      source={require('../../../assets/bganim/splash.gif')}></ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  LogoContainer: {
    width: '80%',
    height: h('30%'),
    backgroundColor: 'red',
    marginTop: h('4%'),
  },
  progressBarContainer: {
    width: w('80%'),
    height: 8,
    borderRadius: 15,
    backgroundColor: '#D8D8D8',
    position: 'relative',
    marginVertical: 10,
  },
  progressBar: {
    height: 8,
    width: '100%',
    borderRadius: 15,
  },
  SPace: {
    width: '100%',
    height: h('50%'),
  },
});
