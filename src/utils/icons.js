import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {w, h} from 'react-native-responsiveness';

// Images

import home from '../../assets/bt/home.png';
import dollar from '../../assets/bt/dollar.png';
import profile from '../../assets/bt/profile.png';
import cam from '../../assets/bt/cam.png';
import deals from '../../assets/bt/hand.png';
import report from '../../assets/bt/repot.png';
import eyeIcon from '../../assets/bt/eye.png';
import doubleTickIcon from '../../assets/bt/double-tick.png';

//setting
import pencil from '../../assets/setting/pencil.png';
import verify from '../../assets/setting/verify.png';
import bussiness from '../../assets/setting/bussiness.png';
import term from '../../assets/setting/term.png';
import info from '../../assets/setting/info.png';
import subscribe from '../../assets/setting/subscribe.png';
import logout from '../../assets/setting/logout.png';
import locationPin from '../../assets/setting/location-pin.png'
import notificationIcon from '../../assets/setting/notification.png'
import locationIcon from '../../assets/locationBG.png'
import heartIcon from '../../assets/setting/heart.png'
import contactUs from '../../assets/setting/contact-us.png'
import cancelSubscriptionIcon from '../../assets/setting/cancel-icon.png'
// import Colors from './colors';

const Icons = {
  Home: (style = {}) => (
    <Image source={home} style={{...styles.defaultStyle, ...style}} />
  ),
  PostAds: (style = {}) => (
    <Image source={dollar} style={{...styles.defaultStyle, ...style}} />
  ),
  Post: (style = {}) => (
    <Image source={cam} style={{...styles.defaultStyle, ...style}} />
  ),
  Mydeals: (style = {}) => (
    <Image source={deals} style={{...styles.defaultStyle, ...style}} />
  ),
  Profile: (style = {}) => (
    <Image source={profile} style={{...styles.defaultStyle, ...style}} />
  ),
  Report: (style = {}) => (
    <Image source={report} style={{...styles.defaultStyle, ...style}} />
  ),
  Pencil: (style = {}) => (
    <Image source={pencil} style={{...styles.defaultStyle, ...style}} />
  ),
  Verify: (style = {}) => (
    <Image source={verify} style={{...styles.defaultStyle, ...style}} />
  ),
  Bussiness: (style = {}) => (
    <Image source={bussiness} style={{...styles.defaultStyle, ...style}} />
  ),
  Terms: (style = {}) => (
    <Image source={term} style={{...styles.defaultStyle, ...style}} />
  ),
  Info: (style = {}) => (
    <Image source={info} style={{...styles.defaultStyle, ...style}} />
  ),
  Subscribe: (style = {}) => (
    <Image source={subscribe} style={{...styles.defaultStyle, ...style}} />
  ),
  Logout: (style = {}) => (
    <Image source={logout} style={{...styles.defaultStyle, ...style}} />
  ),
  ToggleShowPasswordIcon: (style = {}) => (
    <Image source={eyeIcon} style={{...styles.defaultStyle, ...style}} />
  ),
  DoubleTickIcon: (style = {}) => (
    <Image source={doubleTickIcon} style={{...styles.defaultStyle, ...style}} />
  ),
  LocationPinIcon: (style = {}) => (
    <Image source={locationPin} style={{...styles.defaultStyle, ...style}} />
  ),
  LocationIcon: (style = {}) => (
    <Image source={locationIcon} style={{...styles.defaultStyle, ...style}} />
  ),
  NotificationIcon: (style = {}) => (
    <Image source={notificationIcon} style={{...styles.defaultStyle, ...style}} />
  ),
  HeartIcon: (style = {}) => (
    <Image source={heartIcon} style={{...styles.defaultStyle, ...style}} />
  ),
  ContactUs: (style = {}) => (
    <Image source={contactUs} style={{...styles.defaultStyle, ...style}} />
  ),
  CancelSubscriptionIcon: (style = {}) => (
    <Image source={cancelSubscriptionIcon} style={{...styles.defaultStyle, ...style}} />
  ),
};
const styles = StyleSheet.create({
  defaultStyle: {
    height: h('7%'),
    width: w('7%'),
    resizeMode: 'contain',
  },
  tabBar: {
    height: h('8%'),
    width: w('8%'),
    resizeMode: 'contain',
  },
});
export default Icons;
