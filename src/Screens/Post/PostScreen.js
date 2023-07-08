import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import Colors from '../../utils/Colors';
import VideoPlayer from 'react-native-video-player';
import ReportPopup from '../../Components/ReportPopup';

import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {SliderBox} from 'react-native-image-slider-box';
import LoadingScreen from '../../Components/LoadingScreen';
import {ImageSlider} from 'react-native-image-slider-banner';
import {
  toggleMarkFavourite,
  isItemLiked,
} from '../Profile/OtherUserPostDetails';
import {areNotificationsHidden} from '../../utils/appConfigurations';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {priceFormatter} from '../../utils/helpers/helperFunctions';
import Reactotron from 'reactotron-react-native';
import reactotron from 'reactotron-react-native';

const PostScreen = ({navigation, route}) => {
  const [loading, setloading] = React.useState(false);
  const [Sitem, setSitem] = React.useState([]);
  const [VideoAd, setVideoAd] = React.useState([]);
  const [RText, setRText] = React.useState('');
  const userData = useSelector(state => state.counter.data);

  const AllPostData = useSelector(state => state.post.PostData);
  const VideoData = useSelector(state => state.ads.VideoData);
  const subdata = useSelector(state => state.sub.subdata);
  const [heart, setheart] = React.useState(false);
  const [mode, setmode] = React.useState(false);
  const [imgeUrl, setimgeUrl] = React.useState(
    route.params?.data?.images?.length > 0 && route.params?.data?.images[0]
      ? route.params?.data?.images[0]
      : 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=879&q=80',
  );
  const [imgeUrl2, setimgeUrl2] = React.useState([]);
  const [Notii, setNotii] = React.useState(
    route.params.data.Notification !== ''
      ? route.params.data.Notification
      : 123123123,
  );
  const data = route.params?.data;

  useFocusEffect(
    React.useCallback(() => {
      allImage();
      isItemLiked(route?.params?.data?.id, () => setheart(true));
      getSimilarItems();
      return () => null;
    }, []),
  );

  const allImage = () => {
    let data = [];
    route?.params?.data?.images?.map(item => {
      if (item !== '') {
        data.push(item);
      }
    });
    console.log({SETTING: data});
    setimgeUrl2(data);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Checkout this item on the FreeTrade App. Download now!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const createChatList = data => {
    setloading(true);
    database()
      .ref('/chatlist/' + userData.UserID + '/' + data.UserID)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() == null) {
          // let roomId = uuid.v4();
          let roomId;
          if (snapshot.val() == null) {
            roomId = uuid.v4();
          } else {
            roomId = snapshot.val().roomId;
          }
          let myData = {
            roomId,
            id: userData.UserID,
            name: userData.name,
            img: userData.image,
            emailId: userData.emails,
            about: userData.Bio,
            lastMsg: '',
            Token: userData.NotificationToken,
          };
          let SendData = {
            roomId,
            id: data.UserID,
            name: data.name,
            img: data.image,
            emailId: data.email,
            about: data.Bio,
            lastMsg: '',
            Token: data.NotificationToken,
          };
          database()
            .ref('/chatlist/' + data.UserID + '/' + userData.UserID)
            .update(myData)
            .then(() => console.log('Data updated.'));

          data.lastMsg = '';
          data.roomId = roomId;

          database()
            .ref('/chatlist/' + userData.UserID + '/' + data.UserID)
            .update(SendData)
            .then(() => console.log('Data updated.'));

          navigation.navigate('Inbox', {receiverData: SendData});
          setloading(false);
        } else {
          navigation.navigate('Inbox', {
            receiverData: snapshot.val(),
          });
          setloading(false);
        }
      });
  };

  const getSimilarItems = async () => {
    let similarItems = [];
    await firestore()
      .collection('Post')
      .where('Category', '==', route?.params?.data?.Category)
      .where('SubCategory', '==', route?.params?.data?.SubCategory)
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          similarItems.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setSitem(similarItems);
      });
  };

  const randomItem = () => {
    const arr = AllPostData?.map(a => ({sort: 3, value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);

    setSitem(arr?.slice(0, 3));
  };

  const randomItem2 = () => {
    const arr = VideoData?.map(a => ({sort: 3, value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);
    setVideoAd(arr?.slice(0, 1));
  };

  const sendreport = () => {
    setloading(true);
    firestore()
      .collection('Reports')
      .doc()
      .set({
        UserName: userData?.name,
        UserID: userData?.UserID,
        ReportText: RText !== '' ? RText : 'No Text added',
        Date: new Date().toLocaleDateString(),
        PostName: route?.params?.data?.Title,
        PostId: route?.params?.data?.DocId,
        PostImage:
          route?.params?.data?.images.length > 0
            ? route?.params?.data?.images
            : [],
        PostOwner: route?.params?.data?.user?.name,
        PostOwnerEmail: route?.params?.data?.user?.email,
      })
      .then(async () => {
        setmode(false);
        setloading(false);
        alert('DONE');
      })
      .catch(err => {
        setloading(false);
      });
  };

  const NotificationSystem = async (id, name, token) => {
    firestore()
      .collection('Notification')
      .doc()
      .set({
        seen: false,
        userID: userData.UserID,
        receiverId: route?.params?.data?.user?.UserID,
        text:
          userData.name +
          '  would like to trade with you, click to see profile!',
        dateTime: new Date().toUTCString(),
        postId: route?.params?.data?.DocId,
        image: route?.params?.data?.images[0],
      })
      .then(async () => {
        var data = JSON.stringify({
          data: {},
          notification: {
            body: 'Someone sent you a Request',
            title:
              userData.name +
              '  would like to trade with you, click to see profile!',
          },
          to: JSON.parse(Notii),
        });
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAwssoW30:APA91bGw2zSndcTuY4Q_o_L9x6up-8tCzIe0QjNLOs-bTtZQQJk--iAVrGU_60Vl1Q41LmUU8MekVjH_bHowDK4RC-mzDaJyjr9ma21gxSqNYrQFNTzG7vfy537eA_ogt1IORC12B5Ls',
            'Content-Type': 'application/json',
          },
          data: data,
        };
        let callBackIfNotificationsNotHidden = axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            areNotificationsHidden(
              callBackIfNotificationsNotHidden,
              route?.params?.data?.user?.UserID,
            );
            navigation.goBack();
            alert('Trade Offer Sent');
          })
          .catch(function (error) {
            alert('Trade Offer Sent');
          });
      })
      .catch(err => {});
  };

  React.useEffect(() => {
    reactotron.log(route?.params?.data.Price);
    randomItem();
    randomItem2();
    allImage();
  }, []);

  // const scrollViewRef = React.useRef(null);

  // const handleScrollToTop = () => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo({y: 0, animated: true});
  //   }
  // };
  return (
    <>
      {loading ? <LoadingScreen /> : null}

      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <ReportPopup
          visible={mode}
          onPress={() => {
            setmode(false);
          }}
          onSend={() => {
            sendreport();
          }}
          onChangeText={e => {
            setRText(e);
          }}
          onEndEditing={() => {
            sendreport();
          }}
          onSubmitEditing={() => {
            sendreport();
          }}
        />

        {/* <ScrollView ref={scrollViewRef}> */}
        <View style={styles.MainContainer}>
          <View style={styles.Topheader}>
            <View style={styles.headerBox}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.leftContainer}>
                <Icon name="arrow-back-outline" size={25} color="#ffff" />
              </TouchableOpacity>
              <View style={styles.leftContainer2}></View>
              <TouchableOpacity
                onPress={() => {
                  setmode(true);
                }}
                style={styles.leftContainer}>
                {Icons.Report({
                  tintColor: '#ffff',
                })}
              </TouchableOpacity>
              <TouchableOpacity onPress={onShare} style={styles.leftContainer}>
                <Icon name="arrow-redo" size={25} color="#ffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!heart) {
                    await toggleMarkFavourite(
                      route.params?.data?.id,
                      route.params?.data?.Category,
                      route.params?.data?.SubCategory,
                    );
                    setheart(true);
                  } else {
                    let isForRemovingFromFavourites = true;
                    await toggleMarkFavourite(
                      route.params?.data?.id,
                      route.params?.data?.Category,
                      route.params?.data?.SubCategory,
                      isForRemovingFromFavourites,
                    );
                    setheart(false);
                  }
                  setheart(!heart);
                }}
                style={styles.leftContainer}>
                {heart ? (
                  <Icon name="heart" size={25} color="red" />
                ) : (
                  <Icon name="heart" size={25} color="#ffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <FlatList
              data={route.params.data.images}
              renderItem={item => {
                if (item.item != '') {
                  return (
                    <TouchableOpacity
                      style={styles.imgCrousal}
                      onPress={() => {
                        navigation.navigate('ImageScreen', {
                          data: item.item,
                          video: false,
                        });
                      }}
                      activeOpacity={1}>
                      <Image source={{uri: item.item}} style={styles.image} />
                    </TouchableOpacity>
                  );
                }
              }}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            />
          </View>

          <View style={styles.HeadingTextContainer}>
            <Text style={styles.HeadingText}>{route.params.data.Title}</Text>
            {route.params.data.Discount !== 0 ? (
              <View style={styles.Discountbox}>
                <Text style={styles.HeadingText33}>
                  {priceFormatter(route?.params?.data?.Discount)}
                </Text>
                <Text style={styles.HeadingText22}>
                  {route.params.data.Price !== '' &&
                    priceFormatter(route.params.data.Price)}
                </Text>
              </View>
            ) : (
              <Text style={styles.HeadingText}>
                {route.params.data.Price !== '' &&
                  priceFormatter(route?.params?.data?.Price)}
              </Text>
            )}
          </View>
          <View style={styles.HeadingTextContainer2}>
            <Text style={styles.HeadingText2}>
              {route?.params?.data?.user?.location}
            </Text>
          </View>
          <View style={styles.HeadingTextContainer2}>
            {/* <Text style={styles.HeadingText3}>Posted : 3 Months ago</Text> */}
          </View>

          <View style={styles.HeadingTextContainer2222}>
            <Text style={styles.HeadingText3}>Condition: </Text>
            <Text style={styles.HeadingText2}>
              {route?.params?.data?.Condition}
            </Text>
          </View>

          {/* imges */}
          <View style={styles.ImgesContainer}>
            {route?.params?.data?.images?.map((item, index) => (
              <>
                {item !== '' ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ImageScreen', {
                        data: item,
                        video: false,
                      });
                      setimgeUrl(item);
                    }}
                    style={styles.miniImg}>
                    <Image
                      style={styles.imgCC}
                      source={{
                        uri:
                          item !== ''
                            ? item
                            : 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </>
            ))}
            {route?.params?.data?.images?.length < 1 && (
              <>
                <Text>No image available</Text>
              </>
            )}
          </View>
          {/* imges */}

          {route?.params?.data?.videUrl && (
            <>
              <View style={styles.HeadingTextContainer22232}>
                <Text>Video</Text>
              </View>
              {/* imges */}
              <View style={styles.ImgesContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ImageScreen', {
                      data: route.params.data.videUrl,
                      video: true,
                    });
                  }}
                  style={styles.miniImg}>
                  <Image
                    style={styles.imgCC}
                    source={{
                      uri: 'https://static.vecteezy.com/system/resources/previews/006/963/478/non_2x/grey-play-icon-flat-design-style-vector.jpg',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* imges */}

          <View style={styles.HeadingTextContainer3}>
            <Text style={styles.HeadingText4}>
              {route?.params?.data?.Description}
            </Text>
          </View>

          {/* Profile */}
          <View style={styles.linebar} />
          <View style={styles.ProfilePadding}>
            {/* img */}
            <View style={styles.ProfileContainer}>
              <View style={styles.ProfileCC}>
                <Image
                  style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                  source={{
                    uri: route?.params?.data?.user?.image
                      ? route?.params?.data?.user?.image
                      : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                  }}
                />
              </View>
            </View>
            {/* img */}
            {/* rating */}
            <View style={styles.RatingContianer}>
              <Text style={styles.NameC}>
                {route?.params?.data?.user?.name}
              </Text>
              <Text style={styles.NameC}>
                {route?.params?.data?.user?.location}
              </Text>

              {route?.params?.data?.user?.reviews?.length > 0 && (
                <View style={styles.HeadingTextContainer45}>
                  <View style={styles.HeartContainer}>
                    <Icon name="star" size={20} color="gold" />
                  </View>
                  <Text style={styles.HeadingText5}>
                    {route.params.data.user.reviews.length}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OtherUserProfile', {
                  data: route?.params?.data?.user,
                });
              }}
              style={styles.RatingContianer2}>
              <View style={styles.BtnChck}>
                <Text style={styles.Textc}>Check</Text>
              </View>
            </TouchableOpacity>
            {/* rating */}
          </View>

          <View style={styles.linebar} />
          {/* Profile */}

          <View style={styles.HeadingTextContainer5}>
            <TouchableOpacity
              onPress={() => {
                const currentUserId = auth()?.currentUser?.uid;
                if (route?.params?.data?.UserID === currentUserId) {
                  alert("You are the owner of this item, can't send message !");
                  return;
                }
                console.log({subdata});
                if (subdata.length > 0) {
                  navigation.navigate('StartConversation', {
                    data: route.params?.data,
                    receiverData: {
                      id: route?.params?.data?.UserID,
                      name: route?.params?.data?.name,
                      img: route?.params?.data?.image,
                      emailId: route?.params?.data?.email,
                      about: route?.params?.data?.Bio,
                      Token: route?.params?.data?.NotificationToken,

                      itemPrice: route?.params?.data?.Price,
                      itemImage:
                        route?.params?.data?.images?.length > 0
                          ? route?.params?.data?.images[0]
                          : '',
                      sellersName: route?.params?.data?.name,
                      sellersImage: route?.params?.data?.image,
                    },
                  });
                } else {
                  // alert('You need to buy Subscription');
                  navigation.navigate('SubscriptionPage');
                }

                // navigation.navigate('CreateMessage');
              }}
              style={styles.AskButton}>
              <Text style={styles.FontCOlor}>Ask</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const currentUserId = auth().currentUser.uid;
                console.log({THIS: route.params.data.UserID, currentUserId});
                if (route?.params?.data?.UserID == currentUserId) {
                  alert("You are the owner of this item, can't send message !");
                  return;
                }
                // TEMPORARILY ADDED
                // NotificationSystem();
                if (subdata.length > 0) {
                  if (route?.params?.data?.PostType === 'Trading') {
                    NotificationSystem();
                  } else {
                    navigation.navigate('SendOffer', {
                      data: route?.params?.data,
                    });
                  }
                } else {
                  // alert('You need to buy Subscription');
                  navigation.navigate('SubscriptionPage');
                }
              }}
              style={styles.AskButton2}>
              <Text style={styles.FontCOlor2}>
                {route?.params?.data?.PostType === 'Trading'
                  ? 'Let’s Trade'
                  : 'Send offer'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.linebar} />
          <View style={styles.space} />

          <View>
            <VideoPlayer
              video={{
                uri:
                  VideoAd.length > 0
                    ? VideoAd[0]?.AdGraphicLink
                    : VideoAd?.length > 0
                    ? VideoAd[0]?.AdGraphicLink
                    : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              }}
              autoplay
              paused={false}
              controls={true}
              resizeMode={'cover'}
              thumbnail={{
                uri: 'https://i.picsum.photos/id/866/1600/900.jpg',
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OtherUserProfile', {
                data: VideoAd[0]?.user,
              });
            }}>
            <View style={styles.overlay}>
              <Text style={styles.videoShoesTag}>
                {VideoAd?.length > 0 ? VideoAd[0]?.title : ''}
              </Text>
              <Text style={styles.videoShoesTag2}>
                {VideoAd?.length > 0 ? VideoAd[0]?.TagLine : ''}
              </Text>

              <Text style={styles.MainText2}>
                {VideoAd?.length > 0 ? VideoAd[0]?.user?.Address : ''}
              </Text>
              {VideoAd?.length > 0 && VideoAd[0]?.user?.Phone !== undefined && (
                <Text style={styles.MainText2}>
                  Call: {VideoAd?.length > 0 ? VideoAd[0]?.user?.Phone : ''}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.HeadingTextContainer7}>
            <Text style={styles.SimiliarText}>Similar Items</Text>
          </View>
          <View style={styles.HeadingTextContainer8}>
            {Sitem.length >= 1 && (
              <FlatList
                data={Sitem}
                horizontal={true}
                renderItem={({item}) => {
                  if (route?.params?.data?.DocId !== item?.DocId) {
                    if (item.images) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.push('PostScreen', {data: item});
                            // handleScrollToTop();
                          }}
                          style={styles.ServiceItemContainer}>
                          <ImageBackground
                            style={styles.img}
                            source={{
                              uri: item?.images[0]
                                ? item?.images[0]
                                : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
                            }}>
                            <View style={styles.imgCC2}>
                              <View style={styles.BottomContainer}>
                                <Text style={styles.BPTag}>{item?.Title}</Text>
                              </View>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    }
                  }
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default PostScreen;

export const Preview = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
}) => {
  return (
    <TouchableOpacity
      style={[styles.videoContainer]}
      onPress={() => onPress(item)}>
      <View style={[styles.imageContainer, styles.shadow]}>
        <Image
          style={[styles.videoPreview, active ? {} : {height: 120}]}
          source={{uri: item}}
        />
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('180%'),
    backgroundColor: 'white',
  },
  ImgContainer: {
    width: '100%',
    height: h('40%'),
    // backgroundColor: 'red',
  },
  Topheader: {
    width: '100%',
    height: h('7%'),
    backgroundColor: Colors.Primary,
    position: 'relative',
    top: 0,
  },
  headerBox: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  leftContainer: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer2: {
    width: '40%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeadingTextContainer: {
    width: '90%',
    // backgroundColor: 'green',
    height: h('4%'),
    alignSelf: 'center',
    marginTop: h('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ImgesContainer: {
    width: '90%',
    // backgroundColor: 'green',
    height: h('10%'),
    alignSelf: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  HeadingTextContainer2: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('2.5%'),
    alignSelf: 'center',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingTextContainer2222: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('2.3%'),
    alignSelf: 'center',

    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingTextContainer22232: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('3%'),
    alignSelf: 'center',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingTextContainer4: {
    width: '90%',
    // backgroundColor: 'orange',
    height: h('3%'),
    alignSelf: 'center',

    flexDirection: 'row',

    alignItems: 'center',
  },
  HeadingTextContainer45: {
    width: '40%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeadingTextContainer3: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('16%'),
    alignSelf: 'center',
    marginTop: h('0.5%'),
  },
  HeadingTextContainer5: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('8%'),
    alignSelf: 'center',
    marginTop: h('0.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingTextContainer7: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('5%'),
    alignSelf: 'center',
    marginTop: h('0.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingTextContainer8: {
    width: w('100%'),
    // backgroundColor: 'red',
    height: h('20%'),
    // alignSelf: 'center',
    // marginTop: h('0.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingText: {
    color: '#000',
    fontSize: h('3%'),
    fontWeight: 'bold',
  },
  SimiliarText: {
    color: '#000',
    fontSize: h('2.6%'),
  },
  HeadingText3: {
    color: '#0007',
    fontSize: h('2%'),
  },
  HeadingText4: {
    color: '#0008',
    fontSize: h('2%'),
  },
  HeadingText2: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  HeadingText3: {
    color: '#000',
    fontSize: h('2%'),
  },
  miniImg: {
    width: '25%',
    height: '100%',
    // backgroundColor: '#0003',
    paddingRight: 5,
  },
  miniImg2: {
    width: '32%',
    height: '90%',
    backgroundColor: '#0003',
  },
  imgCC: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  HeartContainer: {
    width: '40%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linebar: {
    width: '100%',
    borderWidth: h('0.2%'),
    borderColor: '#0003',
  },
  ProfilePadding: {
    width: '100%',
    height: h('14%'),
    backgroundColor: Colors.Primary,
    marginTop: h('1%'),
    marginBottom: h('1%'),
    flexDirection: 'row',
  },
  ProfileContainer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'gold',
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RatingContianer: {
    width: '47%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    paddingLeft: h('1.5%'),
    // alignItems: 'center',
  },
  RatingContianer2: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    // alignItems: 'center',
  },
  ProfileCC: {
    width: 70,
    height: 70,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  NameC: {
    color: '#fff',
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  HeadingText5: {
    color: '#fff',
    fontSize: h('2%'),
  },
  BtnChck: {
    width: '80%',
    height: '40%',
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('0.5%'),
    borderColor: '#fff',
    borderWidth: h('0.2%'),
  },
  Textc: {
    color: '#fff',
    fontSize: h('2%'),
  },
  AskButton: {
    width: '30%',
    height: '80%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AskButton2: {
    width: '65%',
    height: '80%',
    // backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  FontCOlor: {
    color: '#fff',
    fontSize: h('2.2%'),
  },

  FontCOlor2: {
    color: Colors.Primary,
    fontSize: h('2.2%'),
  },
  space: {
    marginTop: h('2.5%'),
  },
  ServiceItemContainer: {
    width: w('32%'),
    height: '100%',
    backgroundColor: '#0003',
    padding: h('0.5%'),
  },
  ImgOverlay: {
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#000',
  },
  imgCC2: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0008',
    justifyContent: 'flex-end',
    paddingBottom: h('2%'),
  },
  OverlayContent: {
    width: '100%',
    height: '20%',
    // backgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: h('1%'),
  },
  Profile: {
    width: 30,
    height: 30,
    // backgroundColor: 'green',
    borderRadius: h('10000%'),
    overflow: 'hidden',
  },
  BottomContainer: {
    width: '100%',
    height: '70%',
    // backgroundColor: 'red',
    paddingLeft: 10,
    justifyContent: 'flex-end',
  },
  BPTag: {
    color: '#fff',
    fontSize: h('1.9%'),
    // fontWeight: 'bold',
  },
  BPTag2: {
    color: '#fff',
    fontSize: h('1.7%'),
  },
  overlay: {
    width: '100%',
    height: h('12.5%'),

    backgroundColor: '#fff',

    paddingTop: h('2%'),
    paddingLeft: h('2%'),
    borderColor: '#0003',
    borderWidth: h('0.2%'),
    marginBottom: h('2%'),
  },
  videoShoesTag: {
    color: '#000',
    fontSize: h('2%'),
  },
  videoShoesTag2: {
    color: '#0007',
    fontSize: h('1.7%'),
  },
  Discountbox: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingText22: {
    color: '#0008',
    fontSize: h('2.2%'),
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  HeadingText33: {
    color: 'red',
    fontSize: h('3%'),
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '100%',

    // paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 20,
  },
  videoPreview: {
    width: '100%',
    height: 150,
    // borderRadius: 8,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  // carousel: {
  //   width: '100%',
  //   height: h('20%'),
  //   backgroundColor: 'red',
  // },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imgCrousal: {
    width: w('100%'),
    height: h('30%'),
    // backgroundColor: 'green',
  },
});
