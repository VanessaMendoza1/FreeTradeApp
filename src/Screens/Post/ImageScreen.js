import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  FlatList,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../utils/icons';
import Colors from '../../utils/Colors';
import VideoPlayer from 'react-native-video-player';
import ReportPopup from '../../Components/ReportPopup';

import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {SliderBox} from 'react-native-image-slider-box';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageScreen = ({navigation, route}) => {
  // console.warn(route.params.data);
  console.warn(route.params.video);

  const images = [
    {
      url: route.params.data,
    },
  ];

  return (
    <View style={styles.MainContainer}>
      <View style={styles.Topheader}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.leftContainer}>
            <Icon name="arrow-back-outline" size={30} color="#ffff" />
          </TouchableOpacity>
          <View style={styles.leftContainer2}></View>
        </View>
      </View>
      {/* header Ender */}

      <View style={styles.ImgCc}>
        {route.params.video ? (
          <View style={{paddingTop: 250}}>
            <VideoPlayer
              video={{
                uri: route.params.data
                  ? route.params.data
                  : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              }}
              autoplay
              paused={false}
              controls={true}
              resizeMode={'contain'}
              thumbnail={{
                uri: 'https://i.picsum.photos/id/866/1600/900.jpg',
              }}
            />
          </View>
        ) : (
          <ImageViewer imageUrls={images} />
        )}

        {/* <Image source={{uri: route.params.data}} style={styles.ImgCRT} /> */}
      </View>
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  Topheader: {
    width: '100%',
    height: h('7%'),
    backgroundColor: Colors.Primary,
    position: 'relative',
    top: 0,
  },
  headerBox: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  leftContainer: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer2: {
    width: '55%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgCc: {
    width: '100%',
    height: h('80%'),
    // backgroundColor: 'red',
  },
  ImgCRT: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
