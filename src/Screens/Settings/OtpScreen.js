import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import Icons from '../../utils/icons';

const OtpScreen = ({navigation, route}) => {
  console.warn(route.params.data);
  const [value, setValue] = React.useState('');
  const [input1, setInput1] = React.useState('');
  const [input2, setInput2] = React.useState('');
  const [input3, setInput3] = React.useState('');
  const [input4, setInput4] = React.useState('');
  const [input5, setInput5] = React.useState('');
  const [input6, setInput6] = React.useState('');

  const [input1Foucs, setinput1Foucs] = useState(false);
  const [input2Foucs, setInput2Foucs] = useState(false);
  const [input3Foucs, setInput3Foucs] = useState(false);
  const [input4Foucs, setInput4Foucs] = useState(false);
  const [input5Foucs, setInput5Foucs] = useState(false);
  const [input6Foucs, setInput6Foucs] = useState(false);

  const [code, setCode] = useState('');
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  useEffect(() => {
    ref1?.current?.focus();
  }, []);

  async function confirmCode(v) {
    console.warn(v);
    try {
      await route.params.data.confirm.confirm(v);
    } catch (error) {
      console.warn(error);
      // alert('Invalid code.');
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
      <Text style={styles.VerifyText}>Verify Account</Text>
      <Text style={styles.VerifyText2}>
        Enter Verification code sent to your number
      </Text>
      {/* verfiy number */}
      <View style={styles.InputCode}>
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setinput1Foucs(true);
          }}
          onBlur={() => setinput1Foucs(false)}
          style={input1Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input1}
          onChangeText={in1 => {
            setInput1(in1);
            ref2?.current?.focus();
          }}
          ref={ref1}
        />
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setInput2Foucs(true);
          }}
          onBlur={() => setInput2Foucs(false)}
          style={input2Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input2}
          onChangeText={in2 => {
            setInput2(in2);
            ref3?.current?.focus();
          }}
          ref={ref2}
        />
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setInput3Foucs(true);
          }}
          onBlur={() => setInput3Foucs(false)}
          style={input3Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input3}
          onChangeText={in3 => {
            setInput3(in3);
            ref4?.current?.focus();
          }}
          ref={ref3}
        />
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setInput4Foucs(true);
          }}
          onBlur={() => setInput4Foucs(false)}
          style={input4Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input4}
          onChangeText={in4 => {
            setInput4(in4);
            ref5?.current?.focus();
          }}
          ref={ref4}
        />
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setInput5Foucs(true);
          }}
          onBlur={() => setInput5Foucs(false)}
          style={input5Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input5}
          onChangeText={in5 => {
            setInput5(in5);
            ref6?.current?.focus();
          }}
          ref={ref5}
        />
        <TextInput
          keyboardType="numeric"
          onFocus={() => {
            setInput6Foucs(true);
          }}
          onBlur={() => setInput6Foucs(false)}
          style={input6Foucs === true ? styles.otpInput2 : styles.otpInput}
          placeholder="*"
          value={input6}
          onChangeText={async in6 => {
            setInput6(in6);
            setCode(input1 + input2 + input3 + input4 + input5 + input6);
            const v = input1 + input2 + input3 + input4 + input5 + input6;
            console.warn(v);
            Keyboard.dismiss();
            confirmCode(v);
          }}
          ref={ref6}
        />
      </View>
      {/* verfiy number */}

      <View style={styles.AppBtn}>
        <Appbutton
          onPress={() => {
            confirmCode(code);
            // navigation.navigate('VerificationDone');
          }}
          text={'Submit'}
        />
      </View>
    </View>
  );
};

export default OtpScreen;

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
    marginTop: h('7%'),
    marginLeft: h('4%'),
  },
  VerifyText2: {
    fontSize: h('2%'),
    color: '#0008',
    marginLeft: h('4%'),
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
    height: '20%',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
