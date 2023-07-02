import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import reactotron from 'reactotron-react-native';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
const Review = ({navigation, route}) => {
  const [currentValue, setCurrentValue] = React.useState(0);
  const stars = Array(5).fill(0);
  const [Reliable, setReliable] = React.useState(false);
  const [Friendly, setFriendly] = React.useState(false);
  const [Ontime, setOntime] = React.useState(false);
  const [Communicative, setCommunicative] = React.useState(false);
  const [Good, setGood] = React.useState(false);
  const [user, setUser] = useState([]);
  const focused = useIsFocused();
  //   const [activeField, setActiveField] = React.useState(false);
  //   const [activeField, setActiveField] = React.useState(false);
  useEffect(() => {
    console.log('data', route?.params?.data);
    fetchBuyerDetails();
  }, [focused]);
  const fetchBuyerDetails = async () => {
    const userData = [];
    await firestore()
      .collection('Users')
      .doc(route?.params?.data)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUser(documentSnapshot.data());
          userData.push(documentSnapshot.data());
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  const handleClick = value => {
    setCurrentValue(value);
  };

  return (
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
          <Text style={styles.FontWork}>Reviews</Text>
        </View>
      </View>
      {/* header */}

      <View style={styles.ProfileContainer}>
        <View style={styles.ProfileCC}>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            source={{
              uri: user?.image
                ? user?.image
                : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            }}
          />
        </View>
      </View>
      {/* abc */}
      <Text style={styles.nameText}>{route?.params?.data?.name}</Text>
      <Text style={styles.nameText2}>How was your expirence?</Text>

      <View style={styles.starContainer}>
        {stars?.map((_, index) => {
          return (
            <TouchableOpacity
              onPress={() => handleClick(index + 1)}
              key={index}>
              <Icon
                name="star"
                size={30}
                color={currentValue > index ? Colors.Primary : '#0008'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* button Containers */}
      <View style={styles.BtnContainer}>
        {Reliable ? (
          <TouchableOpacity
            onPress={() => {
              setReliable(false);
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Reliable</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setReliable(true);
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Reliable</Text>
          </TouchableOpacity>
        )}
        {Friendly ? (
          <TouchableOpacity
            onPress={() => {
              setFriendly(false);
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Friendly</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setFriendly(true);
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Friendly</Text>
          </TouchableOpacity>
        )}
        {Ontime ? (
          <TouchableOpacity
            onPress={() => {
              setOntime(false);
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>On time</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setOntime(true);
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>On time</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* button Containers */}
      <View style={styles.BtnContainer2}>
        {Communicative ? (
          <TouchableOpacity
            onPress={() => {
              setCommunicative(false);
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Communicative</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setCommunicative(true);
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Communicative</Text>
          </TouchableOpacity>
        )}
        {Good ? (
          <TouchableOpacity
            onPress={() => {
              setGood(false);
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Good</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setGood(true);
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Good</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* button Containers */}

      <View style={styles.Btncc}>
        <Appbutton
          onPress={() => {
            alert('Review Submited');
            navigation.navigate('Home');
          }}
          text={'Submit'}
        />
      </View>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
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
    height: '20%',
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
  nameText2: {
    color: '#000',
    fontSize: h('2.4%'),
    marginTop: h('6%'),
  },
  starContainer: {
    width: '50%',
    height: '5%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: h('2%'),
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
  },
  BtnContainer2: {
    // backgroundColor: 'red',
    height: h('7%'),
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Btn: {
    width: w('29%'),
    height: '75%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn2: {
    width: w('29%'),
    height: '75%',
    // backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  Txt1: {
    color: '#fff',
    fontSize: h('1.7%'),
  },
  Txt2: {
    color: Colors.Primary,
    fontSize: h('1.7%'),
  },
  Btncc: {
    width: '100%',
    height: '44%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
