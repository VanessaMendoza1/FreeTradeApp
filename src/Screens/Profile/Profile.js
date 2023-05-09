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
import { formatPhoneNumber } from '../../utils/phoneNumberFormatter'

import {SubDataAdd} from '../../redux/subSlicer';

import moment from 'moment';

const Profile = ({navigation}) => {
  const [activeField, setActiveField] = React.useState('Services');
  const [mode, setmode] = React.useState(false);
  const [admin, setadmin] = React.useState(true);
  const MyData = useSelector(state => state.counter.data);
  // console.warn(MyData.UserID);
  const dispatch = useDispatch();
  const ServiceAllData = useSelector(state => state.mypost.MyServiceData);
  const SellingAllData = useSelector(state => state.mypost.MySellingData);
  const TradingAllData = useSelector(state => state.mypost.MyTradingData);

  const subdata = useSelector(state => state.sub.subdata);
  // console.warn(subdata[0].plan === 'Business');

  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (
            documentSnapshot.data().UserID === MyData.UserID &&
            documentSnapshot.data().status === false
          ) {
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
  };

  const MySubscriptionPackage = async () => {
    let data = [];
    await firestore()
      .collection('sub')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().userid === MyData.UserID) {
            const now = moment.utc();
            var end = JSON.parse(documentSnapshot.data().endDate);
            var days = now.diff(end, 'days');

            if (days >= 1) {
              DeletePost();
            } else {
              data.push(documentSnapshot.data());
            }
          }
        });
      });
    await dispatch(SubDataAdd(data));
  };

  const DeletePost = () => {
    firestore()
      .collection('sub')
      .doc(MyData.UserID)
      .delete()
      .then(() => {
        MySubscriptionPackage();
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      allmypost();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <ReportPopup
        visible={mode}
        onPress={() => {
          setmode(false);
        }}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* header */}
          <View style={styles.Header}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Setting');
              }}
              style={styles.LeftContainer}>
              <Icon name="settings" size={30} color="#ffff" />
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
            <View
              style={{
                flexDirection: 'row',
                height: '70%',
                // backgroundColor: 'green',
              }}>
              <View style={styles.LeftContainerPP}>
                <View style={styles.ProfileCC}>
                  <Image
                    style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                    source={{
                      uri: MyData.image
                        ? MyData.image
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
                    {/* {subdata.length > 0
                    ? subdata[0].plan === 'Business'
                      ? MyData.BusinessName
                      : MyData.name
                    : MyData.name} */}
                    {MyData.BussinessDetails === true
                      ? MyData.BusinessName
                      : MyData.name}
                  </Text>

                  <View style={styles.IconContainerCC2}>
                    <Icon
                      name="checkmark-circle"
                      size={20}
                      color={Colors.Primary}
                    />
                  </View>
                </View>
                <View style={styles.HeartContainer2}>
                  <Text style={styles.NameC2}>{MyData.location}</Text>
                </View>

                <View style={styles.HeadingTextContainer45}>
                  <View style={styles.HeartContainer}>
                    <Icon name="star" size={20} color="gold" />
                  </View>
                  <Text style={styles.HeadingText5}>{MyData.reviews}</Text>
                </View>

                <View style={styles.BtoomTobCC}>
                  
                  {/* <TouchableOpacity
                  onPress={() => {
                    setmode(true);
                  }}
                  style={styles.IconCC}>
                  {Icons.Report({
                    tintColor: Colors.Primary,
                  })}
                </TouchableOpacity> */}
                  {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Inbox');
                  }}
                  style={styles.IconCC}>
                  <Icon name="chatbox" size={30} color={Colors.Primary} />
                </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              height: 70
            }}>
              <View>
                <Icon name="mail" size={30} color={Colors.Primary}/>
              </View>
              <View style={styles.bottomPrflHeader}>
                <Text>Email Verified</Text>
              </View>
            </View>
          </View>
          {/* profileHeader */}

          <View style={styles.linebar} />

          {MyData.AccountType === 'Bussiness' && (
            <>
              <View style={styles.adminMode}>
                {/* call button */}
                <TouchableOpacity
                  onPress={() => {
                    let phoneNumber = +MyData.Phone ? MyData.Phone : 10000;
                    Linking.openURL(`tel:${phoneNumber}`);
                  }}
                  style={styles.adminButton}>
                  <Icon name="call" size={25} color="#ffff" />
                  <Text style={styles.numberadmin}>
                    {MyData.Phone
                      ? formatPhoneNumber(MyData.Phone)
                      : 'Add All Details from Setting'}
                  </Text>
                </TouchableOpacity>

                {/* call button */}

                {/* iconLocation CC */}
                {MyData.Address ? (
                  <View style={styles.MainCCor}>
                    <View style={styles.IconCCR}>
                      <Icon name="location" size={25} color={Colors.Primary} />
                    </View>
                    <View style={styles.IconCCR2}>
                      <Text style={styles.IIICTxt}>
                        {MyData.Address ? MyData.Address : 'Add from Settings'}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* iconLocation CC */}
                {/* iconLocation CC */}
                {MyData.Website ? (
                  <View style={styles.MainCCor}>
                    <View style={styles.IconCCR}>
                      <Icon name="globe" size={25} color={Colors.Primary} />
                    </View>
                    <View style={styles.IconCCR2}>
                      <Text style={styles.IIICTxt}>
                        {MyData.Website ? MyData.Website : 'Add from Setting'}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* iconLocation CC */}
                {/* iconLocation CC */}

                {MyData.bussinessHoursFrom &&
                MyData.bussinessHoursto &&
                MyData.bussinessdaysFrom &&
                MyData.bussinessdaysto ? (
                  <View style={{...styles.MainCCor, height: h('10%')}}>
                    <View style={{...styles.IconCCR, paddingBottom: 15}}>
                      <Icon name="calendar" size={25} color={Colors.Primary} />
                    </View>
                    <View style={styles.IconCCR2}>
                      <Text style={styles.IIICTxt}>
                        {MyData.bussinessHoursFrom
                          ? MyData.bussinessHoursFrom
                          : 'Add from Seeting'}
                        -{' '}
                        {MyData.bussinessHoursto
                          ? MyData.bussinessHoursto
                          : 'Add from Seeting'}{' '}
                        {'\n'}
                        {MyData.bussinessdaysFrom
                          ? MyData.bussinessdaysFrom
                          : 'Add from Seeting'}{' '}
                        -{' '}
                        {MyData.bussinessdaysto
                          ? MyData.bussinessdaysto
                          : 'Add from Seeting'}{' '}
                        {' '}
                        {'\n'}
                        {MyData.closedDays
                          ? "Closed: " + MyData.closedDays
                          : 'Add from Seeting'}{' '}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* iconLocation CC */}
              </View>
            </>
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
              {TradingAllData.length >= 1 ? (
                <FlatList
                  data={TradingAllData}
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
                          navigation.navigate('UserPost', {data: item});
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
              {SellingAllData.length >= 1 ? (
                <FlatList
                  data={SellingAllData}
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
                          navigation.navigate('UserPost', {data: item});
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
              {ServiceAllData.length >= 1 ? (
                <FlatList
                  data={ServiceAllData}
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
                          navigation.navigate('UserPost', {data: item});
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
    </>
  );
};

export default Profile;

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
    // flexDirection: 'row',
  },
  LeftContainerPP: {
    // backgroundColor: 'green',
    width: '35%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 85,
    height: 85,
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
    height: h('2.5%'),
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
    // backgroundColor: 'purple',
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
    marginTop: h('4%'),
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
