import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  ScrollView,
} from 'react-native';

import React, {useEffect} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import ServiceItem from '../../Components/ServiceItem';
import ReportPopup from '../../Components/ReportPopup';
import firestore from '@react-native-firebase/firestore';
import {MyTradingAdd, MySellingAdd, MyServiceAdd} from '../../redux/myPost.js';
import {useSelector, useDispatch} from 'react-redux';
import LoadingScreen from '../../Components/LoadingScreen';

const OtherUserProfile = ({navigation, route}) => {
  console.warn(route.params.data);
  const [activeField, setActiveField] = React.useState('Services');

  const [mode, setmode] = React.useState(false);
  const [admin, setadmin] = React.useState(false);
  // const MyData = useSelector(state => state.counter.data);
  const dispatch = useDispatch();

  const [TradingD, setTradingD] = React.useState([]);
  const [SellingD, setSellingD] = React.useState([]);
  const [ServiceD, setServiceD] = React.useState([]);

  const [loading, setloading] = React.useState(true);
  const [User, setUser] = React.useState([]);
  // console.warn(User[0].BussinessDetails);

  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().UserID === route.params.data.UserID) {
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
        });
      });

    setTradingD(TradingData);
    setSellingD(SellingData);
    setServiceD(ServiceData);
  };

  const MyData = async () => {
    // setloading(true);
    let userData = [];
    await firestore()
      .collection('Users')
      .doc(route.params.data.UserID)
      .get()
      .then(async documentSnapshot => {
        if (documentSnapshot.exists) {
          userData.push(documentSnapshot.data());
        }
        await setUser(userData);
        console.warn(userData);
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.warn(err);
      });
  };

  useEffect(() => {
    MyData();
    allmypost();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
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
                <Text style={styles.FontWork}>Profile</Text>
              </View>

              <TouchableOpacity
                // onPress={() => {
                // alert('Invited');
                // setadmin(!admin);
                // }}
                style={styles.LeftContainer}>
                {/* <Text style={styles.InviteText}>Invite</Text> */}
              </TouchableOpacity>
            </View>
            {/* header */}

            {/* profileHeader */}
            <View style={styles.ProfileHeader}>
              {/* topSction */}
              <View
                style={{
                  flexDirection: 'row',
                  height: '70%',
                  // backgroundColor: 'green',
                }}>
                <View style={styles.LeftContainerPP}>
                  <View style={styles.ProfileCC}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover',
                      }}
                      source={{
                        uri: route.params.data.image
                          ? route.params.data.image
                          : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                      }}
                    />
                  </View>
                </View>
                <View style={styles.RightContainerPP}>
                  <View style={styles.BtoomTobCC}></View>
                  {/* rating */}

                  <View style={styles.HeartContainer2}>
                    <Text style={styles.NameC}>
                      {User[0] !== undefined
                        ? User[0].BussinessDetails
                          ? User[0].BusinessName
                          : User[0].name
                        : null}
                    </Text>

                    <View style={styles.IconContainerCC2}>
                      <Icon
                        name="checkmark-circle"
                        size={20}
                        color={Colors.Primary}
                      />
                    </View>
                  </View>
                  <View style={styles.HeartContainer22}>
                    <Text style={styles.NameC2}>
                      {User[0] !== undefined ? User[0].location : null}
                    </Text>
                  </View>
                  <View style={styles.HeadingTextContainer45}>
                    <View style={styles.HeartContainer}>
                      <Icon name="star" size={20} color="gold" />
                    </View>
                    <Text style={styles.HeadingText5}>
                      {User[0] !== undefined ? User[0].reviews : null}
                    </Text>
                  </View>

                  <View style={styles.BtoomTobCC}></View>
                </View>
              </View>
              {/* topSction */}
              {/* BotmSction */}
              <View style={styles.bottomPrflHeader}>
                <Icon name="mail" size={30} color={Colors.Primary} />
                <Text style={styles.EmailText}>Email Verified</Text>
              </View>
              {/* BotmSction */}
            </View>
            {/* profileHeader */}

            <View style={styles.linebar} />
            {User[0].AccountType === 'Bussiness' && (
              <View style={styles.adminMode}>
                {/* call button */}
                <TouchableOpacity
                  onPress={() => {
                    let phoneNumber = +923042323386;
                    Linking.openURL(`tel:${phoneNumber}`);
                  }}
                  style={styles.adminButton}>
                  <Icon name="call" size={25} color="#ffff" />
                  <Text style={styles.numberadmin}>+{User[0].Phone}</Text>
                </TouchableOpacity>
                {/* call button */}

                {/* iconLocation CC */}
                <View style={styles.MainCCor}>
                  <View style={styles.IconCCR}>
                    <Icon name="location" size={25} color={Colors.Primary} />
                  </View>
                  <View style={styles.IconCCR2}>
                    <Text style={styles.IIICTxt}>{User[0].Address}</Text>
                  </View>
                </View>
                {/* iconLocation CC */}
                {/* iconLocation CC */}
                <View style={styles.MainCCor}>
                  <View style={styles.IconCCR}>
                    <Icon name="globe" size={25} color={Colors.Primary} />
                  </View>
                  <View style={styles.IconCCR2}>
                    <Text style={styles.IIICTxt}>{User[0].Website}</Text>
                  </View>
                </View>
                {/* iconLocation CC */}
                {/* iconLocation CC */}
                <View style={styles.MainCCor}>
                  <View style={styles.IconCCR}>
                    <Icon name="calendar" size={25} color={Colors.Primary} />
                  </View>
                  <View style={styles.IconCCR2}>
                    <Text style={styles.IIICTxt}>
                      {User[0].bussinessHoursFrom} - {User[0].bussinessHoursto}{' '}
                      & {User[0].bussinessdaysFrom} - {User[0].bussinessdaysto}{' '}
                    </Text>
                  </View>
                </View>
                {/* iconLocation CC */}
              </View>
            )}

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

            {activeField === 'Trading' && (
              <>
                {TradingD.length >= 1 ? (
                  <FlatList
                    data={TradingD}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item}) => (
                      <View
                        style={{
                          flex: 1,
                          margin: 5,
                          backgroundColor: '#fff',
                          height: h('25%'),
                        }}>
                        <ServiceItem
                          item={item}
                          onPress={() => {
                            navigation.navigate('PostScreen', {data: item});
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View style={styles.ViewMainFrame}>
                    <Text>NO DATA FOUND</Text>
                  </View>
                )}
              </>
            )}
            {activeField === 'Selling' && (
              <>
                {SellingD.length >= 1 ? (
                  <FlatList
                    data={SellingD}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item}) => (
                      <View
                        style={{
                          flex: 1,
                          margin: 5,
                          backgroundColor: '#fff',
                          height: h('25%'),
                        }}>
                        <ServiceItem
                          item={item}
                          onPress={() => {
                            navigation.navigate('PostScreen', {data: item});
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View style={styles.ViewMainFrame}>
                    <Text>NO DATA FOUND</Text>
                  </View>
                )}
              </>
            )}
            {activeField === 'Services' && (
              <>
                {ServiceD.length >= 1 ? (
                  <FlatList
                    data={ServiceD}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item}) => (
                      <View
                        style={{
                          flex: 1,
                          margin: 5,
                          backgroundColor: '#fff',
                          height: h('25%'),
                        }}>
                        <ServiceItem
                          item={item}
                          onPress={() => {
                            navigation.navigate('OtherUserPostDetails', {
                              data: item,
                            });
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View style={styles.ViewMainFrame}>
                    <Text>NO DATA FOUND</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default OtherUserProfile;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
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
  InviteText: {
    color: 'white',
    fontSize: h('2%'),
  },
  ProfileHeader: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('25%'),
  },
  bottomPrflHeader: {
    // backgroundColor: 'orange',
    width: '70%',
    height: '30%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  EmailText: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  LeftContainerPP: {
    // backgroundColor: 'green',
    width: '35%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RightContainerPP: {
    // backgroundColor: 'green',
    width: '65%',
    height: '100%',
    justifyContent: 'center',
  },
  ProfileContainer: {
    width: '100%',
    height: '20%',
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 100,
    height: 100,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
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
  NameC: {
    color: '#000',
    fontSize: h('2.5%'),
    marginRight: h('0.5%'),
  },
  NameC2: {
    color: Colors.Primary,
    fontSize: h('2%'),
    marginRight: h('0.5%'),
  },
  HeadingTextContainer45: {
    width: '18%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: h('1%'),
  },
  HeartContainer2: {
    width: '90%',
    // backgroundColor: 'orange',
    height: h('4%'),
    flexDirection: 'row',
    paddingLeft: h('1%'),
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  HeartContainer22: {
    width: '90%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    paddingLeft: h('1%'),
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  IconContainerCC2: {
    width: '10%',
    height: '80%',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BtoomTobCC: {
    // backgroundColor: 'red',
    width: '100%',
    height: '34%',
    flexDirection: 'row',
  },
  IconCC: {
    width: '20%',
    height: '80%',
    backgroundColor: 'purple',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  linebar: {
    width: '100%',
    borderWidth: h('0.1%'),
    borderColor: '#0002',
  },
  BtnContainer: {
    // backgroundColor: 'red',
    height: h('7%'),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: h('2%'),
    marginBottom: h('2%'),
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
  adminMode: {
    width: '90%',
    height: h('25%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: h('1.5%'),
  },
  adminButton: {
    width: '90%',
    height: h('7%'),
    backgroundColor: Colors.Primary,
    borderRadius: h('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: h('1%'),
  },
  numberadmin: {
    color: '#fff',
    fontSize: h('2%'),
    marginLeft: h('1%'),
  },
  MainCCor: {
    width: '100%',
    height: h('5%'),
    flexDirection: 'row',
    // backgroundColor: 'purple',
  },
  IconCCR: {
    width: '10%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconCCR2: {
    width: '80%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  IIICTxt: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  ViewMainFrame: {
    // backgroundColor: 'white',
    width: '100%',
    height: h('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
