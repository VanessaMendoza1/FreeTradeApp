import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import Colors from '../../utils/Colors';
import Appbutton from '../../Components/Appbutton';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {SliderBox} from 'react-native-image-slider-box';

import database from '@react-native-firebase/database';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {
  PostAdd,
  TradingAdd,
  SellingAdd,
  ServiceAdd,
} from '../../redux/postSlice';
import LoadingScreen from '../../Components/LoadingScreen';

import axios from 'axios';
import {areNotificationsHidden} from '../../utils/appConfigurations';
import {priceFormatter} from '../../utils/helpers/helperFunctions';

const UserPost = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imgeUrl2, setimgeUrl2] = React.useState([]);
  const [imgeUrl, setimgeUrl] = React.useState(
    route.params.data.images[0]
      ? route.params.data.images[0]
      : 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=879&q=80',
  );

  const [users, setusers] = React.useState([]);
  const [allUserBackup, setallUserBackup] = React.useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setloading] = React.useState(false);

  const Userdata = useSelector(state => state.counter.data);

  const dispatch = useDispatch();

  const getAllUser = () => {
    database()
      .ref('chatlist/' + Userdata.UserID)
      .once('value')
      .then(snapshot => {
        setusers(
          Object.values(snapshot.val()).filter(it => it.id != Userdata.UserID),
        );
        setallUserBackup(
          Object.values(snapshot.val()).filter(it => it.id != Userdata.UserID),
        );
        setallUserBackup(
          Object.values(snapshot.val()).filter(it => it.id != Userdata.UserID),
        );
      });
  };

  const searchFilter = text => {
    const newData = users.filter(item => {
      return item.name.toUpperCase().search(text.toUpperCase()) > -1;
    });
    if (text.trim().length === 0) {
      setallUserBackup(users);
    } else {
      setallUserBackup(newData);
    }
    setSearchValue(text);
  };

  const ItemSold = item => {
    setloading(true);
    firestore()
      .collection('Sold')
      .doc()
      .set({
        ItemImage: route.params.data.images[0],
        ItemName: route.params.data.Title,
        ItemID: route.params.data.DocId,
        ProductType:
          route.params.data.PostType === 'Service'
            ? 'Sold'
            : route.params.data.PostType === 'Trading'
            ? 'Trade'
            : 'Sold',
        SellerID: Userdata.UserID,
      })
      .then(async () => {
        firestore()
          .collection('Bought')
          .doc()
          .set({
            BuyerID: item.id,
            BuyerImage: item.img,
            BuyerName: item.name,
            SellerID: Userdata.UserID,
            SellerName: Userdata.name,
            SellerImage: Userdata.image,
            ItemImage: route.params.data.images[0],
            ItemName: route.params.data.Title,
            ItemID: route.params.data.DocId,
            SoldPersonToken: Userdata.NotificationToken,
            ProductType:
              route.params.data.PostType === 'Service'
                ? 'Sold'
                : route.params.data.PostType === 'Trading'
                ? 'Trade'
                : 'Sold',
          })
          .then(async () => {
            updatePost();
            NotificationSystem(item.Token, item.id);
          })
          .catch(err => {
            setloading(false);
          });
      })
      .catch(err => {
        setloading(false);
      });
  };
  const ItemTraded = item => {
    setloading(true);
    firestore()
      .collection('Trade')
      .doc()
      .set({
        ItemImage: route.params.data.images[0],
        ItemName: route.params.data.Title,
        ItemID: route.params.data.DocId,
        ProductType: 'Trading',
        SellerID: Userdata.UserID,
        BuyerID: item.id,
        BuyerImage: item.img,
        BuyerName: item.name,
        Token: Userdata.NotificationToken,
      })
      .then(async () => {
        firestore()
          .collection('Trade')
          .doc()
          .set({
            ItemImage: route.params.data.images[0],
            ItemName: route.params.data.Title,
            ItemID: route.params.data.DocId,
            ProductType: 'Trading',
            SellerID: item.id,
            BuyerID: Userdata.UserID,
            BuyerImage: Userdata.image,
            BuyerName: Userdata.name,
            Token: Userdata.NotificationToken,
          })
          .then(async () => {
            updatePost();
            let isTrade = true;
            NotificationSystem(item.Token, item.id, isTrade);
          })
          .catch(err => {
            setloading(false);
          });
      })
      .catch(err => {
        setloading(false);
      });
  };

  const updatePost = () => {
    setloading(true);
    firestore()
      .collection('Post')
      .where('DocId', '==', route.params.data.DocId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({status: true});
        });
      });
  };

  // const allmypost = async () => {
  //   let SellingData = [];
  //   let TradingData = [];
  //   let ServiceData = [];
  //   await firestore()
  //     .collection('Post')
  //     .get()
  //     .then(async querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         if (documentSnapshot.data().status === false) {
  //           if (documentSnapshot.data().PostType === 'Trading') {
  //             TradingData.push(documentSnapshot.data());
  //           }
  //           if (documentSnapshot.data().PostType === 'Selling') {
  //             SellingData.push(documentSnapshot.data());
  //           }
  //           if (documentSnapshot.data().PostType === 'Service') {
  //             ServiceData.push(documentSnapshot.data());
  //           }
  //         }
  //       });
  //     });

  //   await dispatch(SellingAdd(SellingData));
  //   await dispatch(TradingAdd(TradingData));
  //   await dispatch(ServiceAdd(ServiceData));
  //   alert('Done');
  //   navigation.navigate('Review');
  //   setloading(false);
  // };

  const NotificationSystem = async (token, id, isTrade = null) => {
    let dealType = isTrade ? 'item Traded with' : 'item Sold to';
    firestore()
      .collection('Notification')
      .doc()
      .set({
        userID: id,
        text:
          'Hi ' +
          Userdata.name +
          ' just rated her experience, click to rate yours.',
        // text: Userdata.name + ' has marked an ' + {dealType} + ' you ! Review it now ',
        sellerData: Userdata,
        seen: false,
      })
      .then(async () => {
        var data = JSON.stringify({
          data: {},
          notification: {
            body: 'Someone sent you a Request',
            title:
              'Hi ' +
              Userdata.name +
              ' just rated her experience, click to rate yours.',
            // title: Userdata.name + 'has marked an ' + {dealType} + ' you ! Review it now ',
          },
          to: token,
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
            areNotificationsHidden(callBackIfNotificationsNotHidden, id);
            navigation.navigate('Review');
          })
          .catch(function (error) {});
      })
      .catch(err => {});
  };

  const allImage = () => {
    let data = [];
    route.params.data.images.map(item => {
      if (item !== '') {
        data.push(item);
      }
    });
    setimgeUrl2(data);
  };

  React.useEffect(() => {
    getAllUser();
    allImage();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <KeyboardAvoidingScrollView>
          <ScrollView>
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
                  <View style={styles.leftContainer}></View>
                  <View style={styles.leftContainer}>
                    {/* <Icon name="arrow-redo" size={30} color="#ffff" /> */}
                  </View>
                  <View style={styles.leftContainer}>
                    {/* <Icon name="heart" size={30} color="#ffff" /> */}
                  </View>
                </View>
              </View>

              <SliderBox
                images={imgeUrl2}
                onCurrentImagePressed={index => {
                  let imageData = imgeUrl2[index];
                  navigation.navigate('ImageScreen', {data: imageData});
                }}
              />

              <View style={styles.HeadingTextContainer}>
                <Text style={styles.HeadingText}>
                  {route.params.data.Title}
                </Text>
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

              <View style={styles.linebar} />
              {/* Profile */}

              <View style={styles.HeadingTextContainer5}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('PostEdit', {data: route.params.data});
                  }}
                  style={styles.AskButton}>
                  <Text style={styles.FontCOlor}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    // navigation.navigate('SendOffer');
                  }}
                  style={styles.AskButton2}>
                  <Text style={styles.FontCOlor2}> Mark as Sold / Traded</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.space} />
              <View style={styles.Btncc}>
                <Appbutton
                  onPress={() => {
                    navigation.navigate('PostPromotion', {
                      data: route?.params?.data,
                    });
                  }}
                  text={'Promote'}
                />
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    style={styles.inputtextcc}
                    placeholder={'Search'}
                    placeholderTextColor={Colors.Primary}
                    onChangeText={e => {
                      searchFilter(e);
                    }}
                  />
                  {allUserBackup &&
                    allUserBackup?.map((item, idx) => {
                      return (
                        <View style={styles.MessageContainer23}>
                          <View style={styles.leftContainer23}>
                            <View style={styles.ProfileContainer23}>
                              <View style={styles.ProfileCC23}>
                                <Image
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'cover',
                                  }}
                                  source={{
                                    uri: item.img
                                      ? item.img
                                      : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                          <View style={styles.RightContainer23}>
                            <Text style={styles.nameText23}>{item.name}</Text>
                            {/* <Text style={styles.nameText33}>London,Uk</Text> */}
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setModalVisible(false);
                              if (route.params.data.PostType === 'Trading') {
                                ItemTraded(item);
                              } else {
                                ItemSold(item);
                              }
                            }}
                            style={styles.LeftContainer233}>
                            <Text style={styles.nameText2343}>
                              Mark as Sold or Traded
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                  <View style={styles.Btncc223}>
                    <Appbutton
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                      text={'Cancel'}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingScrollView>
      )}
    </>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('100%'),
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
    width: '90%',
    // backgroundColor: 'red',
    height: h('20%'),
    alignSelf: 'center',
    marginTop: h('0.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadingText: {
    color: '#000',
    fontSize: h('3%'),
    fontWeight: 'bold',
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
    borderColor: '#fff',
    borderWidth: h('0.2%'),
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
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RatingContianer: {
    width: '42%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  RatingContianer2: {
    width: '33%',
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
    fontSize: h('2.5%'),
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
    marginTop: h('1%'),
  },
  ServiceItemContainer: {
    width: '33%',
    height: '100%',
    backgroundColor: '#0003',
    alignSelf: 'center',
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
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  BPTag2: {
    color: '#fff',
    fontSize: h('1.7%'),
  },
  Btncc: {
    width: '100%',
    height: '7%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btncc223: {
    width: '100%',
    height: '13%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: h('80%'),
    backgroundColor: 'white',
    borderRadius: h('1%'),
    alignItems: 'center',
  },
  inputtextcc: {
    width: '90%',
    height: h('7%'),
    // backgroundColor: '#0003',
    paddingLeft: h('1%'),
    marginTop: h('1%'),
    borderRadius: h('0.5%'),
    color: Colors.Primary,
    fontSize: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    marginBottom: h('1%'),
  },
  MessageContainer23: {
    width: '100%',
    height: h('10%'),
    borderBottomWidth: h('0.2%'),
    borderBottomColor: '#0002',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  leftContainer23: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'gold',
    marginLeft: h('1%'),
  },
  RightContainer23: {
    width: '45%',
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'gold',
  },
  LeftContainer233: {
    width: '30%',
    height: '100%',
    justifyContent: 'center',

    // backgroundColor: 'green',
  },
  ProfileContainer23: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC23: {
    width: 55,
    height: 55,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  nameText23: {
    color: '#000',
    fontSize: h('1.9%'),
    fontWeight: 'bold',
  },
  nameText33: {
    color: '#0007',
    fontSize: h('2%'),
  },
  nameText2343: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  Discountbox: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
