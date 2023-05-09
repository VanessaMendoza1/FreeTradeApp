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
import NotificationHead from '../../Components/NotificationHead';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import Appbutton from '../../Components/Appbutton';
import PopupModal from '../../Components/PopupModal';
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlayer from 'react-native-video-player';

import * as ImagePickers from 'react-native-image-picker';

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import storage from '@react-native-firebase/storage';
import LoadingScreen from '../../Components/LoadingScreen';
import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import moment from 'moment';
import CreatePaymentIntent from '../../utils/stripe';
import {CardField, createToken, useStripe} from '@stripe/stripe-react-native';

const getAdsPrices = (callback) => {
  let adsPrices = []
  firestore()
    .collection('AppConfigurations')
    .where('dataType', '==', 'adsTariff')
    .get()
    .then(async querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const addTariffData = documentSnapshot.data()
        let tariffs = addTariffData.value
        tariffs.map((tariffData) => {
          let { charges, duration, numberOfAds } = tariffData
          if (numberOfAds > 1){
            adsPrices.push({label: `$${charges} (${numberOfAds} ads for ${duration} days)`, value: charges})
          } else {
            adsPrices.push({label: `$${charges} (${numberOfAds} ad for ${duration} days)`, value: charges})
          }
        })
        adsPrices = adsPrices.filter((item) => item != "")
        callback(adsPrices)
      })
      .then((err) => {
        console.log(err)
      })
    });

  firestore()
    .collection('Category')
    .get()
    .then(async querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        let categoryData = documentSnapshot.data()
        let { title, subCategory } = categoryData
        let subCategories = []
        if (subCategory != null && subCategory != undefined && Array.isArray(subCategory)){
          subCategory.map((categoryData) => {
            let { title: subCategoryTitle } = categoryData
            subCategories.push(subCategoryTitle)
          })
        }
        adsPrices.push(``)
      });
      console.log({adsPrices})

      callback(adsPrices)

    });
}

const Postad = ({navigation}) => {

  
  const dispatch = useDispatch();
  const [activeField, setActiveField] = React.useState('Personal');
  const [toggleCheckBox, setToggleCheckBox] = React.useState(true);
  const [toggleCheckBox2, setToggleCheckBox2] = React.useState(false);
  const [toggleCheckBox3, setToggleCheckBox3] = React.useState(false);
  const [modalVisble, setmodalVisble] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [showUploadBox, setShowUploadBox] = React.useState(false);
  const [ImageUrl, setImgeUrl] = React.useState('');
  const [VideoUrl, setVideoUrl] = React.useState('');
  const [TagLine, setTagLine] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [getvideogaleery, setgetvideo] = React.useState();

  const [loading, setloading] = React.useState(false);

  const MyData = useSelector(state => state.counter.data);
  const subdata = useSelector(state => state.sub.subdata);

  React.useEffect(() => {
    getAdsPrices(setItems)
  }, [])
  // console.warn(subdata[0].plan === 'Business');
  // console.warn(value);

  const openPhoto = () => {
    setloading(true);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image.path);
        setShowUploadBox(false);
        // end
        const uploadTask = storage()
          .ref()
          .child(`/items/${Date.now()}`)
          .putFile(image.path);
        uploadTask.on(
          'state_changed',
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              // console.warn('DONE');
            }
          },
          error => {
            console.log(error);
            setloading(false);
            alert('Something went wrong');
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              setloading(false);
              setImgeUrl(downloadURL);
            });
          },
        );

        // end
      })
      .catch(err => {
        setShowUploadBox(false);
        console.warn(err);
        setloading(false);
        alert('Something went wrong');
      });
  };
  const openCamera = () => {
    // setloading(true);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image.path);
        setShowUploadBox(false);
        // end
        const uploadTask = storage()
          .ref()
          .child(`/items/${Date.now()}`)
          .putFile(image.path);
        uploadTask.on(
          'state_changed',
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              // console.warn('DONE');
            }
          },
          error => {
            console.log(error);
            setloading(false);
            alert('Something went wrong');
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              setloading(false);
              setImgeUrl(downloadURL);
            });
          },
        );

        // end
      })
      .catch(err => {
        setShowUploadBox(false);
        console.warn(err);
        setloading(false);
        alert('Something went wrong');
      });
  };
  const openVideo = async uri => {
    setloading(true);
    try {
      // const pickerResult = await DocumentPicker.pickSingle({
      //   presentationStyle: 'fullScreen',
      //   copyTo: 'cachesDirectory',
      //   type: types.allFiles,
      // });

      const uploadTask = storage()
        .ref()
        .child(`/${uri}/${Date.now()}`)
        .putFile(uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) {
            // console.warn('DONE');
          }
        },
        error => {
          console.log(error);
          setloading(false);
          alert('Something went wrong');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setVideoUrl(downloadURL);
            console.warn(downloadURL);
            setloading(false);
          });
        },
      );

      // end

      // setResult([pickerResult]);
    } catch (e) {
      setloading(false);
      console.warn(e);
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
            setmodalVisble(true);
            console.warn('Ad Posted');
            setloading(false);
            setImgeUrl('');
            setVideoUrl('');
            setTagLine('');
            setValue('');
            setToggleCheckBox3(false);
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

    console.warn(ImageData);
  };

  const getvideo = () => {
    setloading(true);
    ImagePickers.launchImageLibrary(
      {
        mediaType: 'video',
      },
      response => {
        // console.warn(response);
        // alert(response);
        response.assets?.map(i => {
          console.log('response', i.uri);
          let d = i?.uri;
          // setgetvideo(i?.uri);
          openVideo(d);
          // setVideoUrl(i?.uri);
        });
        if (response.didCancel) {
          setloading(false);
          console.log('User cancelled video picker');
        } else if (response.error) {
          setloading(false);
          console.log('Video picker error:', response.error);
        } else {
          setloading(false);
          console.log('Selected video:', response);
        }
        setloading(false);
      },
    );
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <KeyboardAvoidingScrollView>
          <PopupModal
            visible={modalVisble}
            onPress={() => {
              setmodalVisble(false);
            }}
            onPress2={() => {
              setmodalVisble(false);
            }}
          />
          <View style={styles.mainContainer}>
            {/* header */}
            <View style={styles.Header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.LeftContainer}>
                {/* <Icon name="arrow-back-outline" size={30} color="#ffff" /> */}
              </TouchableOpacity>
              <View style={styles.MiddleContainer}>
                <Text style={styles.FontWork}>Post Ads</Text>
              </View>
            </View>
            {/* header */}
            <Text style={styles.Mainheading}>
              Sell or Trade Faster Promoting!
            </Text>
            {/* button Containers */}
            <View style={styles.BtnContainer}>
              {activeField === 'Personal' ? (
                <TouchableOpacity
                  onPress={() => {
                    setActiveField('Personal');
                  }}
                  style={styles.Btn}>
                  <Text style={styles.Txt1}>Personal</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setActiveField('Personal');
                  }}
                  style={styles.Btn2}>
                  <Text style={styles.Txt2}>Personal</Text>
                </TouchableOpacity>
              )}
              {activeField === 'Business' ? (
                <TouchableOpacity
                  onPress={() => {
                    setActiveField('Business');
                  }}
                  style={styles.Btn}>
                  <Text style={styles.Txt1}>Business</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setActiveField('Business');
                  }}
                  style={styles.Btn2}>
                  <Text style={styles.Txt2}>Business</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* button Containers */}
            <TextInput
              style={styles.inputTxtC}
              value={Title}
              placeholder={
                activeField === 'Personal'
                  ? 'Enter Title'
                  : 'Write Business Name'
              }
              placeholderTextColor={Colors.Primary}
              onChangeText={e => setTitle(e)}
            />

            <View style={styles.mainItemContainer}>
              <Text style={styles.mainHText}>Add image or video</Text>
              <View style={styles.CheckboxContainer}>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(false);
                      setToggleCheckBox(newValue);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0003'}
                  />
                  <Text style={styles.RemebermeText}>Image</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox2}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(newValue);
                      setToggleCheckBox(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0003'}
                  />
                  <Text style={styles.RemebermeText}>Video</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  toggleCheckBox ? setShowUploadBox(true) : getvideo();
                }}
                style={styles.MegaboxCC}>
                {toggleCheckBox && (
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                    source={
                      ImageUrl
                        ? {uri: ImageUrl}
                        : require('../../../assets/imgg.png')
                    }
                  />
                )}
                {toggleCheckBox2 && VideoUrl === '' ? (
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/imgg.png')}
                  />
                ) : (
                  <>
                    {VideoUrl !== '' && toggleCheckBox2 && (
                      <VideoPlayer
                        video={{
                          uri: VideoUrl,
                        }}
                        autoplay
                        paused={false}
                        controls={true}
                        resizeMode={'cover'}
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>

              {subdata.length > 0 ? (
                <>
                  {subdata[0].plan === 'Business' ? (
                    <TextInput
                      style={styles.inputText}
                      placeholder={'Tag line: 12 characters'}
                      placeholderTextColor={Colors.Primary}
                      onChangeText={e => setTagLine(e)}
                    />
                  ) : null}
                </>
              ) : null}

              <View style={styles.space} />
              
              <View style={{zIndex: 2000}}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  zIndex={3000}
                  setValue={setValue}
                  setItems={setItems}
                  itemKey={(item) => item}
                  style={{
                    borderWidth: h('0.3%'),
                    borderColor: Colors.Primary,
                    zIndex: 100000,
                    backgroundColor: 'white',
                  }}
                />
              </View>
              <View style={styles.RemeberMebOx2}>
                <CheckBox
                  style={{width: 20, height: 20}}
                  value={toggleCheckBox3}
                  onValueChange={newValue => setToggleCheckBox3(newValue)}
                  boxType={'circle'}
                  tintColors={{true: Colors.Primary}}
                  onTintColor={'#0003'}
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

              <View style={styles.Btncc}>
                <Appbutton
                  onPress={() => {
                    console.warn(value);
                    if (Title === '' || value === '') {
                      alert('Please Fill all fields');
                    } else {
                      if (ImageUrl !== '' || VideoUrl !== '') {
                        if (toggleCheckBox3) {
                          setModalVisible(!modalVisible);
                        } else {
                          alert('Please Check the Terms & Conditions');
                        }
                      } else {
                        alert('Please Add an Image or Video to Promote');
                      }
                    }
                  }}
                  text={'Submit'}
                />
              </View>
            </View>
          </View>
          {showUploadBox && (
            <View style={styles.uploadOptionsContainer}>
              <TouchableOpacity
                style={styles.captureOptionItem}
                activeOpacity={0.9}
                onPress={openCamera}>
                <Text>From Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureOptionItem}
                activeOpacity={0.9}
                onPress={openPhoto}>
                <Text>From Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

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
        </KeyboardAvoidingScrollView>
      )}
    </>
  );
};

function PaymentScreen({navigation, amount, onDone, onLoading}) {
  const {confirmPayment} = useStripe();

  return (
    <>
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
          onLoading();
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

export default Postad;

export { getAdsPrices }

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: h('100%'),
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
  inputTxtC: {
    width: w('90%'),
    height: h('7%'),
    // backgroundColor: 'red',
    marginTop: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    color: '#000',
    fontSize: h('2%'),
    paddingLeft: h('1%'),
    alignSelf: 'center',
  },
  Mainheading: {
    color: Colors.Primary,
    fontSize: h('2.8%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: h('2%'),
  },
  BtnContainer: {
    // backgroundColor: 'red',
    height: h('7%'),
    width: '60%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Btn: {
    width: '40%',
    height: '75%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn2: {
    width: '40%',
    height: '75%',
    // backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  Txt1: {
    color: '#fff',
    fontSize: h('2%'),
  },
  Txt2: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  mainItemContainer: {
    width: '90%',
    height: '72%',
    // backgroundColor: 'red',
    alignSelf: 'center',
    paddingTop: h('1%'),
  },
  mainHText: {
    color: '#0007',
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  RemeberMebOx: {
    width: '50%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RemeberMebOx2: {
    width: '100%',
    height: '10%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  CheckboxContainer: {
    width: '60%',
    height: h('5%'),
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  MegaboxCC: {
    width: '100%',
    height: '35%',
    backgroundColor: '#D9D9D9',
    borderRadius: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h('2%'),
  },
  imgCcC: {
    width: '30%',
    height: '50%',
    // backgroundColor: 'red',
  },
  Txt123: {
    color: '#0008',
    fontSize: h('2.4%'),
    marginTop: h('1%'),
  },
  inputText: {
    width: '90%',
    height: h('7%'),
    // backgroundColor: '#0009',
    marginTop: h('1%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    paddingLeft: h('1%'),
    marginLeft: h('0.5%'),
    fontSize: h('2%'),
  },
  space: {
    width: '100%',
    height: '5%',
  },
  RemebermeText: {
    color: '#0008',
    fontSize: h('2.2%'),
    marginLeft: h('1%'),
  },
  RemebermeText2: {
    color: '#0009',
    fontSize: h('2.2%'),
    marginLeft: h('1%'),
  },
  Btncc: {
    width: '100%',
    height: '14%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOptionsContainer: {
    position: 'absolute',
    backgroundColor: '#0009',
    width: w('100%'),

    // alignSelf: 'center',
    // top: '35%',
    borderWidth: 2,
    borderColor: '#0003',
    // bottom: '15%',
    height: '85%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  captureOptionItem: {
    height: h('15%'),
    textAlign: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // bottom: 50,
    backgroundColor: '#fff',
    width: '100%',

    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#0003',
    borderWidth: h('0.1%'),
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
