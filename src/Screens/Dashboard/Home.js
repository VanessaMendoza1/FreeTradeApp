import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {w, h} from 'react-native-responsiveness';

import Appheader from '../../Components/Appheader';
import Ads from '../../Components/Ads';
import ServiceItem from '../../Components/ServiceItem';
import Colors from '../../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Distance from './Distence';
import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';
import {SubDataAdd} from '../../redux/subSlicer';
import {TradingAdd, SellingAdd, ServiceAdd} from '../../redux/postSlice';
import {useIsFocused} from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen';
import Icons from '../../utils/icons';
import Collapsible from 'react-native-collapsible';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

import moment from 'moment';
import axios from 'axios';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import InAppReview from 'react-native-in-app-review';
import reactotron from 'reactotron-react-native';

const getCategoriesAndSubCategories = callback => {
  let categoryAlongSubCategories = {};
  firestore()
    .collection('Category')
    .get()
    .then(async querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        let categoryData = documentSnapshot.data();
        let {title, subCategory} = categoryData;
        let subCategories = [];
        if (
          subCategory != null &&
          subCategory != undefined &&
          Array.isArray(subCategory)
        ) {
          subCategory.map(categoryData => {
            let {title: subCategoryTitle} = categoryData;
            subCategories.push(subCategoryTitle);
          });
        }
        categoryAlongSubCategories[title] = subCategories;
      });
      // console.log({categoryAlongSubCategories});

      callback(categoryAlongSubCategories);
    });
};
const inAppPerview = () => {
  // Give you result if version of device supported to rate app or not!
  InAppReview.isAvailable();

  // trigger UI InAppreview
  InAppReview.RequestInAppReview()
    .then(hasFlowFinishedSuccessfully => {
      if (hasFlowFinishedSuccessfully) {
      }
    })
    .catch(error => {
      console.log(error);
    });
};
const getItemsFromCategoryAndSubCategory = (
  categoryName,
  subCategoryName,
  callback,
) => {
  let collectionReferece = firestore()
    .collection('Post')
    .where('Category', '==', categoryName)
    .where('SubCategory', '==', subCategoryName);

  let collectionRefereceWithoutSubCategory = firestore()
    .collection('Post')
    .where('Category', '==', categoryName);

  let callbackAfterGettingData = querySnapshot => {
    if (querySnapshot.empty) {
      return;
    }
    let filteredItemsThroughCategoryAndSubCategory = [];
    querySnapshot.forEach(doc => {
      filteredItemsThroughCategoryAndSubCategory.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    callback(filteredItemsThroughCategoryAndSubCategory);
  };

  if (subCategoryName == null) {
    collectionRefereceWithoutSubCategory.get().then(callbackAfterGettingData);
  } else {
    collectionReferece.get().then(callbackAfterGettingData);
  }
};

const markAllMessagesSeen = callback => {
  const currentUserId = auth().currentUser.uid;
  firestore()
    .collection('Users')
    .doc(currentUserId)
    .update({hasUnseenMessages: false})
    .then(() => callback());
};

const checkIfNewMessagesAvailable = callback => {
  const currentUserId = auth().currentUser.uid;
  firestore()
    .collection('Users')
    .doc(currentUserId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        let userData = documentSnapshot.data();
        if (userData.hasUnseenMessages && userData.hasUnseenMessages == true) {
          callback(true);
        }
      }
    });
};

const Home = ({navigation}) => {
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setlatitude] = React.useState(0);
  const [loading, setloading] = useState(false);
  const animatedFlatlist = useRef(null);
  const [active, setActive] = useState(0);
  const indexRef = useRef(active);
  indexRef.current = active;
  const [activeField, setActiveField] = useState('Services');
  const UserData = useSelector(state => state.counter.data);
  const AllPostData = useSelector(state => state.post.PostData);
  const ServiceAllData = useSelector(state => state.post.ServiceData);
  const SellingAllData = useSelector(state => state.post.SellingData);
  const TradingAllData = useSelector(state => state.post.TradingData);
  const [filterLocationBased, setFilterLocationBased] = useState([]);
  const [Notii, setNotii] = React.useState('');
  // console.log({SellingAllData});
  const [searchValue, setSearchValue] = React.useState('');
  const [ServiceData, setServiceData] = React.useState(ServiceAllData);
  const [SellingData, setSellingData] = React.useState(SellingAllData);
  const [TradingData, setTradingData] = React.useState(TradingAllData);
  const [categoriesWithSubCategoryData, setCategoriesWithSubCategoryData] =
    React.useState({});
  const [showCategoryAndSubCategory, setShowCategoryAndSubCategory] =
    React.useState(false);
  const [
    showItemsFromCategoryAndSubCategory,
    setShowItemsFromCategoryAndSubCategory,
  ] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [
    itemsFromCategoryAndSubCategoryFilteration,
    setItemsFromCategoryAndSubCategoryFilteration,
  ] = React.useState([]);

  const _timerId = useRef(null);

  const [isHavingNewMessages, setIsHavingNewMessages] = React.useState(false);
  const [searchTextt, setSearchTextt] = useState('');
  const [filteredDataService, setFilteredDataService] = useState([]);
  const [filteredDataSelling, setFilteredDataSelling] = useState([]);
  const [filteredDataTrade, setFilteredDataTrade] = useState([]);
  const [AdsData, setAdsData] = useState([]);
  const [subscribedUsersData, setSubscribedUsersData] = useState([]);

  useEffect(() => {
    console.log('UserData', UserData);
    // customSearch(searchTextt);
  }, [searchTextt]);
  useFocusEffect(
    React.useCallback(() => {
      checkIfNewMessagesAvailable(setIsHavingNewMessages);
      CheckValidSubscription();
      getCategoriesAndSubCategories(setCategoriesWithSubCategoryData);
      _stopAutoPlay();
      _startAutoPlay();
      inAppPerview();
      return () => {
        _stopAutoPlay();
      };
    }, []),
  );

  const showItemsThroughLocationFilterWithoutSearchText = (
    activeField,
    setServiceData,
    setSellingData,
    setTradingData,
    searchText,
  ) => {
    let tradingData = [];
    let sellingData = [];
    let serviceData = [];
    firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let postData = {...documentSnapshot.data(), id: documentSnapshot.id};
          let {
            latitude: sellerLatitude,
            longitude: sellerLongitude,
            status,
            user,
            PostType,
            Title,
          } = postData;
          // if (user){
          // let { latitude: sellerLatitude, longitude: sellerLongitude } = user
          const searchLatitude = UserData?.LocationFilter?.latitude;
          const searchLongitude = UserData?.LocationFilter?.longitude;
          const searchDistanceLimit = UserData?.LocationFilter?.LocalDistance;
          const distanceInKm = Distance(
            searchLatitude,
            searchLongitude,
            sellerLatitude,
            sellerLongitude,
          );

          if (Title && Title != '') {
            Title = Title.toLowerCase();
          }
          if (searchText && searchText != '') {
            searchText = searchText.toLowerCase();
          }

          if (searchText != '') {
            if (Title && (Title.includes(searchText) || Title == searchText)) {
              if (status == false) {
                if (distanceInKm <= searchDistanceLimit) {
                  if (PostType === 'Trading' && activeField == 'Trading') {
                    tradingData.push(postData);
                  }
                  if (PostType === 'Selling' && activeField == 'Selling') {
                    sellingData.push(postData);
                  }
                  if (PostType === 'Service' && activeField == 'Services') {
                    serviceData.push(postData);
                  }
                }
              }
            }
          } else {
            if (status == false) {
              if (distanceInKm <= searchDistanceLimit) {
                if (PostType === 'Trading' && activeField == 'Trading') {
                  tradingData.push(postData);
                }
                if (PostType === 'Selling' && activeField == 'Selling') {
                  sellingData.push(postData);
                }
                if (PostType === 'Service' && activeField == 'Services') {
                  serviceData.push(postData);
                }
              }
            }
          }
        });
        setServiceData(serviceData);
        setSellingData(sellingData);
        setTradingData(tradingData);
      });
  };

  const CheckValidSubscription = () => {
    axios
      .get(
        `https://umeraftabdev.com/FreeTradeApi/public/api/valid_subscription?email=${UserData?.email}`,
      )
      .then(res => {})
      .catch(err => {
        uploadSubscription();
      });
  };

  let uploadSubscription = () => {
    firestore()
      .collection('sub')
      .doc(UserData.UserID)
      .delete()
      .then(async () => {
        await dispatch(SubDataAdd([]));
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  React.useEffect(() => {
    showItemsThroughLocationFilterWithoutSearchText(
      activeField,
      setServiceData,
      setSellingData,
      setTradingData,
      searchValue,
    );
  }, [activeField, UserData]);

  React.useEffect(() => {
    setSelectedSubCategory(null);
    setItemsFromCategoryAndSubCategoryFilteration([]);
  }, [selectedCategory]);

  // React.useEffect(() => {
  //   getCategoriesAndSubCategories(setCategoriesWithSubCategoryData)
  //   showItemsThroughLocationFilterWithoutSearchText(activeField, setServiceData, setSellingData, setTradingData, searchValue)
  // }, [])

  // React.useEffect(() => {
  //   _stopAutoPlay();
  //   _startAutoPlay();

  //   return () => _stopAutoPlay()
  // }, [])

  const ImageAds = useSelector(state => state?.ads?.ImageData);
  const VideoAds = useSelector(state => state?.ads?.VideoData);
  const subdata = useSelector(state => state.sub.subdata);

  const NotificationData = async () => {
    const currentUserId = auth()?.currentUser?.uid;
    let NotificationData = [];
    await firestore()
      .collection('Notification')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().userID == currentUserId) {
            if (documentSnapshot.data().seen == false) {
              NotificationData.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
              });
            }
          }
        });
        setNotii(NotificationData);
      })
      .catch(err => {});
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
            console.log('days', days);
            if (days < 1) {
              setloading(false);
              DeletePost();
            } else {
              setloading(false);
              data.push(documentSnapshot.data());
            }
          }
        });
      });
    await dispatch(SubDataAdd(data));
    setloading(false);
  };
  const subscribedUsers = async () => {
    const currentUserId = auth().currentUser.uid;
    let data = [];
    let adsData = [];
    let subscribedUsers = [];
    await firestore()
      .collection('sub')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // if (documentSnapshot.data().userid === currentUserId) {
          const now = moment.utc();
          var end = JSON.parse(documentSnapshot.data().endDate);
          var days = now.diff(end, 'days');
          console.log('sub', days);

          if (days < 1) {
            setloading(false);
            DeletePost();
          } else {
            setloading(false);
            subscribedUsers?.push(documentSnapshot.data().userid);
            data.push(documentSnapshot.data());
            // console.log(subscribedUsers, subscribedUsers.length + 'lengthy');
          }
        });
      });
    setSubscribedUsersData(subscribedUsers);
    // await dispatch(SubDataAdd(data));
    setloading(false);
  };
  const DeletePost = () => {
    const currentUserId = auth().currentUser.uid;
    firestore()
      .collection('sub')
      .doc(currentUserId)
      .delete()
      .then(() => {
        MySubscriptionPackage();
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  const dispatch = useDispatch();
  const Allads = async () => {
    let ImageData = [];
    let VideoData = [];

    await firestore()
      .collection('Ads')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot?.data()?.MediaType === 'Image') {
            ImageData.push(documentSnapshot.data());
          }
          if (documentSnapshot?.data()?.MediaType === 'Videos') {
            VideoData.push(documentSnapshot.data());
          }
        });
      });
    await dispatch(AddImageAds(ImageData));
    await dispatch(AddVideoAds(VideoData));
  };

  const allpost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    const lat1 = UserData?.LocationFilter?.latitude; // Latitude of first coordinate
    const lon1 = UserData?.LocationFilter?.longitude; // Longitude of first coordinate

    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data()) {
            const lat2 = documentSnapshot.data().user.latitude; // Latitude of second coordinate
            const lon2 = documentSnapshot.data().user.longitude;
            const distanceInKm = Distance(lat1, lon1, lat2, lon2);

            if (documentSnapshot.data().status === false) {
              if (
                Math.ceil(distanceInKm) <=
                UserData?.LocationFilter?.LocalDistance
              ) {
                let newDataObject = {
                  ...documentSnapshot.data(),
                  id: documentSnapshot._data.DocId,
                };
                if (documentSnapshot.data().PostType === 'Trading') {
                  TradingData.push(newDataObject);
                }
                if (documentSnapshot.data().PostType === 'Selling') {
                  SellingData.push(newDataObject);
                }
                if (documentSnapshot.data().PostType === 'Service') {
                  ServiceData.push(newDataObject);
                }
              }
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
      });

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));
  };

  const focus = useIsFocused();

  useEffect(() => {
    allpost();
    NotificationData();
    subscribedUsers().then(res => {
      // console.log(res, 'res');
    });
  }, []);
  useEffect(() => {
    ImageAds.filter(item => {
      if (UserData?.LocationFilter?.location === item.user?.location) {
        filterLocationBased.push(item);
      }
    });
    let adsData = filterLocationBased?.filter(element => {
      return subscribedUsersData?.includes(element?.UserID);
    });
    setAdsData(adsData);
  }, [subscribedUsersData, focus]);
  useEffect(() => {
    // whenever you are in the current screen, it will be true vice versa
    // if (focus === true) {
    // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
    allpost();
    // UserDataPost();
    Allads();
    MySubscriptionPackage();
    NotificationData();
    // }
  }, [focus]);

  // console.log({SellingAllData1: SellingAllData});

  const searchFilter = text => {
    if (activeField === 'Services') {
      const newData = ServiceData.filter(item => {
        let itemTitle = item.Title.toLowerCase();
        let searchText = text.toLowerCase();
        if (itemTitle.includes(searchText) || itemTitle == searchText) {
          // console.log({MATCHED: itemTitle});
          return item;
        }
      });
      // console.log({NewData: newData});
      if (text.trim().length === 0) {
        setServiceData(ServiceAllData);
      } else {
        // console.log('NEW SEARCH DATA SET SUCCESSFULLY');
        setServiceData(newData);
      }
      setSearchValue(text);
    }
    if (activeField === 'Selling') {
      const newData = SellingData.filter(item => {
        return item.Title.toUpperCase().search(text.toUpperCase()) > -1;
      });

      if (text.trim().length === 0) {
        setSellingData(SellingAllData);
      } else {
        setSellingData(newData);
      }
      setSearchValue(text);
    }
    if (activeField === 'Trading') {
      const newData = TradingData.filter(item => {
        return item.Title.toUpperCase().search(text.toUpperCase()) > -1;
      });
      if (text.trim().length === 0) {
        setTradingData(TradingAllData);
      } else {
        setTradingData(newData);
      }
      setSearchValue(text);
    }
  };

  // moving slider content starts here
  let CurrentSlide = 0;
  let IntervalTime = 2000;

  const _goToNextPage = () => {
    if (CurrentSlide >= ImageAds.length - 1) CurrentSlide = 0;

    if (animatedFlatlist.current != null) {
      animatedFlatlist.current.scrollToIndex({
        index: ++CurrentSlide,
        animated: true,
      });
    }
  };

  const _startAutoPlay = () => {
    _timerId.current = setInterval(_goToNextPage, IntervalTime);
    // this._timerId = setInterval(this._goToNextPage, IntervalTime);
  };

  const _stopAutoPlay = () => {
    if (_timerId.current) {
      clearInterval(_timerId.current);
      _timerId.current = null;
    }
  };

  const _renderItem = ({item, index}) => {
    return <Image source={{uri: item}} style={styles.sliderItems} />;
  };
  const renderSlider = () => {
    const width = Dimensions.get('window').width;
    return (
      <GestureHandlerRootView>
        <View style={{flex: 1}}>
          <Carousel
            loop
            width={width}
            height={'45%'}
            autoPlay={true}
            windowSize={100}
            data={ImageAds}
            scrollAnimationDuration={1500}
            // panGestureHandlerProps={{
            //   activeOffsetX: [-10, 10],
            // }}
            onSnapToItem={index => {}}
            renderItem={({item, index}) => {
              return (
                <Ads
                  onPress={() => {
                    // await alert('It will take to User Screen');
                    navigation.navigate('OtherUserProfile', {
                      data: item?.user,
                    });
                  }}
                  data={item}
                />
                // <View
                //   style={{
                //     borderWidth: 1,
                //     justifyContent: 'center',
                //     backgroundColor: 'red',
                //   }}>
                //   <Text style={{textAlign: 'center', fontSize: 30, color: 'black'}}>
                //     {index}
                //   </Text>
                // </View>
              );
            }}
          />
        </View>
      </GestureHandlerRootView>
    );
  };
  const _keyExtractor = (item, index) => {
    // console.log(item);
    return index.toString();
  };
  // moving slider content starts here
  // console.log({NOTI: Notii.length});
  const customSearch = text => {
    if (activeField === 'Selling') {
      const filterdData = text // based on text, filter data and use filtered data
        ? SellingData?.filter(item => {
            const itemData = item?.Title
              ? item?.Title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
          })
        : SellingData; // on on text, u can return all data
      setFilteredDataSelling(filterdData);
      setSearchTextt(text);
    } else if (activeField === 'Services') {
      const filterdData = text // based on text, filter data and use filtered data
        ? ServiceData?.filter(item => {
            const itemData = item?.Title
              ? item?.Title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
          })
        : ServiceData; // on on text, u can return all data
      setFilteredDataService(filterdData);
      setSearchTextt(text);
    } else if (activeField === 'Trading') {
      const filterdData = text // based on text, filter data and use filtered data
        ? TradingData?.filter(item => {
            const itemData = item?.Title
              ? item?.Title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
          })
        : TradingData; // on on text, u can return all data
      setFilteredDataTrade(filterdData);
      setSearchTextt(text);
    } else {
    }
  };
  return (
    <>
      {loading && <LoadingScreen />}

      <View style={styles.mainContainer}>
        <Appheader
          isHavingNewMessages={isHavingNewMessages}
          setSearchValue={setSearchValue}
          setShowItemsFromCategoryAndSubCategory={
            setShowItemsFromCategoryAndSubCategory
          }
          showCategoryAndSubCategory={showCategoryAndSubCategory}
          setShowCategoryAndSubCategory={setShowCategoryAndSubCategory}
          setCategoriesWithSubCategoryData={setCategoriesWithSubCategoryData}
          onSearch={text => {
            setSearchTextt(text);
            customSearch(text);
            showItemsThroughLocationFilterWithoutSearchText(
              activeField,
              UserData,
              setServiceData,
              setSellingData,
              setTradingData,
              text,
            );
          }}
          onMessage={() => {
            markAllMessagesSeen(() => setIsHavingNewMessages(false));
            navigation.navigate('MessageScreen');
          }}
          onNotification={() => {
            navigation.navigate('Notification');
          }}
          noti={Notii.length >= 1}
        />
        {(() => {
          if (showItemsFromCategoryAndSubCategory) {
            return (
              <ScrollView>
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setShowItemsFromCategoryAndSubCategory(false);
                      setShowCategoryAndSubCategory(true);
                      setItemsFromCategoryAndSubCategoryFilteration([]);
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        paddingVertical: 10,
                        backgroundColor: '#eee',
                        marginBottom: 10,
                      }}>
                      Select Category And Sub-category Again
                    </Text>
                  </TouchableOpacity>
                  {/* {itemsFromCategoryAndSubCategoryFilteration.map((item) => {
                    return (
                      <View>
                        <Text>
                          {JSON.stringify(item)}
                        </Text>
                      </View>
                    )
                  })} */}
                  {itemsFromCategoryAndSubCategoryFilteration.length >= 1 ? (
                    <FlatList
                      data={itemsFromCategoryAndSubCategoryFilteration}
                      contentContainerStyle={{paddingBottom: h('3%')}}
                      numColumns={3}
                      keyExtractor={(item, index) => String(index)}
                      renderItem={({item, index}) => {
                        return (
                          <>
                            <View
                              style={{
                                flex: 1,
                                margin: 2,
                                backgroundColor: '#fff',
                                height: h('19%'),
                              }}>
                              <ServiceItem
                                item={item}
                                onPress={() => {
                                  navigation.navigate('PostScreen', {
                                    data: item,
                                  });
                                }}
                              />
                            </View>
                          </>
                        );
                      }}
                      keyExtractor={item => item.DocId}
                    />
                  ) : (
                    <View style={styles.ViewMainFrame}>
                      <Text>No search results. Please try changing your</Text>
                      <Text>location to find in a different city.</Text>
                    </View>
                  )}
                </>
              </ScrollView>
            );
          } else if (showCategoryAndSubCategory) {
            return (
              <ScrollView>
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setShowItemsFromCategoryAndSubCategory(false);
                      setShowCategoryAndSubCategory(false);
                      // setSelectedCategory(null)
                      setSelectedSubCategory(null);
                      setItemsFromCategoryAndSubCategoryFilteration([]);
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        paddingVertical: 10,
                        backgroundColor: '#eee',
                        marginBottom: 10,
                      }}>
                      X All Categories
                    </Text>
                  </TouchableOpacity>
                  <Collapsible collapsed={!showCategoryAndSubCategory}>
                    {Object.keys(categoriesWithSubCategoryData).map(
                      categoryName => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (selectedCategory == categoryName) {
                                setSelectedCategory(null);
                              } else {
                                setSelectedCategory(categoryName);
                              }
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginVertical: 12,
                                paddingLeft: w('10%'),
                              }}>
                              {categoryName}
                            </Text>
                            {selectedCategory == categoryName && (
                              <>
                                {categoriesWithSubCategoryData[
                                  categoryName
                                ].map((subCategoryName, index) => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setSelectedSubCategory(subCategoryName);
                                        setSelectedCategory(categoryName);
                                        setShowCategoryAndSubCategory(false);
                                        setShowItemsFromCategoryAndSubCategory(
                                          true,
                                        );
                                        getItemsFromCategoryAndSubCategory(
                                          categoryName,
                                          subCategoryName,
                                          setItemsFromCategoryAndSubCategoryFilteration,
                                        );
                                      }}>
                                      <Text
                                        style={{
                                          // fontWeight: "bold",
                                          fontSize: 18,
                                          marginVertical: 12,
                                          paddingLeft: w('15%'),
                                        }}>
                                        {subCategoryName}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelectedSubCategory(null);
                                    setSelectedCategory(categoryName);
                                    setShowCategoryAndSubCategory(false);
                                    setShowItemsFromCategoryAndSubCategory(
                                      true,
                                    );
                                    getItemsFromCategoryAndSubCategory(
                                      categoryName,
                                      null,
                                      setItemsFromCategoryAndSubCategoryFilteration,
                                    );
                                  }}>
                                  <Text
                                    style={{
                                      // fontWeight: "bold",
                                      fontSize: 18,
                                      marginVertical: 12,
                                      paddingLeft: w('15%'),
                                    }}>
                                    Select all in {categoryName}
                                  </Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </TouchableOpacity>
                        );
                      },
                    )}
                  </Collapsible>
                </>
              </ScrollView>
            );
          } else {
            return (
              <ScrollView>
                <View style={styles.HeaderBar}>{renderSlider()}</View>

                {/* {ImageAds.length > 0 ? (
                <>
                  {subdata.length > 0 && (
                    <>
                      
                      {UserData.AccountType === 'Business' ? null : (
                        <View style={styles.HeaderBar}>
                          <FlatList
                            showsHorizontalScrollIndicator={false}
                            // onViewableItemsChanged={onViewableItemsChangedHandler}
                            viewabilityConfig={{
                              itemVisiblePercentThreshold: 50,
                            }}
                            ref={imageRef}
                            pagingEnabled
                            data={ImageAds}
                            horizontal
                            renderItem={({item, index}) => (
                              <Ads
                                onPress={() => {
                                  alert('It will take to User Screen');
                                  // navigation.navigate('OtherUserProfile', {
                                  //   data: item.user,
                                  // });
                                }}
                                data={item}
                              />
                            )}
                          />
                        </View>
                      )}
                    </>
                  )}
                </>
              ) : null} */}
                {/* 
            {ImageAds.length > 0 ? (
              <View style={styles.HeaderBar}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  // onViewableItemsChanged={onViewableItemsChangedHandler}
                  viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                  }}
                  ref={imageRef}
                  pagingEnabled
                  data={ImageAds}
                  horizontal
                  renderItem={({item, index}) => <Ads data={item} />}
                />
              </View>
            ) : null} */}

                {/* location meter */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LocationScreen');
                  }}
                  style={styles.LocationMeter}>
                  <View style={styles.ImgContainer2}>
                    {Icons.LocationIcon({
                      tintColor: 'red',
                    })}
                    {/* <Image
                    style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                    source={require('../../../assets/carimg.png')}
                  /> */}
                  </View>
                  <Text style={styles.LondonUkText}>
                    {UserData?.LocationFilter?.location === '' ||
                    !UserData?.LocationFilter?.location
                      ? 'Set Search Location'
                      : UserData?.LocationFilter?.location}
                  </Text>
                </TouchableOpacity>
                {/* location meter */}
                {/* button Containers */}
                <View style={styles.BtnContainer}>
                  {activeField === 'Services' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Services');
                      }}
                      style={styles.Btn}>
                      <Text style={styles.Txt1}>Services</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Services');
                      }}
                      style={styles.Btn2}>
                      <Text style={styles.Txt2}>Services</Text>
                    </TouchableOpacity>
                  )}
                  {activeField === 'Selling' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Selling');
                      }}
                      style={styles.Btn}>
                      <Text style={styles.Txt1}>Selling</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Selling');
                      }}
                      style={styles.Btn2}>
                      <Text style={styles.Txt2}>Selling</Text>
                    </TouchableOpacity>
                  )}
                  {activeField === 'Trading' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Trading');
                      }}
                      style={styles.Btn}>
                      <Text style={styles.Txt1}>Trading</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setActiveField('Trading');
                      }}
                      style={styles.Btn2}>
                      <Text style={styles.Txt2}>Trading</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {/* button Containers */}

                {activeField === 'Services' && (
                  <>
                    {ServiceData.length >= 1 ? (
                      <FlatList
                        keyExtractor={(item, index) => String(index)}
                        // data={(searchValue == '') ? ServiceAllData : ServiceData} // ServiceData SellingData TradingData
                        data={searchTextt ? filteredDataService : ServiceData}
                        contentContainerStyle={{paddingBottom: h('3%')}}
                        numColumns={3}
                        renderItem={({item}) => {
                          const lat1 = latitude; // Latitude of first coordinate
                          const lon1 = longitude; // Longitude of first coordinate
                          const lat2 = item.user.latitude; // Latitude of second coordinate
                          const lon2 = item.user.longitude;
                          const distanceInKm = Distance(lat1, lon1, lat2, lon2);

                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  margin: 2,
                                  backgroundColor: '#fff',
                                  height: h('19%'),
                                }}>
                                <ServiceItem
                                  item={item}
                                  onPress={() => {
                                    navigation.navigate('PostScreen', {
                                      data: item,
                                    });
                                  }}
                                />
                              </View>
                            </>
                          );
                        }}
                        keyExtractor={item => item.DocId}
                      />
                    ) : (
                      <View style={styles.ViewMainFrame}>
                        <Text>No search results. Please try changing your</Text>
                        <Text>location to find in a different city.</Text>
                      </View>
                    )}
                  </>
                )}
                {activeField === 'Selling' && (
                  <>
                    {SellingData.length >= 1 ? (
                      <FlatList
                        // data={(searchValue == '') ? SellingAllData : SellingData} // ServiceData SellingData TradingData
                        data={searchTextt ? filteredDataSelling : SellingData} // ServiceData SellingData TradingData
                        contentContainerStyle={{paddingBottom: h('3%')}}
                        numColumns={3}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({item, index}) => {
                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  margin: 2,
                                  backgroundColor: '#fff',
                                  height: h('19%'),
                                }}>
                                <ServiceItem
                                  item={item}
                                  onPress={() => {
                                    navigation.navigate('PostScreen', {
                                      data: item,
                                    });
                                  }}
                                />
                              </View>
                            </>
                          );
                        }}
                        keyExtractor={item => item.DocId}
                      />
                    ) : (
                      <View style={styles.ViewMainFrame}>
                        <Text>No search results. Please try changing your</Text>
                        <Text>location to find in a different city.</Text>
                      </View>
                    )}
                  </>
                )}
                {activeField === 'Trading' && (
                  <>
                    {TradingData.length >= 1 ? (
                      <FlatList
                        // data={(searchValue == '') ? TradingAllData : TradingData} // ServiceData SellingData TradingData
                        data={searchTextt ? filteredDataTrade : TradingData} // ServiceData SellingData TradingData
                        contentContainerStyle={{paddingBottom: h('3%')}}
                        numColumns={3}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({item}) => {
                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  margin: 2,
                                  backgroundColor: '#fff',
                                  height: h('19%'),
                                }}>
                                <ServiceItem
                                  item={item}
                                  onPress={() => {
                                    navigation.navigate('PostScreen', {
                                      data: item,
                                    });
                                  }}
                                />
                              </View>
                            </>
                          );
                        }}
                        keyExtractor={item => item.DocId}
                      />
                    ) : (
                      <View style={styles.ViewMainFrame}>
                        <Text>No search results. Please try changing your</Text>
                        <Text>location to find in a different city.</Text>
                      </View>
                    )}
                  </>
                )}
              </ScrollView>
            );
          }
        })()}
      </View>
    </>
  );
};

export default Home;

export {getCategoriesAndSubCategories};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  HeaderBar: {
    height: h('45%'),
    // backgroundColor: 'red',

    marginTop: h('1%'),
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  LocationMeter: {
    width: '95%',
    height: h('7%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    paddingLeft: h('2%'),
    alignItems: 'center',
    backgroundColor: '#0002',
    marginTop: 5,
    alignSelf: 'center',
    borderRadius: 10,
  },
  ImgContainer2: {
    width: '13%',
    height: '100%',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LondonUkText: {
    color: Colors.red,
    fontSize: h('2%'),
    fontWeight: '700',
    width: '90%',
  },
  BtnContainer: {
    // backgroundColor: 'red',
    height: h('7%'),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Btn: {
    width: '32%',
    height: '75%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn2: {
    width: '32%',
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
  ViewMainFrame: {
    backgroundColor: 'white',
    width: '100%',
    height: h('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
