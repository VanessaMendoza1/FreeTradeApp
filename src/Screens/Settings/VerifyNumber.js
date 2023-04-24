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

import auth from '@react-native-firebase/auth';

const VerifyNumber = ({navigation}) => {
  const [phone, setPhone] = React.useState('');
  const [confirm, setConfirm] = useState(null);

  async function Otp() {
    console.warn(phone);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      await setConfirm(confirmation);

      await navigation.navigate('OtpScreen', {data: confirm});
    } catch (error) {
      if (
        error.message ===
        '[auth/too-many-requests] We have blocked all requests from this device due to unusual activity. Try again later.'
      ) {
        alert(
          ' We have blocked all requests from this device due to unusual activity. Try again later',
        );
      }
      console.log(error.message);
    }
  }

  return (
    <View style={styles.mainContinaer}>
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

      <View style={styles.Redzone}>
        <Text style={styles.VerifyText}>Verify Account</Text>
        <Text style={styles.mainVerifyText}>
          Add your Number with country code like +1 xxx xxx xxx
        </Text>
        {/* passwordCC */}
        <View style={styles.PasswordContainer}>
          <TouchableOpacity style={styles.iconContainercc2}>
            <Icon
              name="phone-portrait-outline"
              size={30}
              color={Colors.Primary}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.inputContainercc2}
            placeholder={'Phone number'}
            placeholderTextColor={Colors.Primary}
            keyboardType={'number-pad'}
            value={phone}
            onChangeText={e => {
              setPhone(e);
            }}
          />
        </View>
        {/* passwordCC */}
        <Text style={styles.mainVerifyText}>
          A Verification code was sent to your Phone number
        </Text>
      </View>
      <View style={styles.AppBtn}>
        <Appbutton
          onPress={() => {
            Otp();
            //
          }}
          text={'Submit'}
        />
      </View>
    </View>
  );
};

export default VerifyNumber;

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
  PasswordContainer: {
    width: '100%',
    height: h('7%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    marginTop: h('1%'),
    flexDirection: 'row',
  },
  iconContainercc2: {
    width: '15%',
    height: '80%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: h('0.2%'),
    borderRightColor: Colors.Primary,
    alignSelf: 'center',
  },
  AppBtn: {
    width: '100%',
    height: '20%',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputContainercc2: {
    height: '100%',
    width: '85%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),
    // backgroundColor: 'red',
  },
  Redzone: {
    width: '90%',
    height: h('30%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  VerifyText: {
    color: Colors.Primary,
    fontSize: h('2.2%'),
    fontWeight: 'bold',
  },
  mainVerifyText: {
    color: '#000',
    fontSize: h('1.7%'),
    alignSelf: 'center',
    marginTop: h('1%'),
  },
});
