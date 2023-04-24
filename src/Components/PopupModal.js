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

const PopupModal = ({visible, onPress, onPress2}) => {
  return (
    <>
      {visible ? (
        <View style={styles.mainContainer}>
          <View style={[styles.BottomModal]}>
            <View style={styles.ImgCC}>
              <Image
                style={styles.iconC}
                source={require('../../assets/chk.png')}
              />
            </View>

            <Text style={styles.Contran}>Your Ad has been Posted</Text>
            <Appbutton onPress={onPress} text={'Add another Ad'} />
            <View style={styles.Space} />
            <Appbutton onPress={onPress2} text={'Cancel'} />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default PopupModal;
const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0006',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10000,
    alignItems: 'center',
  },
  BottomModal: {
    width: '95%',
    height: h('48%'),
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
    color: '#0008',
    fontSize: h('3%'),
    alignSelf: 'center',
    marginTop: h('2%'),
    marginBottom: h('5%'),
  },
  Space: {
    height: '2%',
  },
});
