import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';

const LoadingScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <ActivityIndicator size="large" color="#5127E4" />
      {/* <Lottie source={require('./animation.json')} autoPlay loop /> */}
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 100000,
  },
});
