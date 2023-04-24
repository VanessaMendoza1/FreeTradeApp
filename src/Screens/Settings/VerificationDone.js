import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import Icons from '../../utils/icons';

const VerificationDone = ({navigation}) => {
  return (
    <View style={styles.mainContinaer}>
      {/* header */}
      <View style={styles.Header}>
        <View style={styles.LeftContainer}>
          {/* <Icon name="arrow-back-outline" size={30} color="#ffff" /> */}
        </View>
        <View style={styles.MiddleContainer}>
          <Text style={styles.FontWork}>Verify</Text>
        </View>
      </View>
      {/* header */}

      {/* imges */}
      <View style={styles.ImgeContainer}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          source={require('../../../assets/setting/ssl.png')}
        />
      </View>
      {/* imges */}
      <Text style={styles.VerifyText}>Verification Complete</Text>
      <Text style={styles.VerifyText2}>
        Your Profile has been verified you can now start
      </Text>
      <Text style={styles.VerifyText3}>Buying, Selling & Trading.</Text>

      <View style={styles.AppBtn}>
        <Appbutton
          onPress={() => {
            navigation.navigate('Setting');
          }}
          text={'Start Selling & Trading'}
        />
      </View>
    </View>
  );
};

export default VerificationDone;

const styles = StyleSheet.create({
  mainContinaer: {
    flex: 1,
    backgroundColor: 'white',
  },
  Header: {
    width: '100%',
    height: h('8%'),
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
  ImgeContainer: {
    width: '40%',
    height: '20%',
    // backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: h('2%'),
  },
  InputCode: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  VerifyText: {
    fontSize: h('3%'),
    fontWeight: 'bold',
    color: Colors.Primary,
    marginTop: h('2%'),

    alignSelf: 'center',
  },
  VerifyText2: {
    fontSize: h('1.7%'),
    color: '#0008',
    alignSelf: 'center',
    marginTop: h('0.5%'),
  },
  VerifyText3: {
    fontSize: h('1.7%'),
    color: Colors.Primary,
    alignSelf: 'center',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#0002',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0001',
    color: '#000',
    textAlign: 'center',
    fontSize: 22,
    borderRadius: h('1%'),

    // marginHorizontal: 2,
  },
  otpInput2: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.Primary,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0001',
    color: '#000',
    textAlign: 'center',
    fontSize: 22,
    borderRadius: h('1%'),

    // marginHorizontal: 2,
  },
  AppBtn: {
    width: '100%',
    height: '50%',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
