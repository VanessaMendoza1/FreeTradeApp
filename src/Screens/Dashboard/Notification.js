import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationHead from '../../Components/NotificationHead';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {areNotificationsHidden} from '../../utils/appConfigurations';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import reactotron from 'reactotron-react-native';
import LoadingScreen from '../../Components/LoadingScreen';
import moment from 'moment';
const Notification = ({navigation}) => {
  const [Notii, setNotii] = React.useState([]);
  const userData = useSelector(state => state.counter.data);
  const [loading, setLoading] = useState(false);
  const getNotification = () => {
    NotificationData();
    NotificationData2();
  };
  useFocusEffect(
    React.useCallback(() => {
      getNotification();
      return () => null;
    }, []),
  );
  const getTradedPost = async postId => {
    await firestore()
      .collection('Post')
      .doc(postId)
      .get()
      .then(async documentSnapshot => {
        if (documentSnapshot?.exists) {
          return documentSnapshot.data()?.images[0];
        }
      });
  };
  const NotificationData = async () => {
    let NotificationData = [];
    const currentUserId = auth().currentUser.uid;
    await firestore()
      .collection('Notification')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (
            documentSnapshot.data() && documentSnapshot.data().receiverId
              ? documentSnapshot.data()?.receiverId === currentUserId
              : documentSnapshot.data()?.userID === currentUserId
          ) {
            // if (documentSnapshot.data().seen == false) {
            NotificationData.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
            // }
          }
        });
        setLoading(false);
        let arr = NotificationData.sort((a, b) => {
          moment.utc(b.dateTime).local().format('YYYY-MM-DD HH:mm:ss') -
            moment.utc(a.dateTime).local().format('YYYY-MM-DD HH:mm:ss');
        });
        setNotii(NotificationData);
      })
      .catch(err => {
        setLoading(false);
      });
  };
  const NotificationData2 = async () => {
    const currentUserId = auth().currentUser.uid;
    await firestore()
      .collection('Notification')
      .where('userID', '==', currentUserId)
      .get()
      .then(snapshot => {
        let batch = firestore().batch();
        snapshot.docs.forEach(doc => {
          const ref = doc.ref;
          batch.update(ref, {seen: true});
        });
        return batch.commit();
      });
  };

  return (
    <View style={styles.MainContainer}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View>
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
              <Text style={styles.FontWork}>Notification</Text>
            </View>
          </View>
          {/* header */}

          {Notii !== [] && (
            <ScrollView style={styles.content}>
              {Notii.map((item, idx) => {
                return (
                  <NotificationHead
                    onPress={async () => {
                      if (
                        item.text.endsWith(
                          'an item from your favorites just posted. Click to view.',
                        )
                      ) {
                        await firestore()
                          .collection('Post')
                          .doc(item?.postId)
                          .get()
                          .then(async documentSnapshot => {
                            if (documentSnapshot?.exists) {
                              // return reactotron.log(
                              //   'documentSnapshot.data()',
                              //   documentSnapshot.data(),
                              // );
                              let newlyAddedItemData = documentSnapshot.data();
                              navigation.navigate('PostScreen', {
                                data: newlyAddedItemData,
                              });
                            }
                          });
                      } else if (
                        item.text.endsWith(
                          'would like to trade with you, click to see profile!',
                        )
                      ) {
                        await firestore()
                          .collection('Users')
                          .doc(item?.userID)
                          .get()
                          .then(async documentSnapshot => {
                            if (documentSnapshot.exists) {
                              let userData = documentSnapshot?.data();
                              navigation?.navigate('OtherUserProfile', {
                                data: {
                                  UserID: item?.userID,
                                  image: userData?.image,
                                },
                              });
                            }
                          });
                      } else if (
                        item.text.endsWith(
                          'just rated her experience, click to rate yours.',
                        )
                      ) {
                        // return console.log(item?.sellerData);
                        navigation.navigate('Review', {
                          data: item?.sellerData.UserID,
                        });
                      }
                    }}
                    data={item}
                    notifications={Notii}
                    setNotifications={setNotii}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Header: {
    width: '100%',
    height: h('10%'),
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
});
