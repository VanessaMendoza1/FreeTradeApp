import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import CheckBox from '@react-native-community/checkbox';
import Appbutton from '../../Components/Appbutton';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import LoadingScreen from '../../Components/LoadingScreen';
import firestore from '@react-native-firebase/firestore';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import VideoPlayer from 'react-native-video-player';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import * as ImagePickers from 'react-native-image-picker';

import {useSelector, useDispatch} from 'react-redux';
import {SubDataAdd} from '../../redux/subSlicer';

const MakePost = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(true);
  const [toggleCheckBox2, setToggleCheckBox2] = React.useState(false);
  const [toggleCheckBox3, setToggleCheckBox3] = React.useState(true);
  const [toggleCheckBox4, setToggleCheckBox4] = React.useState(false);
  const [modalVisble, setmodalVisble] = React.useState(false);
  const [showUploadBox, setShowUploadBox] = React.useState(false);
  const [ImageBoxNumber, setImageBoxNumber] = React.useState(0);
  const [Title, setTitle] = React.useState('');
  const [Price, setPrice] = React.useState(0);
  const [loading, setloading] = React.useState(false);
  const [VideoUrl, setVideoUrl] = React.useState('');
  const MyData = useSelector(state => state?.counter?.data);
  const subdata = useSelector(state => state?.sub?.subdata);
  const [isSubscribed, setIsSubscribed] = useState(false);
  // images

  const [ImageOne, setImageOne] = React.useState('');
  const [ImageTwo, setImageTwo] = React.useState('');
  const [ImageThree, setImageThree] = React.useState('');
  const [ImageFour, setImageFour] = React.useState('');
  const [ImageFive, setImageFive] = React.useState('');
  const [ImageSix, setImageSix] = React.useState('');

  const OpenImageSelector = number => {
    if (number === 1) {
      setImageBoxNumber(1);
      setShowUploadBox(true);
    }
    if (number === 2) {
      setImageBoxNumber(2);
      setShowUploadBox(true);
    }
    if (number === 3) {
      setImageBoxNumber(3);
      setShowUploadBox(true);
    }
    if (number === 4) {
      setImageBoxNumber(4);
      setShowUploadBox(true);
    }
    if (number === 5) {
      setImageBoxNumber(5);
      setShowUploadBox(true);
    }
    if (number === 6) {
      setImageBoxNumber(6);
      setShowUploadBox(true);
    }
  };
  useEffect(() => {
    MySubscriptionPackage();
  }, []);
  const openCamera = () => {
    setloading(true);
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

              if (ImageBoxNumber === 1) {
                setImageOne(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 2) {
                setImageTwo(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 3) {
                setImageThree(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 4) {
                setImageFour(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 5) {
                setImageFive(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 6) {
                setImageSix(downloadURL);
                setShowUploadBox(false);
              }
            });
          },
        );

        // end
      })
      .catch(err => {
        setShowUploadBox(false);
        setloading(false);
        alert('Something went wrong');
      });
  };

  const OpenGallery = () => {
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

              if (ImageBoxNumber === 1) {
                setImageOne(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 2) {
                setImageTwo(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 3) {
                setImageThree(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 4) {
                setImageFour(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 5) {
                setImageFive(downloadURL);
                setShowUploadBox(false);
              }
              if (ImageBoxNumber === 6) {
                setImageSix(downloadURL);
                setShowUploadBox(false);
              }
            });
          },
        );

        // end
      })
      .catch(err => {
        setShowUploadBox(false);
        setloading(false);
        alert('Something went wrong');
      });
  };

  const getvideo = () => {
    setloading(true);
    ImagePickers.launchImageLibrary(
      {
        mediaType: 'video',
      },
      response => {
        response.assets?.map(i => {
          console.log('response', i.uri);
          let d = i?.uri;

          let currentDate = new Date().toString();

          const uploadTask = storage().ref(currentDate).putFile(d);
          uploadTask.on(
            'state_changed',
            snapshot => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Progress', progress);
              if (progress == 100) {
              }
            },
            error => {
              console.log(error);
              // setloading(false);
              alert('Something went wrong');
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                // setloading(false);
                setVideoUrl(downloadURL);
                setloading(false);
              });
            },
          );

          // openVideo(d);
        });
        if (response.didCancel) {
          setloading(false);
          console.log('User cancelled video picker');
        } else if (response.error) {
          setloading(false);
          console.log('Video picker error:', response.error);
        } else {
          console.log('Selected video:', response);
        }
      },
    );
  };
  const MySubscriptionPackage = async () => {
    const currentUserId = auth().currentUser.uid;
    let data = [];
    await firestore()
      .collection('sub')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().userid === currentUserId) {
            const now = moment.utc();
            var end = JSON.parse(documentSnapshot.data().endDate);
            var days = now.diff(end, 'days');

            if (days >= 1) {
              setloading(false);
              setIsSubscribed(true);
            } else {
              setIsSubscribed(false);
              setloading(false);
              // data.push(documentSnapshot.data());
            }
          }
        });
      });
    setloading(false);
  };
  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <KeyboardAvoidingScrollView>
          <View style={styles.mainContainer}>
            {/* header */}
            <View style={styles.Header}>
              <View style={styles.LeftContainer}>
                {/* <Icon name="arrow-back-outline" size={30} color="#ffff" /> */}
              </View>
              <View style={styles.MiddleContainer}>
                <Text style={styles.FontWork}>Post</Text>
              </View>
            </View>
            {/* header */}
            <View style={styles.Container}>
              {/* btn */}
              <View style={styles.CheckboxContainer}>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(false);
                      setToggleCheckBox4(false);
                      setToggleCheckBox(newValue);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Service</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox2}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(newValue);
                      setToggleCheckBox(false);
                      setToggleCheckBox4(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Selling</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox4}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox4(newValue);
                      setToggleCheckBox(false);
                      setToggleCheckBox2(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Trading</Text>
                </View>
              </View>
              {/* btn */}
              <Text style={styles.ImgVides}>Add Images</Text>
              {/* btn */}
              {/* <View style={styles.CheckboxContainer2}>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox3}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox4(false);
                      setToggleCheckBox3(newValue);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Images</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox4}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox4(newValue);
                      setToggleCheckBox3(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Video</Text>
                </View>
              </View> */}
              {/* btn */}

              <>
                <View style={styles.ImgVid}>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(1);
                    }}
                    style={styles.imgContainers}>
                    {ImageOne ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageOne
                              ? {uri: ImageOne}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageOne
                              ? {uri: ImageOne}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(2);
                    }}
                    style={styles.imgContainers}>
                    {ImageTwo ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageTwo
                              ? {uri: ImageTwo}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageTwo !== ''
                              ? {uri: ImageTwo}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(3);
                    }}
                    style={styles.imgContainers}>
                    {ImageThree ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageThree
                              ? {uri: ImageThree}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageThree !== ''
                              ? {uri: ImageThree}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.ImgVid}>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(4);
                    }}
                    style={styles.imgContainers}>
                    {ImageFour ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageFour
                              ? {uri: ImageFour}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageFour !== ''
                              ? {uri: ImageFour}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(5);
                    }}
                    style={styles.imgContainers}>
                    {ImageFive ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageFive
                              ? {uri: ImageFive}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageFive !== ''
                              ? {uri: ImageFive}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      OpenImageSelector(6);
                    }}
                    style={styles.imgContainers}>
                    {ImageSix ? (
                      <>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                          }}
                          source={
                            ImageSix
                              ? {uri: ImageSix}
                              : require('../../../assets/imgg.png')
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: 'contain',
                          }}
                          source={
                            ImageSix !== ''
                              ? {uri: ImageSix}
                              : require('../../../assets/imgg.png')
                          }
                        />
                        <Text style={{color: '#0008', fontSize: h('2%')}}>
                          Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>

              <TextInput
                style={styles.inputTxtC}
                placeholder={'Title'}
                placeholderTextColor={Colors.Primary}
                onChangeText={e => setTitle(e)}
                value={Title}
              />

              {(toggleCheckBox2 || toggleCheckBox) && (
                <TextInput
                  style={styles.inputTxtC}
                  placeholder={'Price (Optional)'}
                  onChangeText={e => setPrice(e)}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.Primary}
                  value={Price}
                />
              )}

              <Text style={styles.ImgVides}>Add Video (optional)</Text>

              <TouchableOpacity
                onPress={() => {
                  getvideo();
                }}
                style={styles.MegaboxCC}>
                {VideoUrl === '' ? (
                  <Image
                    style={{
                      width: '60%',
                      height: '60%',
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/imgg.png')}
                  />
                ) : (
                  <>
                    {VideoUrl !== '' && (
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

              <View style={styles.Btncc}>
                {MyData?.Post < 3 || subdata?.length > 0 ? (
                  <Appbutton
                    onPress={() => {
                      if (Title === '') {
                        alert('Title is required');
                      } else {
                        const images = [
                          ImageOne,
                          ImageTwo,
                          ImageThree,
                          ImageFour,
                          ImageFive,
                          ImageSix,
                        ];
                        navigation.navigate('PostSubmitDetails', {
                          Title: Title,
                          Type: toggleCheckBox
                            ? 'Service'
                            : toggleCheckBox4
                            ? 'Trading'
                            : 'Selling',
                          Price: Price === 0 ? '' : Price,
                          images: images,
                          VideoUrl: VideoUrl ? VideoUrl : '',
                        });
                        setPrice(0);
                        setTitle('');
                        setImageOne('');
                        setImageTwo('');
                        setImageThree('');
                        setImageFour('');
                        setImageFive('');
                        setImageSix('');
                        setVideoUrl('');
                      }
                      setPrice(0);
                      setTitle('');
                      setImageOne('');
                      setImageTwo('');
                      setImageThree('');
                      setImageFour('');
                      setImageFive('');
                      setImageSix('');
                      setVideoUrl('');
                    }}
                    text={'Next'}
                  />
                ) : (
                  <Appbutton
                    onPress={() => {
                      // return console.log(MyData);
                      alert('Please Subscribe to Make more Post');
                      navigation.navigate('SubscriptionPage');
                    }}
                    text={'Next'}
                  />
                )}
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
                onPress={OpenGallery}>
                <Text>From Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingScrollView>
      )}
    </>
  );
};

export default MakePost;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: h('120%'),
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
    fontSize: h('2.7%'),
    fontWeight: 'bold',
  },
  RemeberMebOx: {
    width: '35%',
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
    width: '85%',
    height: h('4%'),
    flexDirection: 'row',
    marginTop: h('3%'),
    // backgroundColor: 'red',
  },
  CheckboxContainer2: {
    width: '80%',
    height: h('5%'),
    flexDirection: 'row',

    // backgroundColor: 'red',
  },
  Container: {
    width: '90%',
    height: '100%',
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  RemebermeText: {
    color: '#0008',
    fontSize: h('2.1%'),
    marginLeft: h('1%'),
  },
  ImgVid: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('15%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h('1%'),
  },
  VideCC: {
    backgroundColor: '#0003',
    width: '100%',
    height: '30%',

    marginTop: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
  },
  ImgVides: {
    fontSize: h('2%'),
    fontWeight: 'bold',
    color: '#0008',
    marginTop: h('2%'),
    marginBottom: h('1%'),
  },
  imgContainers: {
    width: '30%',
    height: h('14%'),
    backgroundColor: '#0003',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
    overflow: 'hidden',
  },
  inputTxtC: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'red',
    marginTop: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    color: '#000',
    fontSize: h('2%'),
    paddingLeft: h('1%'),
  },
  Btncc: {
    width: '100%',
    height: h('14%'),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOptionsContainer: {
    position: 'absolute',
    backgroundColor: '#0008',
    width: w('100%'),

    alignSelf: 'center',
    // top: '35%',
    borderWidth: 2,
    borderColor: '#0003',
    bottom: 0,
    height: '100%',
    // alignItems: 'flex-end',
    justifyContent: 'center',
  },
  captureOptionItem: {
    textAlign: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: '#fff',
    width: '90%',
    height: h('10%'),

    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#0003',
    borderWidth: h('0.1%'),
  },
  MegaboxCC: {
    width: '100%',
    height: '20%',
    backgroundColor: '#D9D9D9',
    borderRadius: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h('2%'),
  },
});
