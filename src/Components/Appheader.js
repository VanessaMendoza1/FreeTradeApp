import {TextInput, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Appheader = ({onSearch, onMessage, onNotification, noti}) => {
  console.warn(noti);
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => {
          alert('No Categories added');
        }}
        style={styles.ViewCOntaier}>
        <Icon name="menu-outline" size={50} color="#ffff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMessage} style={styles.ViewCOntaier2}>
        <Icon name="chatbox" size={30} color="#ffff" />
      </TouchableOpacity>

      <View style={styles.ViewCOntaier3}>
        <View style={styles.Searchbox}>
        <View style={styles.leftContainer}>
          <Icon name="search" size={30} color={Colors.Primary} />
        </View>
        <TextInput
          placeholder="Sell/Trade"
          onChangeText={text => onSearch(text)}
          style={styles.Txtinput}
          placeholderTextColor={Colors.Primary}
        />
        </View>
      </View>

      {/* <TouchableOpacity onPress={onSearch} style={styles.ViewCOntaier3}>
        <View style={styles.Searchbox}>
          <View style={styles.leftContainer}>
            <Icon name="search" size={30} color={Colors.Primary} />
          </View>
          <View style={styles.leftContainer2}>
            <Text style={styles.SearchText}>Sell/Trade</Text>
          </View>
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onNotification} style={styles.ViewCOntaier}>
        {noti ? (
          <>
            <Icon name="notifications" size={30} color="#fff" />
            <View style={styles.Elips}>
              <Icon name="ellipse" size={15} color="red" />
            </View>
          </>
        ) : (
          <Icon name="notifications" size={30} color="#ffff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Appheader;

const styles = StyleSheet.create({
  Txtinput: {
    width: '90%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    fontSize: h('2%'),
    color: '#0008',
    // alignItems: 'center',
  },
  HeaderContainer: {
    width: '100%',
    height: h('9%'),
    backgroundColor: Colors.Primary,
    flexDirection: 'row',
  },
  ViewCOntaier: {
    width: '17%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewCOntaier2: {
    width: '17%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewCOntaier3: {
    width: '50%',
    height: '100%',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Searchbox: {
    backgroundColor: 'white',
    width: '100%',
    height: '70%',
    borderRadius: h('0.5%'),
    flexDirection: 'row',
  },
  leftContainer: {
    width: '20%',
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer2: {
    width: '76%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  SearchText: {
    // color: Colors.Primary,
    color: 'red',
    fontSize: h('2%'),
  },
  Elips: {
    position: 'absolute',
    top: '30%',
    right: '30%',
  },
});
