import {TextInput, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Appheader = ({isHavingNewMessages, setSearchValue, onSearch, onMessage, onNotification, noti, showCategoryAndSubCategory, setShowCategoryAndSubCategory, setShowItemsFromCategoryAndSubCategory}) => {

  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => {
          if (showCategoryAndSubCategory) {
            setShowCategoryAndSubCategory(false);
            setShowItemsFromCategoryAndSubCategory(false);
          } else {
            setShowCategoryAndSubCategory(true);
            setShowItemsFromCategoryAndSubCategory(false);
          }
        }}
        style={styles.ViewCOntaier}>
        <Icon name="menu-outline" size={30} color="#ffff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMessage} style={styles.ViewCOntaier2}>
        <Icon name="chatbox" size={25} color="#ffff" />
        {isHavingNewMessages && (
          <View
            style={{
              width: 13,
              height: 13,
              backgroundColor: 'red',
              position: 'absolute',
              bottom: 22,
              right: 19,
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 1,
            }}></View>
        )}
      </TouchableOpacity>

      <View style={styles.ViewCOntaier3}>
        <View style={styles.Searchbox}>
          <View style={styles.leftContainer}>
            <Icon name="search" size={25} color={Colors.Primary} />
          </View>
          <TextInput
            placeholder="Service/Sell/Trade"
            onChangeText={text => {
              onSearch(text);
              setSearchValue(text);
            }}
            returnKeyType="search"
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
            <Icon name="notifications" size={25} color="#fff" />
            <View
              style={{
                width: 13,
                height: 13,
                backgroundColor: 'red',
                position: 'absolute',
                bottom: 20,
                right: 18,
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
              }}></View>
          </>
        ) : (
          <Icon name="notifications" size={25} color="#ffff" />
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
