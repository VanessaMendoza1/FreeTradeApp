import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';
import {priceFormatter} from '../utils/helpers/helperFunctions';

const ServiceItem = ({onPress, item}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.ServiceItemContainer}>
      <ImageBackground
        style={styles.img}
        source={{
          uri: item.images[0]
            ? item.images[0]
            : 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80',
        }}>
        {/* overlay */}
        <View style={styles.imgCC}>
          <View style={styles.BottomContainer}>
            <Text style={styles.BPTag}>{item.Title}</Text>
            {item?.promoted && (
              <Text style={styles.BPPromoted}>{item?.promoted}</Text>
            )}
            {item.Discount !== 0 ? (
              <View style={styles.boxview}>
                <Text style={styles.BPTag22}>
                  {item.Price !== '' ? priceFormatter(item.Price) : null}
                </Text>
                <Text style={styles.BPTag3}>
                  {priceFormatter(item.Discount)}
                </Text>
              </View>
            ) : (
              <Text style={styles.BPTag2}>
                {item.Price !== '' ? priceFormatter(item.Price) : null}
              </Text>
            )}
          </View>
        </View>
        {/* overlay */}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ServiceItem;

const styles = StyleSheet.create({
  ServiceItemContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0003',
    alignSelf: 'center',
    // borderWidth: h('0.2%'),
    // borderColor: Colors.Primary,
  },
  ImgOverlay: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',

    backgroundColor: '#000',
  },
  imgCC: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0002',
    justifyContent: 'flex-end',
  },
  OverlayContent: {
    width: '100%',
    height: '20%',
    // backgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: h('1%'),
  },
  Profile: {
    width: 30,
    height: 30,
    // backgroundColor: 'green',
    borderRadius: h('10000%'),
    overflow: 'hidden',
  },
  BottomContainer: {
    width: '100%',
    height: '44%',
    // backgroundColor: 'red',
    paddingLeft: 5,
  },
  BPTag: {
    color: '#fff',
    fontSize: h('1.5%'),
    fontWeight: 'bold',
  },
  BPPromoted: {
    color: 'red',
    fontSize: h('1.5%'),
    fontWeight: 'bold',
  },
  BPTag2: {
    color: '#fff',
    fontSize: h('1.7%'),
  },
  BPTag22: {
    color: '#fff',
    fontSize: h('1.7%'),
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  BPTag3: {
    color: 'red',
    fontSize: h('2%'),
    fontWeight: 'bold',
  },
  boxview: {
    width: '80%',
    height: '40%',
    // backgroundColor: 'red',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
});
