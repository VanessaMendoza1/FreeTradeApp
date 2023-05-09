import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {w, h} from 'react-native-responsiveness';

import Appheader from '../../Components/Appheader';
import Ads from '../../Components/Ads';
import ServiceItem from '../../Components/ServiceItem';
import Colors from '../../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {MyTradingAdd, MySellingAdd, MyServiceAdd} from '../../redux/myPost.js';
import firestore from '@react-native-firebase/firestore';
import GetLocation from 'react-native-get-location';
import Distance from './Distence';
import {AddImageAds, AddVideoAds} from '../../redux/adsSlicer';
import {SubDataAdd} from '../../redux/subSlicer';
import {TradingAdd, SellingAdd, ServiceAdd} from '../../redux/postSlice';
import {useIsFocused} from '@react-navigation/native';
import LoadingScreen from '../../Components/LoadingScreen';
import Icons from '../../utils/icons';
import Collapsible from 'react-native-collapsible';


import {getPreciseDistance} from 'geolib';

import moment from 'moment';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'Second',
    content: 'Lorem ipsum...',
  },
];

const getCategoriesAndSubCategories = (callback) => {
  let categoryAlongSubCategories = {}
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
        categoryAlongSubCategories[ title ] = subCategories
      });
      console.log({categoryAlongSubCategories})

      callback(categoryAlongSubCategories)

    });
}
const getItemsFromCategoryAndSubCategory = (categoryName, subCategoryName, callback) => {
  let collectionReferece = firestore()
    .collection('Post')
    .where('Category', '==', categoryName)
    .where('SubCategory', '==', subCategoryName)
  
  let collectionRefereceWithoutSubCategory = firestore()
    .collection('Post')
    .where('Category', '==', categoryName)

  let callbackAfterGettingData = (querySnapshot) => {
    if (querySnapshot.empty){
      console.log('NO ITEMS FOUND');
      return
    }
    let filteredItemsThroughCategoryAndSubCategory = []
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, doc.data());
      let itemData = doc.data()
      let itemId = doc.id // favouriteItemData.productId
      filteredItemsThroughCategoryAndSubCategory.push({...doc.data(), id: doc.id})
    })

    console.log({filteredItemsThroughCategoryAndSubCategory})

    callback(filteredItemsThroughCategoryAndSubCategory)
  }

  if (subCategoryName == null) {
    collectionRefereceWithoutSubCategory
      .get()
      .then(callbackAfterGettingData)
  } else {
    collectionReferece
      .get()
      .then(callbackAfterGettingData)
  }
}

const Home = ({navigation}) => {
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setlatitude] = React.useState(0);
  const [loading, setloading] = useState(false);
  const imageRef = useRef();
  const [active, setActive] = useState(0);
  const indexRef = useRef(active);
  indexRef.current = active;
  const [activeField, setActiveField] = useState('Services');
  const UserData = useSelector(state => state.counter.data);
  const AllPostData = useSelector(state => state.post.PostData);
  const ServiceAllData = useSelector(state => state.post.ServiceData);
  const SellingAllData = useSelector(state => state.post.SellingData);
  const TradingAllData = useSelector(state => state.post.TradingData);
  const [Notii, setNotii] = React.useState('');

  const [searchValue, setSearchValue] = React.useState('');
  const [ServiceData, setServiceData] = React.useState(ServiceAllData);
  const [SellingData, setSellingData] = React.useState(SellingAllData);
  const [TradingData, setTradingData] = React.useState(TradingAllData);
  const [ categoriesWithSubCategoryData, setCategoriesWithSubCategoryData ] = React.useState({})
  const [ showCategoryAndSubCategory, setShowCategoryAndSubCategory ] = React.useState(false)
  const [ showItemsFromCategoryAndSubCategory , setShowItemsFromCategoryAndSubCategory ] = React.useState(false)
  const [ selectedCategory, setSelectedCategory ] = React.useState(null)
  const [ selectedSubCategory, setSelectedSubCategory ] = React.useState(null)
  const [ itemsFromCategoryAndSubCategoryFilteration, setItemsFromCategoryAndSubCategoryFilteration ] = React.useState([])
  
  React.useEffect(() => {
    setSelectedSubCategory(null)
    setItemsFromCategoryAndSubCategoryFilteration([])
  }, [selectedCategory])

  // React.useEffect(() => {
  //   setItemsFromCategoryAndSubCategoryFilteration([])
  // }, [selectedSubCategory])
  
  React.useEffect(() => {
    getCategoriesAndSubCategories(setCategoriesWithSubCategoryData)
  }, [])
  

  // console.warn();

  // console.warn(UserData.AccountType);
  // console.warn(UserData.longitude);

  const ImageAds = useSelector(state => state.ads.ImageData);
  const subdata = useSelector(state => state.sub.subdata);
  // console.warn(subdata[0].plan === 'Business');
  // console.warn(subdata.length > 0);

  const NotificationData = async () => {
    let NotificationData = [];
    await firestore()
      .collection('Notification')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // console.warn(data.UserID);
          if (documentSnapshot.data().userID == UserData.UserID) {
            if (documentSnapshot.data().seen == false) {
              NotificationData.push(documentSnapshot.data());
            }
          }
        });
        setNotii(NotificationData);
        setloading(false);

        // console.warn(NotificationData);
      })
      .catch(err => {
        console.warn(err);
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
          if (documentSnapshot.data().userid === UserData.UserID) {
            const now = moment.utc();
            var end = JSON.parse(documentSnapshot.data().endDate);
            var days = now.diff(end, 'days');

            if (days >= 1) {
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

  const DeletePost = () => {
    firestore()
      .collection('sub')
      .doc(UserData.UserID)
      .delete()
      .then(() => {
        MySubscriptionPackage();
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  const dispatch = useDispatch();

  // useInterval(() => {
  //   if (active < Number(ImageAds?.length) - 1) {
  //     setActive(active + 1);
  //   } else {
  //     setActive(0);
  //   }
  // }, 5000);

  // useEffect(() => {
  //   ImageAds.length >= 1
  //     ? imageRef.current.scrollToIndex({index: active, animated: true})
  //     : null;
  // }, [active]);

  // const onViewableItemsChangedHandler = useCallback(
  //   ({viewableItems, changed}) => {
  //     if (active != 0) {
  //       setActive(viewableItems[0].index);
  //     }
  //   },
  //   [],
  // );

  // const UserDataPost = async () => {
  //   let SellingData = [];
  //   let TradingData = [];
  //   let ServiceData = [];
  //   await firestore()
  //     .collection('Post')
  //     .get()
  //     .then(async querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         if (documentSnapshot.data().PostType === 'Trading') {
  //           TradingData.push(documentSnapshot.data());
  //         }
  //         if (documentSnapshot.data().PostType === 'Selling') {
  //           SellingData.push(documentSnapshot.data());
  //         }
  //         if (documentSnapshot.data().PostType === 'Service') {
  //           ServiceData.push(documentSnapshot.data());
  //         }
  //       });
  //     });

  //   await dispatch(MyTradingAdd(TradingData));
  //   await dispatch(MySellingAdd(SellingData));
  //   await dispatch(MyServiceAdd(ServiceData));
  // };

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

    // console.warn(ImageData);
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
          if (documentSnapshot.data()){
            const lat2 = documentSnapshot.data().user.latitude; // Latitude of second coordinate
            const lon2 = documentSnapshot.data().user.longitude;
            const distanceInKm = Distance(lat1, lon1, lat2, lon2);
  
            if (documentSnapshot.data().status === false) {
              console.log("DISTANCE FOUND IS " + distanceInKm + " WHEREAS USER HAS SET DISTANCE TO " + UserData?.LocationFilter?.LocalDistance)
              if (Math.ceil(distanceInKm) <= UserData?.LocationFilter?.LocalDistance) {
                let newDataObject = {...documentSnapshot.data(), id: documentSnapshot._data.DocId}
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
      .catch((err) =>  {
        console.log(err)
      })

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));
  };

  const focus = useIsFocused();

  useEffect(() => {
    allpost();
  }, []);
  useEffect(() => {
    // whenever you are in the current screen, it will be true vice versa
    if (focus == true) {
      // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
      allpost();
      // UserDataPost();
      Allads();
      MySubscriptionPackage();
      NotificationData();
    }
  }, [focus]);

  const searchFilter = text => {
    if (activeField === 'Services') {
      console.warn('This ran');
      console.log({TEXT: text})
      const newData = ServiceData.filter(item => {
        let itemTitle = item.Title.toLowerCase()
        let searchText = text.toLowerCase()
        if (itemTitle.includes(searchText) || itemTitle == searchText){
          console.log({MATCHED: itemTitle})
          return item
        }
      });
      console.log({ NewData: newData})
      if (text.trim().length === 0) {
        setServiceData(ServiceAllData);
      } else {
        console.log("NEW SEARCH DATA SET SUCCESSFULLY")
        setServiceData(newData);
      }
      setSearchValue(text);
    }
    if (activeField === 'Selling') {
      console.warn('This ran 2');
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
      console.warn('This ran 3');
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

  return (
    <>
      {loading && <LoadingScreen />}

      <View style={styles.mainContainer}>
        <Appheader
          setShowItemsFromCategoryAndSubCategory={setShowItemsFromCategoryAndSubCategory}
          showCategoryAndSubCategory={showCategoryAndSubCategory}
          setShowCategoryAndSubCategory={setShowCategoryAndSubCategory}
          setCategoriesWithSubCategoryData={setCategoriesWithSubCategoryData}
          onSearch={searchFilter}
          onMessage={() => {
            navigation.navigate('MessageScreen');
          }}
          onNotification={() => {
            navigation.navigate('Notification');
          }}
          noti={Notii.length >= 1}
        />
        {(() => {
          if (showItemsFromCategoryAndSubCategory){
            return (
              <ScrollView>
                <>
                  <TouchableOpacity onPress={() => {
                    setShowItemsFromCategoryAndSubCategory(false)
                    setShowCategoryAndSubCategory(true)
                    setItemsFromCategoryAndSubCategoryFilteration([])
                    setSelectedCategory(null)
                    setSelectedSubCategory(null)
                  }}>
                    <Text style={{
                      textAlign: "center", 
                      fontWeight: "bold",
                      paddingVertical: 10,
                      backgroundColor: "#eee",
                      marginBottom: 10
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
                                  navigation.navigate('PostScreen', {data: item});
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
            )
          } else if (showCategoryAndSubCategory){
            return (
              <ScrollView>
                <>
                  <TouchableOpacity onPress={() => {
                    setShowItemsFromCategoryAndSubCategory(false)
                    setShowCategoryAndSubCategory(false)
                    // setSelectedCategory(null)
                    setSelectedSubCategory(null)
                    setItemsFromCategoryAndSubCategoryFilteration([])
                  }}>
                    <Text style={{
                      textAlign: "center", 
                      fontWeight: "bold",
                      paddingVertical: 10,
                      backgroundColor: "#eee",
                      marginBottom: 10
                    }}>
                      X All Categories
                    </Text>
                  </TouchableOpacity>
                  <Collapsible collapsed={!showCategoryAndSubCategory}>
                    
                    {Object.keys(categoriesWithSubCategoryData).map((categoryName) => {
                      return (
                        <TouchableOpacity onPress={() => {
                          if (selectedCategory == categoryName){
                            setSelectedCategory(null)
                          } else {
                            setSelectedCategory(categoryName)
                          }
                        }}>
                          <Text style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            marginVertical: 12,
                            paddingLeft: w("10%")
                          }}>
                            {categoryName}
                          </Text>
                          {(selectedCategory == categoryName) && (
                            <>
                              {categoriesWithSubCategoryData[categoryName].map((subCategoryName, index) => {
                                return (
                                  <TouchableOpacity onPress={() => {
                                    setSelectedSubCategory(subCategoryName)
                                    setSelectedCategory(categoryName)
                                    setShowCategoryAndSubCategory(false)
                                    setShowItemsFromCategoryAndSubCategory(true)
                                    getItemsFromCategoryAndSubCategory(categoryName, subCategoryName, setItemsFromCategoryAndSubCategoryFilteration)
                                  }}>
                                    <Text style={{
                                      // fontWeight: "bold",
                                      fontSize: 18,
                                      marginVertical: 12,
                                      paddingLeft: w("15%")
                                    }}>
                                      {subCategoryName}
                                    </Text>
                                  </TouchableOpacity>
                                )
                              })}
                              {/* <TouchableOpacity onPress={() => {
                                setSelectedSubCategory(null)
                                setSelectedCategory(categoryName)
                                setShowCategoryAndSubCategory(false)
                                setShowItemsFromCategoryAndSubCategory(true)
                                getItemsFromCategoryAndSubCategory(categoryName, null, setItemsFromCategoryAndSubCategoryFilteration)
                              }}>
                                <Text style={{
                                  // fontWeight: "bold",
                                  fontSize: 18,
                                  marginVertical: 12,
                                  paddingLeft: w("15%")
                                }}>
                                  Select all in {categoryName} !
                                </Text>
                              </TouchableOpacity> */}
                            </>
                          )
                        }
                        </TouchableOpacity>
                      )
                    })}
                  </Collapsible>
                </>
              </ScrollView>
            )
          } else {
            return (
              <>
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
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({item, index}) => (
                    <Ads
                      onPress={() => {
                        // await alert('It will take to User Screen');
                        navigation.navigate('OtherUserProfile', {
                          data: item.user,
                        });
                      }}
                      data={item}
                    />
                  )}
                />
              </View>
              
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
                  {(UserData?.LocationFilter?.location === '' || !UserData?.LocationFilter?.location)
                    ? 'Press To Set Search Location'
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
                  {ServiceAllData.length >= 1 ? (
                    <FlatList
                      keyExtractor={(item, index) => String(index)}
                      data={(searchValue == '') ? ServiceAllData : ServiceData}
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
                                  navigation.navigate('PostScreen', {data: item});
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
                  {SellingAllData.length >= 1 ? (
                    <FlatList
                      data={(searchValue == '') ? SellingAllData : SellingData}
                      contentContainerStyle={{paddingBottom: h('3%')}}
                      numColumns={3}
                      keyExtractor={(item, index) => String(index)}
                      renderItem={({item, index}) => {
                        // const lat1 = latitude; // Latitude of first coordinate
                        // const lon1 = longitude; // Longitude of first coordinate
                        // const lat2 = item.user.latitude; // Latitude of second coordinate
                        // const lon2 = item.user.longitude;
                        // const distanceInKm = Distance(lat1, lon1, lat2, lon2);

                        // const distnaceMile = getPreciseDistance(
                        //   {latitude: latitude, longitude: longitude},
                        //   {latitude: lat2, longitude: lon2},
                        // );

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
                                  navigation.navigate('PostScreen', {data: item});
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
                  {TradingAllData.length >= 1 ? (
                    <FlatList
                      data={(searchValue == '') ? TradingAllData : TradingData}
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
                                  navigation.navigate('PostScreen', {data: item});
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
              </>
            )
          }
        })()}
        
      </View>
    </>
  );
};

export default Home;

export { getCategoriesAndSubCategories }

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  HeaderBar: {
    height: h('25%'),
    // backgroundColor: 'red',

    marginTop: h('1%'),
    flexDirection: 'row',
  },
  LocationMeter: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    paddingLeft: h('2%'),
    alignItems: 'center',
  },
  ImgContainer2: {
    width: '13%',
    height: '100%',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LondonUkText: {
    color: Colors.Primary,
    fontSize: h('2%'),
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
