import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageHead from '../../Components/MessageHead';
import Appbutton from '../../Components/Appbutton';

const CreateMessage = ({navigation}) => {
  const [message, setMessage] = React.useState('');

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
          <Text style={styles.FontWork}>Message</Text>
        </View>
      </View>
      {/* header */}

      {/* All Components */}
      <View style={styles.maincomponents}>
        <View style={styles.LeftMContainer}>
          <View style={styles.ProfileContainer}>
            <View style={styles.ProfileCC}>
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.RightMContainer}>
          <View style={styles.RatingContianer}>
            <Text style={styles.NameC}>Vanessa</Text>
            <View style={styles.HeadingTextContainer45}>
              <View style={styles.HeartContainer}>
                <Icon name="star" size={20} color="gold" />
              </View>
              <Text style={styles.HeadingText5}>5 (10)</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.linebar} />
      {/* All Components */}

      {/* messages */}
      <Text style={styles.leftMessage}>
        Tap a message to send or write your own
      </Text>

      {/* msg btn */}
      <TouchableOpacity
        onPress={() => {
          setMessage('Hi, is this still available?');
        }}
        style={styles.msgBtn}>
        <Text style={styles.MsgTxt}>Hi, is this still available?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setMessage('Hi, would you consider trading?');
        }}
        style={styles.msgBtn}>
        <Text style={styles.MsgTxt}>Hi, would you consider trading?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setMessage('Hi, could you send a video?');
        }}
        style={styles.msgBtn}>
        <Text style={styles.MsgTxt}>Hi, could you send a video?</Text>
      </TouchableOpacity>
      {/* msg btn */}
      <TextInput
        value={message}
        style={styles.inputFieldContainer}
        placeholder={'New message'}
        placeholderTextColor={'#000'}
      />
      {/* messages */}
      <View style={styles.AppBtn}>
        <Appbutton
          onPress={() => {
            navigation.navigate('Inbox');
          }}
          text={'Send'}
        />
      </View>
    </View>
  );
};

export default CreateMessage;
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
  maincomponents: {
    width: '100%',
    height: '15%',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  LeftMContainer: {
    width: '22%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  RightMContainer: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  ProfileContainer: {
    width: '22%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 80,
    height: 80,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  RatingContianer: {
    width: '100%',
    height: '100%',

    justifyContent: 'center',
  },

  NameC: {
    color: '#000',
    fontSize: h('2.5%'),
  },
  HeadingText5: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  HeadingTextContainer45: {
    width: '30%',
    // backgroundColor: 'orange',
    height: h('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeartContainer: {
    width: '30%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linebar: {
    width: '100%',
    borderWidth: h('0.2%'),
    borderColor: '#0002',
  },
  leftMessage: {
    color: '#0008',
    fontSize: h('2%'),
    marginLeft: h('1.5%'),
    marginTop: h('2%'),
    marginBottom: h('2%'),
  },
  msgBtn: {
    // backgroundColor: 'gold',
    marginLeft: h('1.5%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    width: '70%',
    height: h('6%'),
    marginTop: h('1%'),
    justifyContent: 'center',
    paddingLeft: h('1%'),
  },
  MsgTxt: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  inputFieldContainer: {
    // backgroundColor: '#0003',
    width: '90%',
    marginTop: h('1%'),
    marginLeft: h('1.5%'),
    borderColor: '#0005',
    borderWidth: h('0.2%'),
    paddingLeft: h('1%'),
    height: h('6%'),
  },
  AppBtn: {
    width: '100%',
    height: '30%',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
