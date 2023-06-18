import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ServiceItem from '../../Components/ServiceItem';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import LoadingScreen from '../../Components/LoadingScreen';
import {useFocusEffect} from '@react-navigation/native';

const FavouriteItemsScreen = ({navigation}) => {
  const [loading, setloading] = React.useState(true);
  const [favouriteSellingItems, setFavouriteSellingItems] = React.useState([]);
  const [favouriteServicesItems, setFavouriteServicesItems] = React.useState(
    [],
  );
  const [favouriteTradingItems, setFavouriteTradingItems] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Focussed FavouriteItemsScreen.js, running getFavourites');
      {
        (async () => getFavourites())();
      }
      return () => null;
    }, []),
  );
  const getFavourites = async () => {
    let currentUserId = auth().currentUser.uid;
    let _favouriteSellingItems = [];
    let _favouriteServicesItems = [];
    let _favouriteTradingItems = [];
    let promises = [];
    let users = [];
    await firestore()
      .collection('Favourite')
      .where('users', 'array-contains-any', [currentUserId])
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(async documentSnapshot => {
          users.push(documentSnapshot?.data()?.users);
          let favouriteItemId = documentSnapshot.data().productId;
          promises.push(
            firestore()
              .collection('Post')
              .doc(favouriteItemId)
              .get()
              .then(itemSnapshot => {
                if (itemSnapshot.exists) {
                  let itemData = {...itemSnapshot.data(), id: itemSnapshot.id};
                  let itemType = itemData.PostType;
                  if (itemType == 'Service') {
                    _favouriteServicesItems.push(itemData);
                  } else if (itemType == 'Selling') {
                    _favouriteSellingItems.push(itemData);
                  } else if (itemType == 'Trading') {
                    _favouriteTradingItems.push(itemData);
                  }
                }
              })
              .catch(err => {
                console.log('ERR CAUGHT');
                setloading(false);
              }),
          );
        });
        return promises;
      })
      .catch(overallError => {
        console.log('OVERALL ERROR CAUGHT');
        setloading(false);
      })
      .then(async _promises => {
        await Promise.all(_promises);
        setFavouriteServicesItems(_favouriteServicesItems);
        setFavouriteSellingItems(_favouriteSellingItems);
        setFavouriteTradingItems(_favouriteTradingItems);
        setloading(false);
      });
  };

  return (
    <KeyboardAvoidingScrollView>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.mainContinaer}>
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
              <Text style={styles.FontWork}>Favorites</Text>
            </View>
          </View>

          {favouriteSellingItems.length == 0 &&
          favouriteServicesItems.length == 0 &&
          favouriteTradingItems.length == 0 ? (
            <Text
              style={{
                ...styles.itemHeadings,
                height: h('100%'),
                marginTop: h('35%'),
              }}>
              No favourites found
            </Text>
          ) : (
            <>
              {favouriteSellingItems.length >= 1 ? (
                <>
                  <Text style={styles.itemHeadings}>Selling Items Liked </Text>
                  <FlatList
                    data={favouriteSellingItems}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item, index}) => {
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,
                              margin: 2,
                              backgroundColor: '#fff',
                              height: h('19%'),
                            }}>
                            <ServiceItem
                              item={item}
                              onPress={() => {
                                navigation.navigate('PostScreen', {data: item});
                              }}
                            />
                          </View>
                        </>
                      );
                    }}
                    keyExtractor={item => item.DocId}
                  />
                </>
              ) : (
                <>
                  {/* <Text style={styles.itemHeadings}>No selling item found in favourites</Text> */}
                  <View style={{height: 50}}></View>
                </>
              )}

              {favouriteServicesItems.length >= 1 ? (
                <>
                  <Text style={styles.itemHeadings}>Services Liked </Text>
                  <FlatList
                    data={favouriteServicesItems}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item}) => {
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,
                              margin: 2,
                              backgroundColor: '#fff',
                              height: h('19%'),
                            }}>
                            <ServiceItem
                              item={item}
                              onPress={() => {
                                navigation.navigate('PostScreen', {data: item});
                              }}
                            />
                          </View>
                        </>
                      );
                    }}
                    keyExtractor={item => item.DocId}
                  />
                </>
              ) : (
                <>
                  {/* <Text style={styles.itemHeadings}>No services item found in favourites</Text> */}
                  <View style={{height: 50}}></View>
                </>
              )}

              {favouriteTradingItems.length >= 1 ? (
                <>
                  <Text style={styles.itemHeadings}>Trading Items Liked </Text>
                  <FlatList
                    data={favouriteTradingItems}
                    contentContainerStyle={{paddingBottom: h('3%')}}
                    numColumns={3}
                    renderItem={({item}) => {
                      return (
                        <>
                          <View
                            style={{
                              flex: 1,
                              margin: 2,
                              backgroundColor: '#fff',
                              height: h('19%'),
                            }}>
                            <ServiceItem
                              item={item}
                              onPress={() => {
                                navigation.navigate('PostScreen', {data: item});
                              }}
                            />
                          </View>
                        </>
                      );
                    }}
                    keyExtractor={item => item.DocId}
                  />
                </>
              ) : (
                <>
                  {/* <Text style={styles.itemHeadings}>No trading item found in favourites</Text> */}
                  <View style={{height: 80}}></View>
                </>
              )}
            </>
          )}
        </View>
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default FavouriteItemsScreen;

const styles = StyleSheet.create({
  mainContinaer: {
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
  itemHeadings: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
});
