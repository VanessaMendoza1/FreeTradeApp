import BottomSheet from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import axios from 'axios';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {SubDataAdd} from '../redux/subSlicer';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {AddImageAds, AddVideoAds} from '../redux/adsSlicer';
import {PostAdd} from '../redux/postSlice';
import auth from '@react-native-firebase/auth';
const PaymentBottomSheet = ({
  modall,
  setModal,
  setloading,
  businessSubscriptionPricing,
  individualSubscriptionPricing,
  plan,
  MyData,
  toggleCheckBox3,
  value,
  Title,
  images,
  from,
  amount,
  businessName,
  postData,
  type,
  subdata,
  ImageUrl,
  VideoUrl,
  TagLine,
  setImgeUrl,
  setVideoUrl,
  setTagLine,
  setValue,
  setToggleCheckBox3,
}) => {
  const [cardData, setCardData] = React.useState('');
  const bottomSheetRef = useRef();
  const [indexSnap, setIndexSnap] = useState(0);
  const dispatch = useDispatch();
  // variables
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);
  const uploadSubscription = amount => {
    const now = moment.utc();
    var end = moment().add(30, 'days');
    var days = now.diff(end, 'days');
    console.log(MyData?.UserID);
    firestore()
      .collection('sub')
      .doc(MyData?.UserID)
      .set({
        userid: MyData?.UserID,
        startDate: JSON.stringify(now),
        endDate: JSON.stringify(end),
        plan:
          plan === 'price_1N64c3KAtBxeYOh2sxd0LP36' ? 'Personal' : 'Bussiness',
        price: amount === 999 ? '9.99$' : '1.99',
      })
      .then(res => {
        MySubscriptionPackage();
      })
      .catch(err => {
        setloading(false);
      });
  };

  const MySubscriptionPackage = async () => {
    let data = [];
    await firestore()
      .collection('sub')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data()?.userid === MyData?.UserID) {
            data.push(documentSnapshot.data());
          }
        });
      });
    await dispatch(SubDataAdd(data));
    setloading(false);
  };
  const handleIndex = useCallback(index => {
    return setIndexSnap(index);
  }, []);
  const _createToken = async (amount, plan, email) => {
    setloading(false);
    axios
      .get(
        `https://umeraftabdev.com/FreeTradeApi/public/api/subscribe?card_number=${cardData.number}&email=${email}&sub_plan=${plan}&expiry=${cardData.expiry}&cvc=${cardData.cvc}`,
      )
      .then(res => {
        alert('Successfully Subscribed');
        // if (res?.data?.message === 'Subscription created successfully') {
        uploadSubscription(amount);
      })
      .catch(err => {
        setloading(false);
        setModal(false);
        alert('Please re-check your Card & try again');
      });
  };
  const _createTokenPromotion = async amount => {
    console.log(postData, images, type, 'hikohik');

    // setloading(false);
    axios
      .get(
        `https://umeraftabdev.com/FreeTradeApi/public/api/charge?card_number=${
          cardData?.number
        }&email=${MyData?.email}&amount=${
          amount * 100
        }&description=Test one time payment&expiry=${cardData?.expiry}&cvc=${
          cardData.cvc
        }`,
      )
      .then(res => {
        if (res.data.message === 'Payment successfull.') {
          PostAd();
        }
      })
      .catch(err => {
        alert('something went wrong');
      });
  };
  const _createTokenAdvertisement = async amount => {
    axios
      .get(
        `https://umeraftabdev.com/FreeTradeApi/public/api/charge?card_number=${
          cardData.number
        }&email=${MyData?.email}&amount=${
          amount * 100
        }&description=Test one time payment&expiry=${cardData.expiry}&cvc=${
          cardData.cvc
        }`,
      )
      .then(res => {
        if (res.data.message === 'Payment successfull.') {
          // alert('ALL CLEAR');
          PostAdAdv();
        }
      })
      .catch(err => {
        setmodalVisble(false);
        alert('something went wrong');
      });
  };
  const PostAd = async () => {
    let currentUserId = auth().currentUser.uid;
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
            UserID: currentUserId,
            ads: value,
            Adtype: 'Personal',
            AdGraphicLink: images.length > 0 ? images[0] : '',
            TagLine: '',
            MediaType: 'Image',
            title: Title,
            user: MyData,
            startDate: JSON.stringify(now),
            endDate: JSON.stringify(end),
            BussinessName:
              MyData?.AccountType === 'Bussiness'
                ? MyData?.BusinessName
                : businessName,
          })
          .then(() => {
            if (type === 'post') {
              postAdd(postData);
            } else {
              Allads();
            }
            setloading(false);
          })
          .catch(err => {
            setloading(false);
          });
      } else {
        setloading(false);
        alert('Please accept the Terms & Condition ');
      }
    }
  };
  const postAdd = async data => {
    await firestore()
      .collection('Post')
      .doc(data?.DocId)
      .set()
      .then(async doc => {
        let PostData = [];
        await firestore()
          .collection('Post')
          .get()
          .then(async querySnapshot => {
            console.log('Total users: ', querySnapshot.size);

            querySnapshot.forEach(documentSnapshot => {
              PostData.push(documentSnapshot.data());
            });
            await dispatch(PostAdd(PostData));
          })
          .catch(err => {
            console.log('Caught error while submitting post');
            console.log(err);
          });
        setloading(false);
      })
      .catch(err => {
        setloading(false);
      });
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
  const PostAdAdv = async () => {
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
            Adtype:
              subdata.length > 0
                ? subdata[0].plan === 'Business'
                  ? 'Business'
                  : 'Personal'
                : null,
            AdGraphicLink: ImageUrl !== '' ? ImageUrl : VideoUrl,
            TagLine: TagLine !== '' ? TagLine : '',
            MediaType: ImageUrl && VideoUrl === '' ? 'Image' : 'Videos',
            title: Title,
            user: MyData,
            startDate: JSON.stringify(now),
            endDate: JSON.stringify(end),
          })
          .then(() => {
            Allads();
            setloading(false);
            setModal(false);
            setImgeUrl('');
            setVideoUrl('');
            setTagLine('');
            setValue('');
            setToggleCheckBox3(false);
          })
          .catch(err => {
            setloading(false);
          });
      } else {
        setloading(false);
        alert('Please accept the Terms & Condition ');
      }
    }
  };

  const AlladsAdv = async () => {
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
    modall && (
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Stripe</Text>
              <LiteCreditCardInput
                onChange={({values}) => {
                  setCardData(values);
                }}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={async () => {
                  // onLoading();
                  setModal(false);
                  if (from === 'Promotion') {
                    _createTokenPromotion(amount);
                  } else if (from === 'adv') {
                    _createTokenAdvertisement(amount);
                  } else {
                    _createToken(
                      plan === '1.99$'
                        ? individualSubscriptionPricing
                        : businessSubscriptionPricing,
                      plan,
                      MyData?.email,
                    );
                  }
                  setModal(false);
                  // await uploadSubscription();
                }}>
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
              {/* </> */}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  // handleClosePress();
                  setModal(false);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    )
  );
};
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
export default PaymentBottomSheet;
