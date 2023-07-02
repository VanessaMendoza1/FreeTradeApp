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
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import Colors from '../../utils/Colors';
import VideoPlayer from 'react-native-video-player';
import ReportPopup from '../../Components/ReportPopup';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {SliderBox} from 'react-native-image-slider-box';
import LoadingScreen from '../../Components/LoadingScreen';

import axios from 'axios';
import {areNotificationsHidden} from '../../utils/appConfigurations';
import {priceFormatter} from '../../utils/helpers/helperFunctions';
import Reactotron from 'reactotron-react-native';

const isItemLiked = (itemId, setLikedCallback) => {
  let currentUserId = auth().currentUser.uid;
  firestore()
    .collection('Favourite')
    // .where('productId', '==', itemId)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(documentSnapshot => {
          let favouriteItem = documentSnapshot.data();
          let usersWhoMadeItemFavourite = favouriteItem?.users;
          if (usersWhoMadeItemFavourite?.includes(currentUserId)) {
            setLikedCallback();
          }
        });
      }
    });
};

const toggleMarkFavourite = async (
  itemId,
  itemCategory,
  itemSubCategory,
  isForRemovingFromFavourites = false,
) => {
  let currentUserId = auth().currentUser.uid;

  firestore()
    .collection('Favourite')
    .where('productId', '==', itemId)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(documentSnapshot => {
          let favouriteItem = documentSnapshot.data();
          let usersWhoMadeItemFavourite = [...favouriteItem.users];

          if (
            !isForRemovingFromFavourites &&
            !usersWhoMadeItemFavourite.includes(currentUserId)
          ) {
            usersWhoMadeItemFavourite.push(currentUserId);
          } else if (
            isForRemovingFromFavourites &&
            usersWhoMadeItemFavourite.includes(currentUserId)
          ) {
            const userIndexFound =
              usersWhoMadeItemFavourite.indexOf(currentUserId);
            usersWhoMadeItemFavourite.splice(userIndexFound, 1);
          }

          if (usersWhoMadeItemFavourite.length > 0) {
            firestore()
              .collection('Favourite')
              .doc(documentSnapshot.id)
              .update('users', usersWhoMadeItemFavourite)
              .catch(updateErr => {
                console.log({updateErr});
              });
          } else {
            firestore()
              .collection('Favourite')
              .doc(documentSnapshot.id)
              .delete()
              .catch(deleteErr => {
                console.log({deleteErr});
              });
          }
        });
      } else {
        if (isForRemovingFromFavourites) {
          return;
        }
        firestore()
          .collection('Favourite')
          .add({
            productId: itemId,
            category: itemCategory,
            subCategory: itemSubCategory,
            users: [currentUserId],
          })
          .catch(setErr => {
            console.log({setErr});
          });
      }
    })
    .catch(overAllError => {
      console.log({overAllError});
    });
};

const OtherUserPostDetails = ({navigation, route}) => {
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
    route.params.data.images[0]
      ? route.params.data.images[0]
      : 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=879&q=80',
  );
  const [imgeUrl2, setimgeUrl2] = React.useState([]);
  const [Notii, setNotii] = React.useState(
    route.params.data.Notification !== ''
      ? route.params.data.Notification
      : 123123123,
  );

  React.useEffect(() => {
    Reactotron.log(route?.params?.data);
    // isItemLiked(route?.params?.data?.id, () => setheart(true));
  }, []);

  const allImage = () => {
    let data = [];
    route.params.data.images.map(item => {
      if (item !== '') {
        data.push(item);
      }
    });
    setimgeUrl2(data);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'You can now Buy This at FreeTrade on Google & Apple Store',
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
          let roomId = uuid.v4();
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

  const randomItem = () => {
    const arr = AllPostData.map(a => ({sort: 3, value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);
    setSitem(arr.slice(0, 3));
  };

  const randomItem2 = () => {
    const arr = VideoData.map(a => ({sort: 3, value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map(a => a.value);
    setVideoAd(arr.slice(0, 1));
  };

  const sendreport = () => {
    setloading(true);
    firestore()
      .collection('Reports')
      .doc()
      .set({
        UserName: userData.name,
        UserID: userData.UserID,
        ReportText: RText !== '' ? RText : 'No Text added',
        Date: new Date().toLocaleDateString(),
        PostName: route.params.data.Title,
        PostId: route.params.data.DocId,
        PostImage: route.params.data.images,
        PostOwner: route.params.data.user.name,
        PostOwnerEmail: route.params.data.user.email,
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
        userID: route.params.data.user.UserID,
        text: userData.name + '  would like to trade!',
      })
      .then(async () => {
        var data = JSON.stringify({
          data: {},
          notification: {
            body: 'Someone sent you a Request',
            title: userData.name + '  would like to trade!',
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
            navigation.goBack();
            alert('Offer Sent');
          })
          .catch(function (error) {
            alert('Offer Sent');
          });

        areNotificationsHidden(
          callBackIfNotificationsNotHidden,
          route.params.data.user.UserID,
        );
      })
      .catch(err => {});
  };

  React.useEffect(() => {
    randomItem();
    randomItem2();
    allImage();
  }, []);

  const scrollViewRef = React.useRef(null);

  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true});
    }
  };

  return (
    <>
      {loading ? <LoadingScreen /> : null}

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
      />
      <ScrollView ref={scrollViewRef}>
        <View style={styles.MainContainer}>
          {/* img */}
          {/* <ImageBackground
              style={styles.ImgContainer}
              source={{
                uri: imgeUrl,
              }}>
  
            </ImageBackground> */}
          {/* img */}

          <View style={styles.Topheader}>
            <View style={styles.headerBox}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.leftContainer}>
                <Icon name="arrow-back-outline" size={30} color="#ffff" />
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
                <Icon name="arrow-redo" size={30} color="#ffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!heart) {
                    await toggleMarkFavourite(
                      route?.params?.data?.id,
                      route?.params?.data?.Category,
                      route?.params?.data?.SubCategory,
                    );
                    setheart(true);
                  } else {
                    let isForRemovingFromFavourites = true;
                    await toggleMarkFavourite(
                      route.params.data.id,
                      route.params.data.Category,
                      route.params.data.SubCategory,
                      isForRemovingFromFavourites,
                    );
                    setheart(false);
                  }
                  setheart(!heart);
                }}
                style={styles.leftContainer}>
                {heart ? (
                  <Icon name="heart" size={30} color="red" />
                ) : (
                  <Icon name="heart" size={30} color="#ffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <SliderBox images={imgeUrl2} />

          <View style={styles.HeadingTextContainer}>
            <Text style={styles.HeadingText}>{route.params.data.Title}</Text>
            {route.params.data.Discount !== 0 ? (
              <View style={styles.Discountbox}>
                <Text style={styles.HeadingText33}>
                  {priceFormatter(route.params.data.Discount)}
                </Text>
                <Text style={styles.HeadingText22}>
                  {route.params.data.Price !== '' &&
                    priceFormatter(route.params.data.Price)}
                </Text>
              </View>
            ) : (
              <Text style={styles.HeadingText}>
                {route.params.data.Price !== '' &&
                  priceFormatter(route.params.data.Price)}
              </Text>
            )}
          </View>
          <View style={styles.HeadingTextContainer2}>
            <Text style={styles.HeadingText2}>
              {route.params.data.user.location}
            </Text>
          </View>
          <View style={styles.HeadingTextContainer2}>
            {/* <Text style={styles.HeadingText3}>Posted : 3 Months ago</Text> */}
          </View>

          {/* imges */}
          <View style={styles.ImgesContainer}>
            {route.params.data.images.map((item, index) => (
              <>
                {item !== '' ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ImageScreen', {data: item});
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
          </View>
          {/* imges */}

          <View style={styles.HeadingTextContainer3}>
            <Text style={styles.HeadingText4}>
              {route.params.data.Description}
            </Text>
          </View>

          {/* Profile */}
        </View>
      </ScrollView>
    </>
  );
};

export {toggleMarkFavourite, isItemLiked};
export default OtherUserPostDetails;

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
  },
  HeadingTextContainer2: {
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
  miniImg: {
    width: '25%',
    height: '100%',
    backgroundColor: '#0003',
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
    width: '22%',
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
    width: 80,
    height: 80,
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
    height: h('10%'),

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
});
