import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
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
import auth from '@react-native-firebase/auth';

import moment from 'moment';
import LoadingScreen from '../../Components/LoadingScreen';
import axios from 'axios';

import {priceFormatter} from '../../utils/helpers/helperFunctions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PaymentBottomSheet from '../../Components/BottomSheet';

const getSubscriptionTarriff = (
  setIndividualSubscriptionPricing,
  setBusinessSubscriptionPricing,
) => {
  firestore()
    .collection('AppConfigurations')
    .where('dataType', 'in', [
      'IndividualSubscriptionTariff',
      'BusinessSubscriptionTariff',
    ])
    .get()
    .then(async querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const subscriptionData = documentSnapshot.data();
        if (subscriptionData.dataType == 'IndividualSubscriptionTariff') {
          setIndividualSubscriptionPricing(subscriptionData.value);
        } else if (subscriptionData.dataType == 'BusinessSubscriptionTariff') {
          setBusinessSubscriptionPricing(subscriptionData.value);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const getSubscriptionDetails = async setIsSubscriptionValid => {
  const currentUserId = auth().currentUser.uid;
  let isSubscriptionValid = false;
  await firestore()
    .collection('sub')
    .get()
    .then(async querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        if (documentSnapshot.data()?.userid === currentUserId) {
          const now = moment.utc();
          var end = JSON.parse(documentSnapshot.data().endDate);
          var days = now.diff(end, 'days');
          console.log({days});
          if (days >= 1) {
            isSubscriptionValid = true;
          }
        }
      });
      setIsSubscriptionValid(isSubscriptionValid);
    });
};

const SubscriptionPage = ({navigation}) => {
  const [sub, setsub] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modall, setModal] = React.useState(false);
  const [plan, setplan] = React.useState('Personal');
  const MyData = useSelector(state => state.counter.data);
  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const {confirmPayment} = useStripe();
  const [cardData, setCardData] = React.useState('');
  const [businessSubscriptionPricing, setBusinessSubscriptionPricing] =
    React.useState(9.99);
  const [individualSubscriptionPricing, setIndividualSubscriptionPricing] =
    React.useState(1.99);
  const [isSubscriptionValid, setIsSubscriptionValid] = React.useState(false);
  React.useEffect(() => {
    getSubscriptionDetails(setIsSubscriptionValid);
    getSubscriptionTarriff(
      setIndividualSubscriptionPricing,
      setBusinessSubscriptionPricing,
    );
  }, []);
  let uploadSubscription = () => {
    firestore()
      .collection('sub')
      .doc(MyData.UserID)
      .delete()
      .then(async () => {
        await dispatch(SubDataAdd([]));
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };
  const subdata = useSelector(state => state.sub.subdata);
  // let uploadSubscription = () => {
  //   firestore()
  //     .collection('sub')
  //     .doc(MyData?.UserID)
  //     .delete()
  //     .then(async () => {
  //       console.log('Document successfully deleted!');
  //       await dispatch(SubDataAdd([]));
  //       navigation.goBack();
  //       setloading(false);
  //     })
  //     .catch(error => {
  //       setloading(false);
  //       // setModalVisible(!modalVisible);
  //       console.error('Error removing document: ', error);
  //     });
  // };
  // const paymentScreen = (amount, plan, email) => {

  return (
    <>
      {loading ? <LoadingScreen /> : null}
      <SubModal
        visible={sub}
        onPress={() => {
          setsub(!sub);
          setModal(true);
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

        {subdata.length > 0 ? (
          // {(subdata.length > 0 ) ? (

          <View style={styles.LastPageCC}>
            <TouchableOpacity
              onPress={() => {
                setloading(true);
                axios
                  .get(
                    `https://umeraftabdev.com/FreeTradeApi/public/api/subscriptions/cancel?email=${MyData?.email}`,
                  )
                  .then(res => {
                    console.log(res?.data);
                    setloading(false);
                    Alert.alert('Subscription cancelled successfully!');
                    uploadSubscription();
                  })
                  .catch(err => {
                    console.log(err);
                    setloading(false);
                    // setModalVisible(!modalVisible);
                    // uploadSubscription();
                  });
              }}
              style={styles.mainViewCC2}>
              <Text style={styles.mainText12}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={{...styles.mainText123, textAlign: 'center'}}>
              You currently don't have any subscription
            </Text>
            <View style={styles.MainContainer}>
              <View style={styles.planContainer}>
                <TouchableOpacity
                  style={styles.mainViewCC}
                  onPress={() => {
                    // setModalVisible(true)
                    setplan('price_1N64c3KAtBxeYOh2sxd0LP36');
                    setsub(!sub);
                  }}>
                  <Text style={styles.mainText123}>
                    Personal Plan{' '}
                    {priceFormatter(individualSubscriptionPricing)}
                    /Month
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigation('PaymentScree', {
                    //   navigation,
                    //   amount: MyData?.amount,
                    //   onDone: () => {},
                    //   onLoading: () => {},
                    //   email: MyData?.email,

                    //   data: MyData,
                    // });
                    // setModalVisible(true)
                    setplan('price_1N64dIKAtBxeYOh2knKZAbOk');
                    setsub(!sub);
                  }}
                  style={styles.mainViewCC}>
                  <Text style={styles.mainText123}>
                    Business Plan {priceFormatter(businessSubscriptionPricing)}
                    /Month
                  </Text>
                  <Text style={styles.mainText1233}>
                    Let’s grow your business!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <PaymentBottomSheet
          modall={modall}
          setModal={setModal}
          setloading={setloading}
          businessSubscriptionPricing={businessSubscriptionPricing}
          individualSubscriptionPricing={individualSubscriptionPricing}
          plan={plan}
          MyData={MyData}
        />
      </ImageBackground>
    </>
  );
};

export default SubscriptionPage;

export {getSubscriptionTarriff};

const styles = StyleSheet.create({
  imgBg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  planContainer: {width: '90%', marginTop: h(1), height: h(40)},
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
    width: '100%',
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
    width: w('100%'),
    height: h('100%'),
    backgroundColor: 'white',
    borderRadius: h('0.7%'),
    alignItems: 'center',
    padding: 10,
  },
  button: {
    elevation: 2,
    marginTop: h('2%'),
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
    height: h('50%'),
    // backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
  },
  container: {
    flex: 1,
    padding: 24,
    width: '100%',
    height: '100%',
    marginTop: h(2),
    zIndex: 1,
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
