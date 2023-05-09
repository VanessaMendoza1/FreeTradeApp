import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageHead from '../../Components/MessageHead';

import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';

const removeNewMessagesAvailableDot = () => {
  const currentUserId = auth().currentUser.uid
    firestore()
      .collection('Users')
      .doc(currentUserId)
      .update({hasUnseenMessages: null})
}

const MessageScreen = ({navigation}) => {
  // const [inboxData, setInboxData] = useState(inboxDataSet);
  const [searchValue, setSearchValue] = useState('');
  const [Me, setMe] = useState('');
  const [users, setusers] = useState('');

  const [search, setsearch] = useState('');
  const [allUser, setallUser] = useState([]);
  const [allUserBackup, setallUserBackup] = useState([]);

  const Userdata = useSelector(state => state.counter.data);

  React.useEffect(() => {
    removeNewMessagesAvailableDot()
  }, [])

  const getAllUser = () => {
    database()
      .ref('chatlist/' + Userdata.UserID)
      .once('value')
      .then(snapshot => {
        // console.warn('all User data: ', Object.values(snapshot.val()));
        setusers(
          Object.values(snapshot.val()).filter(it => it.id != Userdata.UserID),
        );
        setallUserBackup(
          Object.values(snapshot.val()).filter(it => it.id != Userdata.UserID),
        );
      });
  };

  React.useEffect(() => {
    getAllUser();
  }, []);

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
          <Text style={styles.FontWork}>Inbox </Text>
        </View>
      </View>
      {/* header */}

      {users &&
        users?.map((item, idx) => {
          console.log({USERS: users})
          return (
            <MessageHead
              key={idx}
              onPress={() => {
                console.log({item})
                navigation.navigate('Inbox', {receiverData: item})
              }}
              username={item.sellersName}
              img={item.sellersImage}
            />
          );
        })}

      {users.length === 0 && (
        <View
          style={{
            width: w('100%'),
            height: h('100%'),
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={{color: '#0006', fontSize: 19}}>No Chats</Text>
        </View>
      )}
    </View>
  );
};

export default MessageScreen;

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
