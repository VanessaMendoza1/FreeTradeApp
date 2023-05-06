import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import Appbutton from '../../Components/Appbutton';
import PopupModal from '../../Components/PopupModal';

import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import moment from 'moment';
import CreatePaymentIntent from '../../utils/stripe';
import {CardField, createToken, useStripe} from '@stripe/stripe-react-native';

import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';
import LoadingScreen from '../../Components/LoadingScreen';
import { getAdsPrices } from '../Dashboard/Postad'

const PostPromotion = ({navigation, route}) => {
  console.warn(route.params.data.title);
  const dispatch = useDispatch();
  const [items, setItems] = React.useState([
    // {label: '$1 (1 ad for 15 days)', value: 100},
    // {label: '$5 (1 ad for 30 days)', value: 500},
    // {label: '$8 (2 ad for 30 days)', value: 800},
  ]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [toggleCheckBox3, setToggleCheckBox3] = React.useState(false);
  const [modalVisble, setmodalVisble] = React.useState(false);

  const MyData = useSelector(state => state.counter.data);
  const [loading, setloading] = React.useState(false);

  React.useEffect(() => {
    getAdsPrices(setItems)
  }, [])

  const adposted = () => {
    setloading(true);
    if (toggleCheckBox3) {
      firestore()
        .collection('Ads')
        .doc()
        .set({
          UserID: MyData.UserID,
          ads: value,
          Adtype: 'Personal',
          AdGraphicLink: route.params.data.images[0],
          TagLine: '',
          MediaType: 'Image',
        })
        .then(() => {
          setmodalVisble(true);
          console.warn('Ad Posted');
          setloading(false);
        })
        .catch(err => {
          setloading(false);
          console.warn(err);
        });
    } else {
      alert('You need to Agree to Terms and Condition');
    }
  };

  const PostAd = async () => {
    console.warn('HEHHE');
    const now = moment.utc();
    var end = moment().add(value === 100 ? 15 : 30, 'days');
    var days = now.diff(end, 'days');

    setloading(true);
    if (value === '') {
      alert('select The Ads Tier');
      setloading(false);
    } else {
      if (toggleCheckBox3) {
        firestore()
          .collection('Ads')
          .doc()
          .set({
            UserID: MyData.UserID,
            ads: value,
            Adtype: 'Personal',
            AdGraphicLink: route.params.data.images[0],
            TagLine: '',
            MediaType: 'Image',
            title: route.params.data.title,
            user: MyData,
            startDate: JSON.stringify(now),
            endDate: JSON.stringify(end),
            BussinessName:
              MyData.AccountType === 'Bussiness' ? MyData.BusinessName : '',
          })
          .then(() => {
            Allads();
            setmodalVisble(true);
            console.warn('Ad Posted');
            setloading(false);
          })
          .catch(err => {
            setloading(false);
            console.warn(err);
          });
      } else {
        setloading(false);
        alert('Please accept the Terms & Condition ');
      }
    }
  };

  const Allads = async () => {
    let ImageData = [];
    let VideoData = [];

    await firestore()
      .collection('Ads')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().MediaType === 'Image') {
            ImageData.push(documentSnapshot.data());
          }
          if (documentSnapshot.data().MediaType === 'Videos') {
            VideoData.push(documentSnapshot.data());
          }
        });
      });

    await dispatch(AddImageAds(ImageData));
    await dispatch(AddVideoAds(VideoData));
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <PopupModal
        visible={modalVisble}
        onPress={() => {
          navigation.navigate('MakePost');
          setmodalVisble(false);
        }}
        onPress2={() => {
          setmodalVisble(false);
        }}
      />

      <View style={styles.MainContainer}>
        {/* header */}
        <View style={styles.Header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MakePost');
            }}
            style={styles.LeftContainer}>
            <Icon name="arrow-back-outline" size={30} color="#ffff" />
          </TouchableOpacity>
          <View style={styles.MiddleContainer}>
            <Text style={styles.FontWork}>Promotion</Text>
          </View>
        </View>
        {/* header */}

        <View style={styles.MainPromtionContainer}>
          <Text style={styles.PromtionText}>
            Sell or Trade Faster Promoting!
          </Text>
          {/* img */}
          <View style={styles.ProfileContainer}>
            <View style={styles.ProfileCC}>
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri: route.params.data.images[0]
                    ? route.params.data.images[0]
                    : 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80',
                }}
              />
            </View>
          </View>
          {/* img */}
          <Text style={styles.NameC}>{route.params.data.title}</Text>

          {/* dropdown */}

          <View style={{zIndex: 2000, marginTop: h('1%')}}>
            <Text style={styles.NameC2}>Packages</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              zIndex={3000}
              setValue={setValue}
              setItems={setItems}
              style={{
                borderWidth: h('0.3%'),
                borderColor: Colors.Primary,
                zIndex: 100000,
                backgroundColor: 'white',
              }}
            />
          </View>
          {/* dropdown */}

          {/* terms & condition */}
          <View style={styles.RemeberMebOx2}>
            <CheckBox
              value={toggleCheckBox3}
              style={{width: 20, height: 20}}
              onValueChange={newValue => setToggleCheckBox3(newValue)}
              boxType={'circle'}
              tintColors={{true: Colors.Primary}}
              onTintColor={'#F4DCF8'}
            />
            <Text style={styles.RemebermeText2}>
              I Agree to{' '}
              <Text
                style={{
                  color: Colors.Primary,
                  fontWeight: 'bold',
                  fontSize: h('2.2%'),
                }}>
                Terms & Condition
              </Text>
            </Text>
          </View>
          {/* terms & condition */}
          {/* sqbook */}
          <View style={styles.SqBook}>
            <View style={styles.leftSQ}>
              <Image
                style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                source={require('../../../assets/csq.png')}
              />
            </View>
            <View style={styles.leftSQ2}>
              <Text style={styles.SSQ1}>Get more exposure</Text>
            </View>
          </View>
          <View style={styles.SqBook}>
            <View style={styles.leftSQ}>
              <Image
                style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                source={require('../../../assets/csq.png')}
              />
            </View>
            <View style={styles.leftSQ2}>
              <Text style={styles.SSQ1}>Promote for multiple days</Text>
            </View>
          </View>
          <View style={styles.SqBook}>
            <View style={styles.leftSQ}>
              <Image
                style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                source={require('../../../assets/csq.png')}
              />
            </View>
            <View style={styles.leftSQ2}>
              <Text style={styles.SSQ1}>Generate more sales</Text>
            </View>
          </View>
          {/* sqbook */}
          <View style={{marginBottom: h('1%')}} />
          <Appbutton
            text={'Start Promotion'}
            onPress={() => {
              // adposted();

              setModalVisible(!modalVisible);

              // navigation.navigate('MakePost');
            }}
          />
        </View>
      </View>
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
              amount={value}
              onLoading={() => {
                setloading(true);
              }}
              onDone={() => {
                setModalVisible(!modalVisible);
                PostAd();
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
function PaymentScreen({navigation, amount, onDone, onLoading}) {
  const {confirmPayment} = useStripe();
  const [loading, setloading] = React.useState(false);

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
              await onDone();
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

export default PostPromotion;

const styles = StyleSheet.create({
  MainContainer: {
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
    fontSize: h('2.5%'),
  },
  NameC2: {
    color: Colors.Primary,
    fontSize: h('2.5%'),
    marginBottom: h('0.5%'),
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
    height: '7%',
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
});
