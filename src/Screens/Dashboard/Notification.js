import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationHead from '../../Components/NotificationHead';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import { areNotificationsHidden } from "../../utils/appConfigurations"
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const Notification = ({navigation}) => {
  const [Notii, setNotii] = React.useState([]);
  const userData = useSelector(state => state.counter.data);

  const getNotification = () => {
    console.log("Getting Notifications")
    NotificationData();
    NotificationData2();
  }

  useFocusEffect(
		React.useCallback(() => {
			console.log("Focussed Notification.js, running getNotification")
			getNotification()
			return () => null;
		}, [])
	);

  const NotificationData = async () => {
    let NotificationData = [];
    const currentUserId = auth().currentUser.uid
    await firestore()
      .collection('Notification')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // console.warn(data.UserID);
          if (documentSnapshot.data() && documentSnapshot.data().userID == currentUserId) {
            // if (documentSnapshot.data().seen == false) {
            NotificationData.push({
              ...documentSnapshot.data(), 
              id: documentSnapshot.id
            });
            // }
          }
        });
        setNotii(NotificationData);
        console.warn(NotificationData);
      })
      .catch(err => {
        console.warn(err);
      });
  };
  const NotificationData2 = async () => {
    // console.warn('r');
    const currentUserId = auth().currentUser.uid
    await firestore()
      .collection('Notification')
      .where('userID', '==', currentUserId)
      .get()
      .then(snapshot => {
        let batch = firestore().batch();
        snapshot.docs.forEach(doc => {
          const ref = doc.ref;
          batch.update(ref, {seen: true});

          // const docRef = firestore().collection('Notification').doc(doc.id);
          // console.warn('runn');
          // batch.update(docRef, );
        });
        return batch.commit();
      });
  };

  return (
    <View style={styles.MainContainer}>
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
                  console.log({item});
                  if (item.text.endsWith("an item from your favorites just posted. Click to view.")){
                    await firestore()
                      .collection('Post')
                      .doc(item.newlyAddedItemId)
                      .get()
                      .then(async documentSnapshot => {
                        if (documentSnapshot.exists) {
                          let newlyAddedItemData = documentSnapshot.data()
                          navigation.navigate('PostScreen', {data: newlyAddedItemData});
                        }
                      });
                  } else if (item.text.endsWith("would like to trade with you, click to see profile!")){
                    navigation.navigate('OtherUserProfile', {
                      data: item.userID,
                    });
                  } else if (item.text.endsWith("just rated her experience, click to rate yours.")){
                    navigation.navigate('Review', {
                      data: item.userID,
                    });
                  }
                  // trade , links to profile
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
