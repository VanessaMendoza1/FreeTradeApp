import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';

import Appbutton from '../../Components/Appbutton';

const Posted = ({navigation, route}) => {
  const [oldData, setoldData] = React.useState(route.params);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'You can now Buy This at FreeTrade on Google & Apple Store',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.MainContainer}>
      {/* header */}
      <View style={styles.Header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MakePost');
          }}
          style={styles.LeftContainer}>
          <Icon name="arrow-back-outline" size={30} color="#ffff" />
        </TouchableOpacity>
        <View style={styles.MiddleContainer}>
          <Text style={styles.FontWork}>Posted</Text>
        </View>
      </View>
      {/* header */}

      {/* All Components */}
      <View style={styles.maincomponents}>
        <View style={styles.LeftMContainer}>
          <View style={styles.ProfileContainer}>
            <View style={styles.ProfileCC}>
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri:
                    route.params.images[0] !== ''
                      ? route.params.images[0]
                      : 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80',
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.RightMContainer}>
          <View style={styles.RatingContianer}>
            <Text style={styles.NameC}>{route.params.title}</Text>
            <View style={styles.HeadingTextContainer45}>
              <Text style={styles.HeadingText5}>{route.params.condition}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.linebar} />
      {/* All Components */}

      <View style={styles.MainContaienrCC}>
        <Text style={styles.PromoteCC}>Promote to Sell/Trade faster</Text>
        <Appbutton
          text={'Start Promotion'}
          onPress={() => {
            navigation.navigate('PostPromotion', {data: oldData});
          }}
        />
        <TouchableOpacity onPress={onShare} style={styles.ShareButton}>
          <Text style={styles.ShareColor}>Share to get more exposure</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MakePost');
          }}
          style={styles.ShareButton2}>
          <View style={styles.imggccc}>
            <Image
              style={{width: '90%', height: '90%', resizeMode: 'contain'}}
              source={require('../../../assets/plus.png')}
            />
          </View>
          <Text style={styles.ShareColor2}>Post another item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Posted;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
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
  maincomponents: {
    width: '100%',
    height: '15%',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  LeftMContainer: {
    width: '24%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: h('1.5%'),
  },
  RightMContainer: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
    paddingLeft: h('1.3%'),
  },
  ProfileContainer: {
    width: '22%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 80,
    height: 80,
    // borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  RatingContianer: {
    width: '100%',
    height: '100%',

    justifyContent: 'center',
  },

  NameC: {
    color: '#000',
    fontSize: h('2.5%'),
  },
  HeadingText5: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  HeadingTextContainer45: {
    width: '30%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeartContainer: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linebar: {
    width: '100%',
    borderWidth: h('0.2%'),
    borderColor: '#0002',
  },
  MainContaienrCC: {
    width: '90%',
    height: h('50%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: h('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ShareButton: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h('1%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  ShareButton2: {
    width: '90%',
    // backgroundColor: 'red',
    height: h('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h('1%'),
    borderColor: '#0009',
    borderWidth: h('0.2%'),
    flexDirection: 'row',
  },
  ShareColor: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  ShareColor2: {
    color: '#0009',
    fontSize: h('2%'),
  },
  imggccc: {
    width: '10%',
    height: '50%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PromoteCC: {
    color: '#0009',
    fontSize: h('2.5%'),
    marginBottom: h('2%'),
  },
});
