import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {
  PostAdd,
  TradingAdd,
  SellingAdd,
  ServiceAdd,
} from '../../redux/postSlice';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Appbutton from '../../Components/Appbutton';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import LoadingScreen from '../../Components/LoadingScreen';
import {DataInsert} from '../../redux/counterSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationPage = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const [Location, setLocation] = React.useState('');
  const [PlaceId, setPlaceId] = React.useState('');
  const [Cods, setCods] = React.useState([]);
  const [latitude, setlatitude] = React.useState([]);
  const [longitude, setlongitude] = React.useState([]);
  const MyData = useSelector(state => state.counter.data);

  const [TradingFlatData, setTradingFlatData] = React.useState([]);
  const [SellingFlatData, setSellingFlatData] = React.useState([]);

  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().status === false) {
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

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));
  };

  useEffect(() => {
    allmypost();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.mainContainer}>
          {/* header */}
          <View style={styles.Header}>
            <View style={styles.LeftContainer}>
              {/* <Icon name="arrow-back-outline" size={30} color="#ffff" /> */}
            </View>
            <View style={styles.MiddleContainer}>
              <Text style={styles.FontWork}>Set Location</Text>
            </View>
          </View>
          {/* header */}

          {/* imges */}
          {/* <View style={styles.ImgeContainer}>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            source={require('../../../assets/locationBG.png')}
          />
        </View> */}
          {/* imges */}

          <Text style={styles.TxtGG}>Enter your Location and Get Started</Text>

          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            fetchDetails={true}
            GooglePlacesDetailsQuery={{fields: 'geometry'}}
            onPress={(data, details = null) => {
              const l = data.description;
              setLocation(l);
              const Locationss = details.geometry.location;

              setlatitude(Locationss.lat);
              setlongitude(Locationss.lng);
            }}
            styles={{
              textInputContainer: {
                width: '90%',
                alignSelf: 'center',
                // borderWidth: h('0.2%'),
                backgroundColor: 'white',

                // borderColor: Colors.Primary,
              },
              textInput: {
                height: '100%',
                color: '#5d5d5d',
                fontSize: 16,
                width: '100%',
                alignSelf: 'center',
              },

              listView: {
                width: '90%',
                alignSelf: 'center',
                borderColor: Colors.Primary,
              },
            }}
            debounce={100}
            // currentLocation
            // currentLocationLabel={'GET NOW'}
            query={{
              key: 'AIzaSyD0Pd70F1RYfHsMWojsqozPRqq8q-_yswo',
              language: 'en',
            }}
          />

          <View style={styles.AppBtn}>
            <Appbutton
              onPress={async () => {
                setloading(true);
                firestore()
                  .collection('Users')
                  .doc(MyData.UserID)
                  .update({
                    location: Location,
                    latitude: latitude,
                    longitude: longitude,
                  })
                  .then(async () => {
                    let userData = [];
                    await firestore()
                      .collection('Users')
                      .doc(MyData.UserID)
                      .get()
                      .then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                          userData.push(documentSnapshot.data());
                        }
                      })
                      .catch(err => {
                        setloading(false);
                        console.warn(err);
                      });

                    await dispatch(DataInsert(userData[0]));

                    try {
                      await AsyncStorage.setItem(
                        '@user',
                        JSON.stringify(userData[0]),
                      );

                      setloading(false);
                      navigation.navigate('TabNavigation');
                    } catch (e) {
                      // saving error
                      console.warn(e);
                      setloading(false);
                      navigation.navigate('TabNavigation');
                    }
                  })
                  .catch(err => {
                    setloading(false);
                    console.log(err);
                  });
              }}
              text={'Submit'}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: h('95%'),
    backgroundColor: '#fff7',
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
  ImgeContainer: {
    width: '40%',
    height: h('20%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: h('2%'),
    marginBottom: h('2%'),
  },
  TxtGG: {
    alignSelf: 'center',
    color: Colors.Primary,
    fontSize: h('2.3%'),
    marginBottom: h('2%'),
    fontWeight: 'bold',
  },
  AppBtn: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
});
