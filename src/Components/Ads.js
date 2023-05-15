import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import { formatPhoneNumber } from '../utils/phoneNumberFormatter'
import Colors from '../utils/Colors';

let img =
  'https://images.unsplash.com/photo-1659095141570-be8b9aff59ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';

const Ads = ({data, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.MainContainer}>
      <View style={styles.ImageContainer}>
        <Image
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          source={{uri: data.AdGraphicLink ? data.AdGraphicLink : img}}
        />
      </View>
      {(data.BussinessName) && (
        <>
          <Text style={styles.MainText}>{data.BussinessName}</Text>
        </>
      )}
      {data.title && (
        <Text style={styles.MainText}>{data.title}</Text>
      )}
      {data.TagLine && (
        <Text style={{...styles.MainText3, color: "red"}}>{data.TagLine}</Text>
      )}

      {(data.Adtype == "Business") && (
        <>
          <Text style={styles.MainText2}>{data.user.Address}</Text>
          {(data.user?.Phone !== undefined) && (
            <Text style={styles.MainText2}>Call: {formatPhoneNumber(data.user.Phone)}</Text>
          )}
        </>
      )}

      <Text style={styles.MainText3}>{data.user.location}</Text>
    </TouchableOpacity>
  );
};

export default Ads;

const styles = StyleSheet.create({
  MainContainer: {
    width: w('36%'),
    height: '100%',
    // backgroundColor: 'white',
    padding: 5,
    backgroundColor: '#0002',
    // margin: 0.5,
    borderRadius: h('1%'),
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center',

    // borderColor: '#0008',
    // borderWidth: h('0.2%'),
  },
  ImageContainer: {
    width: '100%',
    height: '55%',

    backgroundColor: '#0007',
  },
  MainText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0
    // paddingLeft: h('0.6%'),
  },
  MainText2: {
    color: '#0008',
    fontSize: h('1.4%'),

    // paddingLeft: h('0.6%'),
  },
  MainText3: {
    color: '#000',
    fontSize: h('1.5%'),

    // paddingLeft: h('0.6%'),
  },
});
