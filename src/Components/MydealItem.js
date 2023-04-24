import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';

const MydealItem = ({iconName, iconColor, Property, onPress, data = ''}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.MainContainer}>
      <View style={styles.ProfileContainer}>
        <View style={styles.ProfileCC}>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            source={{
              uri:
                data !== '' && data?.ItemImage !== ''
                  ? data.ItemImage
                  : 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80',
            }}
          />
        </View>
      </View>

      <View style={styles.RatingContianer}>
        <Text style={styles.NameC}>
          {data.ItemName ? data.ItemName : 'Nothing'}
        </Text>
        {Property === 'Sold' && (
          <View style={styles.HeadingTextContainer45}>
            <Text style={styles.HeadingText4}>Sold</Text>
          </View>
        )}
        {Property === 'Bought' && (
          <View style={styles.HeadingTextContainer45}>
            <Text style={styles.HeadingText5}>Bought</Text>
            <View style={styles.borderCC} />
            <Text style={styles.HeadingText5}>Review</Text>
          </View>
        )}
        {Property === 'Traded' && (
          <View style={styles.HeadingTextContainer45}>
            <Text style={styles.HeadingText5}>Traded</Text>
            <View style={styles.borderCC} />
            <Text style={styles.HeadingText5}>Review</Text>
          </View>
        )}
      </View>
      <View style={styles.RatingLastContianer}>
        <Icon name={iconName} size={30} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default MydealItem;

const styles = StyleSheet.create({
  MainContainer: {
    width: '100%',
    height: h('15%'),
    // backgroundColor: 'red',
    borderColor: '#0003',
    borderWidth: h('0.2%'),
    flexDirection: 'row',
  },
  ProfileContainer: {
    width: '23%',
    height: '100%',
    // backgroundColor: 'red',
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
    width: '60%',
    height: '100%',

    justifyContent: 'center',
    // backgroundColor: 'green',
    paddingLeft: h('1.4%'),
  },
  RatingLastContianer: {
    width: '15%',
    height: '100%',

    justifyContent: 'center',
    // backgroundColor: 'purple',
    alignItems: 'center',
  },

  NameC: {
    color: '#000',
    fontSize: h('2.5%'),
  },
  HeadingTextContainer45: {
    width: '45%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderCC: {
    borderLeftColor: '#0006',
    borderLeftWidth: h('0.2%'),
    width: h('0.5%'),
    height: '50%',
  },
  HeadingText5: {
    color: Colors.Primary,
  },
});
