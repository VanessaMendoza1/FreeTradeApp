import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Modal} from 'react-native';
import {w, h} from 'react-native-responsiveness';
import Colors from '../../utils/Colors';
import PaymentScreen from './PaymentScreen';

const PaymentComponent = ({
  setloading,
  value,
  MyData,
  modalVisiblee,
  onRequestClose,
}) => {
  console.log(modalVisiblee);
  // const [modalVisible, setModalVisible] = useState(modalVisiblee);
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={onRequestClose()}
        onRequestClose={() => {
          onRequestClose();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Stripe</Text>
            <PaymentScreen
              amount={value}
              email={MyData.email}
              onLoading={() => {
                setloading(true);
                onRequestClose();
              }}
              onDone={() => {
                onRequestClose();
                // PostAd();
              }}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                onRequestClose();
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentComponent;
const styles = StyleSheet.create({
  MainContainer: {
    // flex: 1,
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
  MainPromtionContainer: {
    width: '95%',
    height: h('85%'),
    // backgroundColor: 'red',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: h('2%'),
  },
  PromtionText: {
    color: Colors.Primary,
    fontSize: h('2.8%'),
    fontWeight: 'bold',
  },
  ProfileContainer: {
    width: '55%',
    height: h('25%'),

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginTop: h('2%'),
  },
  ProfileCC: {
    width: '100%',
    height: '100%',
    // borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  NameC: {
    color: '#000',
    fontSize: h('1.5%'),
  },
  NameC2: {
    color: Colors.Primary,
    fontSize: h('2.5%'),
    marginBottom: h('0.5%'),
  },
  inputContainercc: {
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    height: h('7%'),
    width: '100%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),
    marginTop: h('1%'),
    marginBottom: 20,
  },
  RemeberMebOx2: {
    width: '100%',
    height: '10%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RemebermeText2: {
    color: '#0009',
    fontSize: h('2.2%'),
    marginLeft: h('1%'),
  },
  SqBook: {
    // backgroundColor: 'red',
    width: '100%',
    height: '5%',
    flexDirection: 'row',
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
  },
  SSQ1: {
    color: '#0008',
    fontSize: h('2%'),
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: w('100%'),
    height: h('100%'),
    backgroundColor: '#0009',
  },
  modalView: {
    width: w('100%'),
    height: h('60%'),
    backgroundColor: 'white',
    borderRadius: h('0.7%'),
    alignItems: 'center',
    padding: 10,
  },
  button: {
    elevation: 2,
    marginBottom: h('2%'),
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Colors.Primary,
    width: '80%',
    height: h('7%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontSize: h('2%'),
    fontWeight: 'bold',
    marginTop: h('2%'),
    color: Colors.Primary,
  },
});
