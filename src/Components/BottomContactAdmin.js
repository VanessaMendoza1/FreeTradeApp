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

const BottomContactAdmin = ({visible, onPress}) => {
  return (
    <>
      {visible ? (
        <View style={styles.mainContainer}>
          <View style={styles.BottomModal}>
            <Text style={styles.MainText}>Want to contact admin?</Text>
            <View style={styles.BtnCc}>
              <TouchableOpacity onPress={onPress} style={styles.MainBtn}>
                <Text style={styles.Ccc}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.MainBtn2}>
                <Text style={styles.Ccc2}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default BottomContactAdmin;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0006',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    zIndex: 10000,
    alignItems: 'center',
  },
  BottomModal: {
    width: '100%',
    height: h('25%'),
    backgroundColor: 'white',
    paddingLeft: h('2%'),
    paddingRight: h('2%'),
    paddingTop: h('2%'),

    // alignItems: 'center',
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
    color: '#0008',
    fontSize: h('3%'),
    alignSelf: 'center',
    marginTop: h('2%'),
    marginBottom: h('5%'),
  },
  MainText: {
    color: '#000',
    fontSize: h('2.7%'),
    fontWeight: 'bold',
    marginTop: h('5%'),
  },
  BtnCc: {
    // backgroundColor: 'red',
    width: '100%',
    height: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  MainBtn: {
    width: '48%',
    height: '50%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainBtn2: {
    width: '48%',
    height: '50%',

    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  Ccc: {
    color: 'white',
    fontSize: h('2%'),
  },
  Ccc2: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
});
