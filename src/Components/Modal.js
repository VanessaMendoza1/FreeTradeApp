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

const Modal = ({visible}) => {
  return (
    <>
      {visible ? (
        <View style={styles.mainContainer}>
          <View style={styles.BottomModal}>
            {/* TOp Header */}
            <View style={styles.TopHeader}>
              <View style={styles.LastTab2}>
                <Icon name="chevron-back-outline" size={25} color={'red'} />
              </View>
              <View style={styles.MiddleTab}>
                <Text style={styles.EnText}>Ends</Text>
              </View>
              <TouchableOpacity style={styles.LastTab}>
                <Text style={styles.EnText3}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default Modal;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0003',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    zIndex: 10000,
  },
  BottomModal: {
    width: '100%',
    height: h('35%'),
    backgroundColor: 'white',
  },
  TopHeader: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ButtonContainer: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  MiddleTab: {
    width: '40%',
    // backgroundColor: 'green',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LastTab: {
    width: '40%',
    // backgroundColor: 'orange',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LastTab2: {
    width: '40%',
    // backgroundColor: 'orange',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: h('4%'),
  },
  EnText: {
    color: Colors.dark,
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  EnText2: {
    color: '#0007',
    fontSize: h('1.7%'),
  },
  EnText3: {
    color: Colors.Secondary,
    fontSize: h('2.2%'),
    fontWeight: 'bold',
  },
  Button: {
    width: '30%',
    height: '100%',
    borderColor: '#0003',
    borderWidth: h('0.2%'),
    borderRadius: h('0.2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectedButton: {
    width: '30%',
    height: '100%',
    borderColor: Colors.Secondary,
    borderWidth: h('0.2%'),
    borderRadius: h('0.2%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7D3F0',
  },
  BtnText: {
    color: Colors.Secondary,
    fontSize: h('2%'),
  },
  LastContainer: {
    width: w('100%'),
    height: h('40%'),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  LastContainer2: {
    width: '100%',
    height: '70%',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  LastTextC: {
    paddingLeft: h('4.5%'),
    paddingRight: h('4.5%'),
    marginTop: h('5%'),
  },
  img: {
    width: '30%',
    height: '30%',
    // backgroundColor: 'red',
  },
  ImgC: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    resizeMode: 'contain',
  },
  MainTxt: {
    width: '100%',
    height: h('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  TextInput2: {
    width: '15%',
    height: h('7%'),
    backgroundColor: '#0003',
    borderRadius: h('1%'),
    paddingLeft: h('3%'),
  },
  Timexts: {
    color: Colors.dark,
    fontSize: h('2%'),
    fontWeight: 'bold',
    marginLeft: h('2%'),
  },
  PickerModal: {
    width: '100%',
    height: h('30%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
