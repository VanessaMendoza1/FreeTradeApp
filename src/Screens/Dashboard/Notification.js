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

const Notification = ({navigation}) => {
  const [Notii, setNotii] = React.useState([]);
  const userData = useSelector(state => state.counter.data);

  React.useEffect(() => {
    NotificationData();
    NotificationData2();
  }, []);

  const NotificationData = async () => {
    let NotificationData = [];
    await firestore()
      .collection('Notification')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // console.warn(data.UserID);
          if (documentSnapshot.data().userID == userData.UserID) {
            NotificationData.push(documentSnapshot.data());
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
    await firestore()
      .collection('Notification')
      .where('userID', '==', userData.UserID)
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
                  console.warn(item);
                  if (item.text.endsWith("added an Item you might be interested in")){
                    await firestore()
                      .collection('Post')
                      .doc(item.newlyAddedItemId)
                      .get()
                      .then(async documentSnapshot => {
                        if (documentSnapshot.exists) {
                          let newlyAddedItemData = documentSnapshot.data()
                          navigation.navigate('PostScreen', {data: newlyAddedItemData});
                        }
                        // or
                      });
                  } else if (item.sellerData.UserID){
                    navigation.navigate('Review', {data: item.sellerData});
                  }
                }}
                data={item}
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
