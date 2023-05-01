import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../../Components/AppInput';
import LoadingScreen from '../../Components/LoadingScreen';
import {DataInsert} from '../../redux/counterSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  PostAdd,
  TradingAdd,
  SellingAdd,
  ServiceAdd,
} from '../../redux/postSlice';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Appbutton from '../../Components/Appbutton';
import Distance from './Distence';
import {getDistance, getPreciseDistance} from 'geolib';
import Slider from '@react-native-community/slider';

const LocationScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const [Location, setLocation] = React.useState('');
  const [currentLocation, setCurrentLocation] = React.useState('');
  const [PlaceId, setPlaceId] = React.useState('');
  const [Cods, setCods] = React.useState([]);
  const [latitude, setlatitude] = React.useState([]);
  const [longitude, setlongitude] = React.useState([]);
  const [distance, setDistance] = React.useState(10)
  const [currentDistance, setCurrentDistance] = React.useState("")
  const MyData = useSelector(state => state.counter.data);

  const [slider, setSlider] = React.useState(0.2);
  const [MILES, setMILES] = React.useState(parseInt(0.3 * 100));
  const UserData = useSelector(state => state.counter.data);

  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];

    const lat1 = UserData.latitude; // Latitude of first coordinate
    const lon1 = UserData.longitude; // Longitude of first coordinate

    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const lat2 = documentSnapshot.data().user.latitude; // Latitude of second coordinate
          const lon2 = documentSnapshot.data().user.longitude;
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
        });
      })
      .catch((err) => {
        console.log("BAD DATA")
        console.log(err)
      })

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));
    navigation.navigate('TabNavigation');
  };


  React.useEffect(() => {
    try{
      firestore()
      .collection('Users')
      .doc(MyData.UserID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          let userData = documentSnapshot.data();
          let currentLocationFilter = userData.LocationFilter
          setCurrentLocation(currentLocationFilter.location)
          setCurrentDistance(currentLocationFilter.LocalDistance)
          setlatitude(currentLocationFilter.latitude)
          setlongitude(currentLocationFilter.longitude)
        }
        setloading(false)
      })
      .catch(err => {
        setloading(false);
        console.warn(err);
      })
    } catch (_err){
      console.log(_err)
    }
  }, [])

  // React.useEffect(() => {
  //   // allmypost();
  //   // calculateDistance();
  // }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
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
              <Text style={styles.FontWork}>Location</Text>
            </View>
          </View>
          {/* header */}
          {/* location */}
          
          <Text style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
          }}>
            Current Distance: {currentDistance} miles
          </Text>
          <Text style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
          }}>
            Current Location: {currentLocation}
          </Text>
          
          <Text style={{
            marginTop: 40,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold"
          }}>
            Set New Location And Distance
          </Text>
          <Text style={{
            marginTop: 40,
            textAlign: "center",
            fontSize: 20,
          }}>
            New Distance: {distance} miles
          </Text>
          <Slider
            style={{width: "94%", height: 100, alignSelf: "center"}}
            step={1}
            minimumValue={10}
            maximumValue={100}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onValueChange={(value) => setDistance(value)}
          />

          <GooglePlacesAutocomplete
            placeholder="Enter New Location"
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
                borderBottomWidth: h('0.2%'),
                backgroundColor: 'white',
                marginTop: h('2%'),

                borderBottomColor: Colors.Primary,
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
                try{
                  firestore()
                  .collection('Users')
                  .doc(MyData.UserID)
                  .update({
                    LocationFilter:{
                      LocalDistance: distance, 
                      location: Location == "" ? currentLocation : Location,
                      latitude: latitude,
                      longitude: longitude,
                    }
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

                    allmypost();
                    setloading(false)
                  })
                  .catch(err => {
                    setloading(false);
                    console.log("ERROR")
                    console.log(err);
                  });
                } catch (ERROR){
                  console.log("ERROR1")
                  console.log(ERROR)
                }
              }}
              text={'Submit'}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  Header: {
    width: '100%',
    height: h('10%'),
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
  SLiderContainer: {
    width: '85%',
    // backgroundColor: 'red',
    height: h('8%'),
    alignSelf: 'center',
    marginTop: h('2%'),
  },
  Slideee: {
    width: '80%',
    // backgroundColor: 'red',
    height: '100%',
    marginBottom: h('1%'),
  },
  sliderbottm: {
    width: '100%',
    // backgroundColor: 'red',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  RedContainer: {
    color: '#0008',
    fontSize: h('2.3%'),
    fontWeight: 'bold',
  },
  MileText: {
    color: '#0008',
    fontSize: h('2.3%'),
  },
  TxtBg: {
    width: '90%',
    height: '70%',

    borderBottomColor: '#0007',
    borderBottomWidth: h('0.2%'),
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  InputContainer2: {
    width: '85%',
    height: '100%',
    // backgroundColor: 'red',

    color: '#000',
    fontSize: h('2%'),
  },
  AppBtn: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

{
  /* location */
}
{
  /* <View style={styles.SLiderContainer}>
            <Text style={styles.RedContainer}>Distance</Text>
            <View style={styles.sliderbottm}>
              <View style={styles.Slideee}>
                <Slider
                  value={MILES}
                  maximumTrackTintColor={Colors.Primary}
                  minimumTrackTintColor={Colors.Primary}
                  thumbTintColor={Colors.Primary}
                  onValueChange={value => {
                    if (value * 100 === 100) {
                      setMILES(150);
                    }
                  }}
                />
              </View>
              <Text style={styles.MileText}>{MILES} miles</Text>
            </View>
          </View> */
}
