import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import Appbutton from '../../Components/Appbutton';
import LoadingScreen from '../../Components/LoadingScreen';
import moment from 'moment';
import auth from '@react-native-firebase/auth';

import {TradingAdd, SellingAdd, ServiceAdd} from '../../redux/postSlice';
import Distance from '../Dashboard/Distence';

import firestore from '@react-native-firebase/firestore';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import {useSelector, useDispatch} from 'react-redux';
import {MyTradingAdd, MySellingAdd, MyServiceAdd} from '../../redux/myPost.js';
import {PostAdd} from '../../redux/postSlice';
import uuid from 'react-native-uuid';
import {DataInsert} from '../../redux/counterSlice';
import {getCategoriesAndSubCategories} from '../Dashboard/Home';
const PostSubmitDetails = ({navigation, route}) => {
  const [items, setItems] = React.useState([
    {label: 'Baby Care', value: 'Baby Care'},
    {label: 'Shoes', value: 'Shoes'},
    {label: 'Electronic', value: 'Electronic'},
    {label: 'Computers', value: 'Computers'},
  ]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const [items2, setItems2] = React.useState([
    {label: 'Athletic Shoes', value: 'Athletic Shoes'},
    {label: 'Boat shoes', value: 'Boat shoes'},
    {label: 'Brogue shoes', value: 'Brogue shoes'},
    {label: 'High heels', value: 'High heels'},
  ]);
  const [open2, setOpen2] = React.useState(false);
  const [value2, setValue2] = React.useState(null);

  const [items3, setItems3] = React.useState([
    {label: 'New', value: 'New'},
    {label: 'Used', value: 'Used'},
    {label: 'Fair', value: 'Fair'},
    {label: 'Good', value: 'Good'},
    {label: 'excellent', value: 'excellent'},
    {label: 'Broken', value: 'Broken'},
  ]);
  const [open3, setOpen3] = React.useState(false);
  const [value3, setValue3] = React.useState(null);
  const [brand, setbrand] = React.useState('');
  const [trialSize, setTrialSize] = useState(1);
  const [canPost, setCanPostAd] = useState(true);
  const [Description, setDescription] = React.useState('');
  const MyData = useSelector(state => state.counter.data);
  const [isUserHavingLocation, setIsUserHavingLocation] = React.useState(
    MyData?.latitude && MyData?.longitude ? true : false,
  );
  const [
    entireCategoryAndSubCategoryData,
    setEntireCategoryAndSubCategoryData,
  ] = React.useState({});

  // React.useEffect(() => {
  //   if (value == "Services"){
  //     setItems3([
  //       {label: 'Good', value: 'Good'},
  //       {label: 'excellent', value: 'excellent'},
  //     ])
  //   }
  // }, [value])

  React.useEffect(() => {
    setValue2({});
    setValue3({});
    if (
      Object.keys(entireCategoryAndSubCategoryData).length > 0 &&
      value != null
    ) {
      let relatedSubCategories = entireCategoryAndSubCategoryData[value];
      let subCategories = [];
      relatedSubCategories.map(subCategory => {
        subCategories.push({label: subCategory, value: subCategory});
      });
      setItems2(subCategories);
    }
  }, [value]);

  const flattenCategoriesForDropDown = data => {
    let categories = [];
    Object.keys(data).map(categoryName => {
      categories.push({label: categoryName, value: categoryName});
    });
    setEntireCategoryAndSubCategoryData(data);
    setItems(categories);
  };
  React.useEffect(() => {
    getCategoriesAndSubCategories(flattenCategoriesForDropDown);
  }, []);

  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const checkFreeCount = async (POstId, userId) => {
    await firestore()
      .collection('TrialPost')
      .doc(userId)
      .get()
      .then(async querySnapshot => {
        console.log('Total users: ', querySnapshot?.data()?.PostCount);
        if (querySnapshot?.data()?.PostCount) {
          if (querySnapshot?.data()?.PostCount < 3) {
            setTrialSize(querySnapshot?.data()?.PostCount + 1);
            postAdd(POstId, userId, querySnapshot?.data()?.PostCount + 1);
          } else {
            alert('you have to subscribe for posting ad');
            setCanPostAd(false);
            navigation.navigate('PostPromotion', {
              data: {
                brand: MyData?.brand,
                condition: MyData?.condition,
                images: MyData?.images,
                title: MyData?.Title,
              },
              type: 'post',
              postData: {
                UserID: userId,
                images: route.params.images,
                Title: route.params.Title,
                PostType: route.params.Type,
                Price: route.params.Price,
                Category: value,
                SubCategory: value2,
                Condition: value3,
                Brand: brand,
                Description: Description,
                user: MyData,
                DocId: POstId,
                Discount: 0,
                status: false,
                latitude: MyData?.latitude
                  ? MyData?.latitude
                  : 'No Location Set By User',
                longitude: MyData?.longitude
                  ? MyData?.longitude
                  : 'No Location Set By User',
                Notification: MyData?.NotificationToken,
                videUrl: route?.params?.VideoUrl,
              },
            });
          }
        } else {
          querySnapshot.forEach(documentSnapshot => {
            console.log('trial', documentSnapshot.data());
          });
          postAdd(POstId, userId, trialSize);
        }
      })
      .catch(err => {
        postAdd(POstId, userId, trialSize);
        console.log('Caught error while submitting post');
        console.log(err);
      });
    setloading(false);
  };
  const addFreePostsCount = async (userID, count) => {
    firestore()
      .collection('TrialPost')
      .doc(userID)
      .set({
        UserID: userID,
        PostCount: count,
      })
      .then(async doc => {})
      .catch(err => {
        console.log('Caught error while submitting post');
        console.log(err);
      });
    setloading(false);
  };
  const MySubscriptionPackage = async (POstId, userID) => {
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
              postAdd(postAdd(POstId, userID, trialSize));
              // DeletePost();
            } else {
              setloading(false);
              checkFreeCount(POstId, MyData?.UserID);
              // data.push(documentSnapshot.data());
            }
          }
        });
      });
    setloading(false);
  };
  const onSubmit = () => {
    let POstId = uuid.v4();
    setloading(true);
    if (!isUserHavingLocation) {
      alert('Please set your location in settings first');
      setloading(false);
      navigation.navigate('Setting');
      return;
    }
    postAdd(POstId, MyData?.UserID);
    // MySubscriptionPackage(POstId, MyData.UserID);
  };
  const postAdd = async (POstId, userID) => {
    await firestore()
      .collection('Post')
      .doc(POstId)
      .set({
        UserID: userID,
        images: route.params?.images,
        Title: route.params?.Title,
        PostType: route.params?.Type,
        Price: route.params?.Price,
        Category: value,
        SubCategory: value2,
        Condition: value3,
        Brand: brand,
        Description: Description,
        user: MyData,
        DocId: POstId,
        Discount: 0,
        status: false,
        latitude: MyData?.latitude
          ? MyData?.latitude
          : 'No Location Set By User',
        longitude: MyData?.longitude
          ? MyData?.longitude
          : 'No Location Set By User',
        Notification: MyData?.NotificationToken,
        videUrl: route.params?.VideoUrl,
      })
      .then(async doc => {
        // addFreePostsCount(MyData.UserID, count);

        let PostData = [];
        await firestore()
          .collection('Post')
          .get()
          .then(async querySnapshot => {
            console.log('Total users: ', querySnapshot.size);

            querySnapshot.forEach(documentSnapshot => {
              PostData.push(documentSnapshot.data());
            });
            allmypost();
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
  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];

    const lat1 = MyData?.latitude; // Latitude of first coordinate
    const lon1 = MyData?.longitude; // Longitude of first coordinate

    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          try {
            let lat2;
            let lon2;
            lat2 = documentSnapshot.data().user.latitude; // Latitude of second coordinate
            lon2 = documentSnapshot.data().user.longitude;
            const distanceInKm = Distance(lat1, lon1, lat2, lon2);

            if (documentSnapshot.data().status === false) {
              if (Math.ceil(distanceInKm) <= 160) {
                if (documentSnapshot.data().PostType === 'Trading') {
                  TradingData.push(documentSnapshot.data());
                }
                if (documentSnapshot.data().PostType === 'Selling') {
                  SellingData.push(documentSnapshot.data());
                }
                if (documentSnapshot.data().PostType === 'Service') {
                  ServiceData.push(documentSnapshot.data());
                }
              }
            }
          } catch (_err) {
            console.log(_err);
          }
        });
      });

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));

    UserDataPost();
  };

  const UserDataPost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().UserID === MyData?.UserID) {
            if (documentSnapshot.data().PostType === 'Trading') {
              TradingData.push(documentSnapshot.data());
            }
            if (documentSnapshot.data().PostType === 'Selling') {
              SellingData.push(documentSnapshot.data());
            }
            if (documentSnapshot.data().PostType === 'Service') {
              ServiceData.push(documentSnapshot.data());
            }
          }
        });
      });

    await dispatch(MyTradingAdd(TradingData));
    await dispatch(MySellingAdd(SellingData));
    await dispatch(MyServiceAdd(ServiceData));
    updateName();
  };

  const updateName = () => {
    setloading(true);
    firestore()
      .collection('Users')
      .doc(MyData?.UserID)
      .update({
        Post: MyData?.Post + 1,
      })
      .then(async () => {
        let userData = [];
        await firestore()
          .collection('Users')
          .doc(MyData?.UserID)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              userData.push(documentSnapshot.data());
            }
          })
          .catch(err => {
            setloading(false);
          });

        await dispatch(DataInsert(userData[0]));

        navigation.replace('Posted', {
          title: route.params.Title,
          images: route.params.images,
          condition: value3,
          brand: brand,
        });

        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <KeyboardAvoidingScrollView>
          <View style={styles.MainContainer}>
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
                <Text style={styles.FontWork}>Details</Text>
              </View>
            </View>
            {/* header */}

            <View style={styles.MainCRCCOntainer}>
              <Text style={styles.CategoryItem}>Category</Text>
              <View style={{zIndex: 4000}}>
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
              {value && (
                <>
                  <Text style={styles.CategoryItem}>Sub-category</Text>
                  <View style={{zIndex: 3000}}>
                    <DropDownPicker
                      open={open2}
                      value={value2}
                      items={items2}
                      setOpen={setOpen2}
                      zIndex={3000}
                      setValue={setValue2}
                      setItems={setItems2}
                      style={{
                        borderWidth: h('0.3%'),
                        borderColor: Colors.Primary,
                        zIndex: 1000,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                </>
              )}
              {value2 && (
                <>
                  <Text style={styles.CategoryItem}>
                    {value == 'Services' ? 'Condition / Service' : 'Condition'}
                  </Text>
                  <View style={{zIndex: 2000}}>
                    <DropDownPicker
                      open={open3}
                      value={value3}
                      items={items3}
                      setOpen={setOpen3}
                      zIndex={3000}
                      setValue={setValue3}
                      setItems={setItems3}
                      style={{
                        borderWidth: h('0.3%'),
                        borderColor: Colors.Primary,
                        zIndex: 1000,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                </>
              )}
              {value3 && (
                <>
                  <Text style={styles.CategoryItem}>Brand</Text>
                  <TextInput
                    style={styles.InputTextCC}
                    placeholder={'Brand (Optional)'}
                    onChangeText={e => setbrand(e)}
                  />
                </>
              )}
              {value3 && (
                <>
                  <Text style={styles.CategoryItem}>Description</Text>
                  <TextInput
                    style={styles.InputTextCC2}
                    placeholder={'Description'}
                    onChangeText={e => setDescription(e)}
                  />
                </>
              )}
              {value3 && (
                <View style={styles.Btncc}>
                  {Description ? (
                    <Appbutton
                      onPress={() => {
                        onSubmit();
                      }}
                      text={'Submit'}
                    />
                  ) : (
                    <View style={styles.MainContainer22}>
                      <Text style={styles.BtnText}>Submit</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingScrollView>
      )}
    </>
  );
};

export default PostSubmitDetails;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('90%'),
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
  MainCRCCOntainer: {
    width: '90%',
    height: h('85%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    paddingTop: h('2%'),
    marginTop: h('2%'),
  },
  CategoryItem: {
    color: Colors.Primary,
    fontSize: h('2.8%'),
    fontWeight: 'bold',
    marginTop: h('1%'),
    marginBottom: h('0.2%'),
  },
  InputTextCC: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'red',
    borderColor: Colors.Primary,
    fontSize: h('2%'),
    borderWidth: h('0.2%'),
    paddingLeft: h('1%'),
  },
  InputTextCC2: {
    width: '100%',
    height: h('17%'),
    // backgroundColor: 'red',
    borderColor: Colors.Primary,
    fontSize: h('2%'),
    borderWidth: h('0.2%'),
    paddingLeft: h('1%'),
  },
  Btncc: {
    width: '100%',
    height: h('14%'),
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainContainer22: {
    width: '90%',
    height: h('7%'),
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    color: '#fff',
    fontSize: h('2.5%'),
    fontWeight: 'bold',
  },
});
