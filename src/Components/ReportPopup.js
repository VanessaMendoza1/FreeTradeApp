import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../Components/Appbutton';
import Colors from '../utils/Colors';
import CheckBox from '@react-native-community/checkbox';

const ReportPopup = ({
  visible,
  onPress,
  onSend,
  onChangeText,
  onEndEditing,
  onSubmitEditing,
}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = React.useState(false);
  const [toggleCheckBox3, setToggleCheckBox3] = React.useState(false);
  return (
    <>
      {visible ? (
        <View style={styles.mainContainer}>
          <View
            style={[
              styles.BottomModal,
              {height: toggleCheckBox2 ? h('50%') : h('45%')},
            ]}>
            <Text style={styles.Contran}>Report</Text>
            <Text style={styles.Contran2}>
              Why are you reporting this user?
            </Text>
            {/* abc */}
            {/* <View style={styles.SqBook}>
              <View style={styles.leftSQ}>
                <CheckBox
                  value={toggleCheckBox}
                  style={{width: 15, height: 15}}
                  onValueChange={newValue => {
                    setToggleCheckBox2(false);
                    setToggleCheckBox(newValue);
                    setToggleCheckBox3(false);
                  }}
                  tintColors={{true: Colors.Primary}}
                  onTintColor={'#0003'}
                />
              </View>
              <View style={styles.leftSQ2}>
                <Text style={styles.SSQ1}>This is a scam</Text>
              </View>
            </View> */}
            {/* abc */}

            {/* abc */}
            {/* <View style={styles.SqBook}>
              <View style={styles.leftSQ}>
                <CheckBox
                  value={toggleCheckBox3}
                  style={{width: 15, height: 15}}
                  onValueChange={newValue => {
                    setToggleCheckBox(false);
                    setToggleCheckBox3(newValue);
                    setToggleCheckBox2(false);
                  }}
                  tintColors={{true: Colors.Primary}}
                  onTintColor={'#0003'}
                />
              </View>
              <View style={styles.leftSQ2}>
                <Text style={styles.SSQ1}>It’s illegal</Text>
              </View>
            </View> */}
            {/* abc */}

            {/* abc */}
            {/* <View
              style={[
                styles.SqBook,
                {marginBottom: toggleCheckBox2 ? h('1%') : h('5%')},
              ]}>
              <View style={styles.leftSQ}>
                <CheckBox
                  value={toggleCheckBox2}
                  style={{width: 15, height: 15}}
                  onValueChange={newValue => {
                    setToggleCheckBox(false);
                    setToggleCheckBox2(newValue);
                    setToggleCheckBox3(false);
                  }}
                  tintColors={{true: Colors.Primary}}
                  onTintColor={'#0003'}
                />
              </View>
              <View style={styles.leftSQ2}>
                <Text style={styles.SSQ1}>Other</Text>
              </View>
            </View> */}
            {/* abc */}

            {/* {toggleCheckBox2 && ( */}
            <TextInput
              style={styles.inputCC}
              placeholder={'Enter Details'}
              onChangeText={onChangeText}
              placeholderTextColor={Colors.Primary}
              multiline
              onEndEditing={onEndEditing}
              onSubmitEditing={onSubmitEditing}
            />
            {/* )} */}

            <Appbutton onPress={onSend} text={'Send'} />
            <View style={{height: h('2%')}} />
            <Appbutton onPress={onPress} text={'Cancel'} />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default ReportPopup;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0006',
    // justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10000,
    alignItems: 'center',
    padding: 50,
  },
  BottomModal: {
    width: w('95%'),

    backgroundColor: 'white',
    borderRadius: h('1%'),
    alignItems: 'center',
  },
  ImgCC: {
    // backgroundColor: 'red',
    width: '30%',
    height: '35%',
    alignSelf: 'center',
    marginTop: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconC: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  Contran: {
    color: Colors.Primary,
    fontSize: h('3%'),
    alignSelf: 'center',
    marginTop: h('2%'),
  },
  Contran2: {
    color: '#000',
    fontSize: h('2.2%'),
    // alignSelf: 'center',
    marginTop: h('1%'),
    marginBottom: h('1%'),
  },
  SqBook: {
    // backgroundColor: 'red',
    width: '90%',
    height: '7%',
    flexDirection: 'row',
    marginBottom: h('1%'),
  },
  leftSQ: {
    // backgroundColor: 'gold',
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSQ2: {
    // backgroundColor: 'green',
    width: '75%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: h('1%'),
  },
  SSQ1: {
    color: '#0008',
    fontSize: h('2%'),
  },
  inputCC: {
    width: '90%',
    height: h('15%'),
    // backgroundColor: 'red',
    marginBottom: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    paddingLeft: h('1%'),
    fontSize: h('2%'),
  },
});
