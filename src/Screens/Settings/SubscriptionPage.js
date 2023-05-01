import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import SubModal from '../../Components/SubModal';
import Icons from '../../utils/icons';
import {CardField, createToken, useStripe} from '@stripe/stripe-react-native';
import CreatePaymentIntent from '../../utils/stripe';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {SubDataAdd} from '../../redux/subSlicer';

import moment from 'moment';
import LoadingScreen from '../../Components/LoadingScreen';

const SubscriptionPage = ({navigation}) => {
  const [sub, setsub] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [plan, setplan] = React.useState('Personal');
  const MyData = useSelector(state => state.counter.data);
  const [loading, setloading] = React.useState(false);
  const [businessSubscriptionPricing, setBusinessSubscriptionPricing] = React.useState(9.99)
  const [individualSubscriptionPricing, setIndividualSubscriptionPricing] = React.useState(1.99)

  React.useEffect(() => {
    firestore()
      .collection('AppConfigurations')
      .where('dataType', 'in', ['IndividualSubscriptionTariff', 'BusinessSubscriptionTariff'])
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const subscriptionData = documentSnapshot.data()
          if (subscriptionData.dataType == 'IndividualSubscriptionTariff'){
            setIndividualSubscriptionPricing(subscriptionData.value)
          } else if (subscriptionData.dataType == 'BusinessSubscriptionTariff'){
            setBusinessSubscriptionPricing(subscriptionData.value)
          }
        })
        .then((err) => {
          console.log(err)
        })
      });
  }, [])


  return (
    <>
      {loading ? <LoadingScreen /> : null}
      <SubModal
        visible={sub}
        onPress={() => {
          setsub(!sub);
          setModalVisible(true);
        }}
        Plan={plan}
      />

      <ImageBackground
        source={require('../../../assets/subs.png')}
        style={styles.imgBg}>
        <Text>SubscriptionPage</Text>

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
            {/* <Text style={styles.FontWork}>Subscribe</Text> */}
          </View>
        </View>
        {/* header */}

        <View style={styles.MainContainer}>
          <TouchableOpacity
            onPress={() => {
              setplan('Personal');
              setsub(!sub);
            }}
            style={styles.mainViewCC}>
            <Text style={styles.mainText123}>Personal Plan ${individualSubscriptionPricing}/Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setplan('Business');
              setsub(!sub);
            }}
            style={styles.mainViewCC}>
            <Text style={styles.mainText123}>Business Plan ${businessSubscriptionPricing}/Month</Text>
            <Text style={styles.mainText1233}>Let’s grow your business!</Text>
          </TouchableOpacity>
        </View>

        {MyData.BussinessDetails === true && (
          <View style={styles.LastPageCC}>
            <TouchableOpacity
              onPress={() => {
                alert('IN Progress');
              }}
              style={styles.mainViewCC2}>
              <Text style={styles.mainText12}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Stripe</Text>
            <PaymentScreen
              amount={plan === 'Personal' ? 199 : 999}
              plan={plan}
              onDone={() => {
                setModalVisible(!modalVisible);
                setloading(false);
                // navigation.goBack();
                if (plan === 'Personal') {
                  navigation.goBack();
                } else {
                  navigation.navigate('BussinessAccountEdits');
                }
              }}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SubscriptionPage;

function PaymentScreen({navigation, amount, plan, onDone, onLoading}) {
  const dispatch = useDispatch();
  const {confirmPayment} = useStripe();
  const MyData = useSelector(state => state.counter.data);
  const [loading, setloading] = React.useState(false);

  const MySubscriptionPackage = async () => {
    let data = [];
    await firestore()
      .collection('sub')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().userid === MyData.UserID) {
            data.push(documentSnapshot.data());
          }
        });
      });
    await dispatch(SubDataAdd(data));
    onDone();
  };

  let uploadSubscription = () => {
    const now = moment.utc();
    var end = moment().add(30, 'days');
    var days = now.diff(end, 'days');
    // console.warn(days >= 0);

    firestore()
      .collection('sub')
      .doc(MyData.UserID)
      .set({
        userid: MyData.UserID,
        startDate: JSON.stringify(now),
        endDate: JSON.stringify(end),
        plan: plan,
        price: amount === 999 ? '9.99$' : '1.99',
        Cancel: false,
      })
      .then(() => {
        MySubscriptionPackage();
      })
      .catch(err => {
        console.warn(err);
      });
  };

  return (
    <>
      {loading ? <LoadingScreen /> : null}
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={async cardDetails => {
          console.warn(cardDetails.complete);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonClose]}
        onPress={async () => {
          setloading(true);
          // onLoading();
          let d1 = {
            amount: amount,
          };
          try {
            const res = await CreatePaymentIntent(d1);
            console.warn(res.data.paymentIntent);
            if (res?.data?.paymentIntent) {
              let req = await confirmPayment(res?.data?.paymentIntent, {
                paymentMethodType: 'Card',
              });
              console.warn(req);
              await uploadSubscription();
            }
          } catch (error) {
            console.warn(error);
          }
        }}>
        <Text style={styles.textStyle}>Submit</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  imgBg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: w('100%'),
    height: h('100%'),
    backgroundColor: '#0008',
  },
  Header: {
    width: '100%',
    height: h('8%'),
    // backgroundColor: Colors.Primary,
    flexDirection: 'row',
  },
  LeftContainer: {
    width: '15%',
    height: '80%',
    backgroundColor: '#fff3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
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
  MainContainer: {
    width: '90%',
    height: '70%',
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainViewCC: {
    width: '100%',
    height: h('18%'),
    backgroundColor: Colors.Primary,
    marginTop: h('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
  },
  mainViewCC2: {
    width: '80%',
    height: h('7%'),
    backgroundColor: 'red',
    // marginTop: h('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
    alignSelf: 'center',
  },
  mainText123: {
    color: '#fff',
    fontSize: h('2.8%'),
    fontWeight: 'bold',
  },
  mainText12: {
    color: '#fff',
    fontSize: h('2.2%'),
    fontWeight: 'bold',
  },
  mainText1233: {
    color: 'gold',
    fontSize: h('2.2%'),
  },
  modalView: {
    width: w('90%'),
    height: h('40%'),
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
  LastPageCC: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
  },
});
