import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import Icons from '../../utils/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataInsert} from '../../redux/counterSlice';
import {useSelector, useDispatch} from 'react-redux';

const Setting = ({navigation}) => {
  const dispatch = useDispatch();
  const [isBusinessAccount, setIsBusinessAccount] = React.useState(false);
  // const [ loading, setloading ] = React.useState(false)
  React.useEffect(() => {
    isUserHavingBussinessSubscription();
    // setIsBusinessAccount(true)
  }, []);
  const MyData = useSelector(state => state.counter.data);
  console.warn(MyData.name);

  const subdata = useSelector(state => state.sub.subdata);
  // console.warn(subdata[0].plan === 'Bussiness');

  const clearAll = async () => {
    try {
      await dispatch(DataInsert({}));
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (e) {
      // clear error
    }

    console.log('Done.');
  };

  const isUserHavingBussinessSubscription = () => {
    console.log('TRIGGERED');
    let currentUserId = auth().currentUser.uid;
    firestore()
      .collection('Users')
      .doc(currentUserId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          let userData = documentSnapshot.data();
          console.log({userData});
          if (userData.AccountType == 'Bussiness') {
            setIsBusinessAccount(true);
          }
        }
      })
      .catch(err => {
        // setloading(false);
        console.warn(err);
      });
  };

  // console.log({IMAGE: MyData.image})

  return (
    <ScrollView>
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
            <Text style={styles.FontWork}>Setting</Text>
          </View>
        </View>
        {/* header */}

        {/* profile Container */}
        <View style={styles.ProfileContainer}>
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
          <Text style={styles.nameText}>
            {subdata.length > 0
              ? subdata[0].plan === 'Bussiness'
                ? MyData.BusinessName
                : MyData.name
              : MyData.name}
          </Text>
        </View>
        {/* profile Containr */}
        <View style={styles.mainContainerSetting}>
          {/* <SettingItem
            onPress={() => {
              navigation.navigate('VerifyNumber');
            }}
            text={'Verify Account'}>
            {Icons.Verify({
              tintColor: Colors.Primary,
            })}
          </SettingItem> */}

          {subdata.length > 0 && subdata[0].plan === 'Bussiness' ? (
            <SettingItem
              onPress={() => {
                navigation.navigate('BussinessAccountEdits');
              }}
              text={'Business Account edits'}>
              {Icons.Bussiness({
                tintColor: Colors.Primary,
              })}
            </SettingItem>
          ) : (
            <SettingItem
              onPress={() => {
                navigation.navigate('EditAccount');
              }}
              text={'Edit Account'}>
              {Icons.Pencil({
                tintColor: Colors.Primary,
              })}
            </SettingItem>
          )}

          <SettingItem
            onPress={() => {
              navigation.navigate('LocationPage');
            }}
            text={'Add My Location'}>
            {Icons.LocationPinIcon({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            onPress={() => {
              navigation.navigate('ToggleNotifications');
            }}
            text={'Switch On/Off Notifications'}>
            {Icons.NotificationIcon({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            onPress={() => {
              navigation.navigate('FavouriteItems');
            }}
            text={'Favorites'}>
            {Icons.HeartIcon({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            onPress={() => {
              navigation.navigate('ContactUs');
            }}
            text={'Contact Us'}>
            {Icons.ContactUs({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            text={'About Us'}
            onPress={() => {
              navigation.navigate('AboutUs');
            }}>
            {Icons.Terms({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            text={'Privacy Policy'}
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}>
            {Icons.Terms({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            text={'Terms and Conditions'}
            onPress={() => {
              navigation.navigate('TermsAndConditions');
            }}>
            {Icons.Info({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          <SettingItem
            onPress={() => {
              navigation.navigate('SubscriptionPage');
            }}
            text={'Subscription'}>
            {Icons.Subscribe({
              tintColor: Colors.Primary,
            })}
          </SettingItem>

          {/* <SettingItem
            onPress={() => {
              navigation.navigate('CancelSubscriptionPage');
            }}
            text={'Cancel Subscription'}>
            {Icons.CancelSubscriptionIcon({
              tintColor: Colors.Primary,
            })}
          </SettingItem> */}

          <SettingItem
            onPress={() => {
              clearAll();
            }}
            text={'Logout'}>
            {Icons.Logout({
              tintColor: Colors.Primary,
            })}
          </SettingItem>
        </View>
      </View>
    </ScrollView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 100,
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
  ProfileContainer: {
    width: '100%',
    height: h('20%'),
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 120,
    height: 120,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  nameText: {
    color: '#000',
    fontSize: h('2.4%'),
  },
  mainContainerSetting: {
    width: '90%',
    height: '100%',
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
});
