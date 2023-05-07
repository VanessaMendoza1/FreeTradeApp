import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import Icons from '../../utils/icons';
import LoadingScreen from '../../Components/LoadingScreen';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

import {useSelector, useDispatch} from 'react-redux';
import {DataInsert} from '../../redux/counterSlice';

import auth from '@react-native-firebase/auth';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const openPhoto = (setloading, setShowUploadBox, setImgeUrl, updateDetails) => {
  setloading(true);
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      console.log(image.path);
      setShowUploadBox(false);
      // end
      const uploadTask = storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(image.path);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) {
            // console.warn('DONE');
          }
        },
        error => {
          console.log(error);
          setloading(false);
          alert('Something went wrong');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setloading(false);
            setImgeUrl(downloadURL);
            updateDetails(downloadURL);
          });
        },
      );

      // end
    })
    .catch(err => {
      setShowUploadBox(false);
      console.warn(err);
      setloading(false);
      alert('Something went wrong');
    });
};

const openCamera = (setShowUploadBox, setloading, setImgeUrl, updateDetails) => {
  // setloading(true);
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      console.log(image.path);
      setShowUploadBox(false);
      // end
      const uploadTask = storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(image.path);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) {
            // console.warn('DONE');
          }
        },
        error => {
          console.log(error);
          setloading(false);
          alert('Something went wrong');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setloading(false);
            setImgeUrl(downloadURL);
            updateDetails(downloadURL);
          });
        },
      );

      // end
    })
    .catch(err => {
      setShowUploadBox(false);
      console.warn(err);
      setloading(false);
      alert('Something went wrong');
    });
};

const updateDetails = downloadURL => {
  setloading(true);
  firestore()
    .collection('Users')
    .doc(MyData.UserID)
    .update({
      image: downloadURL ? downloadURL : MyData.image,
    })
    .then(async () => {
      let userData = [];
      await firestore()
        .collection('Users')
        .doc(MyData.UserID)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            userData.push(documentSnapshot.data());
          }
        })
        .catch(err => {
          setloading(false);
          console.warn(err);
        });

      await dispatch(DataInsert(userData[0]));
      alert('Profile Picture Updated');
      setloading(false);
      navigation.goBack();
    })
    .catch(err => {
      setloading(false);
      console.log(err);
    });
};

const EditAccount = ({navigation}) => {
  const MyData = useSelector(state => state.counter.data);
  // console.warn(MyData.email);
  const dispatch = useDispatch();
  

  const [OPassword, setOpassword] = React.useState(true);
  const [Password, setpassword] = React.useState(true);
  const [CPassword, setCpassword] = React.useState(true);

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newCPassword, setNewCPassword] = React.useState('');

  const [Name, setName] = React.useState(MyData.name);
  const [loading, setloading] = React.useState(false);

  const [showUploadBox, setShowUploadBox] = React.useState(false);

  const [ImageUrl, setImgeUrl] = React.useState('');
 

  const PostChangeName = async () => {
    let  newarr = []
    await firestore()
      .collection('Post')
      .get()
  .then(querySnapshot => {
   
      querySnapshot.forEach(documentSnapshot => {
     
        // console.log("sdsjdskdjsdk", documentSnapshot.data().UserID)
         
        if (documentSnapshot.data().UserID === MyData.UserID){
         
          newarr.push(documentSnapshot.data().DocId)
        }
      });
  });
  if (newarr){
    newarr.map( async(item, index)=>{
      await firestore()
      .collection('Post')
      .doc(`${item}`)
      .update({
        'user.name': Name ? Name : MyData.name,
      })
      .then(() => {
        console.log('User updated!');
      });
    })
  }
  };
 

  useEffect(() => {
  
  }, []);

  const updateName = () => {
    setloading(true);
    firestore()
      .collection('Users')
      .doc(MyData.UserID)
      .update({
        name: Name ? Name : MyData.name,
        AccountType: 'Free',
        Post: 0,
      })
      .then(async () => {
        let userData = [];
        await firestore()
          .collection('Users')
          .doc(MyData.UserID)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              userData.push(documentSnapshot.data());
            }
          })
          .catch(err => {
            setloading(false);
            console.warn(err);
          });

        await dispatch(DataInsert(userData[0]));
        alert('Name has been Changed');
        PostChangeName()
        setloading(false);
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  };

  const updatePassword = () => {
    setloading(true);
    if (newCPassword === newPassword) {
      auth()
        .signInWithEmailAndPassword(MyData.email, oldPassword)
        .then(async userCredential => {
          const user = userCredential.user;
          user.updatePassword(newPassword);

          alert('Password Changed');
          navigation.goBack();
          setloading(false);
        })
        .catch(error => {
          setloading(true);
          const errorMessage = error.code;
          setloading(false);
          console.log(errorMessage);
          if (errorMessage === 'auth/wrong-password') {
            alert('Wrong Password');
            setloading(false);
          }
          if (errorMessage === 'auth/user-not-found') {
            setloading(false);
          }
        });
    } else {
      alert('New Password and Confirm Password are not same !');
      setloading(false);
    }
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
              <Text style={styles.FontWork}>Profile Editing</Text>
            </View>
          </View>
          {/* header */}
          {/* profile Container */}
          <View style={styles.ProfileContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowUploadBox(true);
              }}
              style={styles.ProfileCC}>
              <View style={styles.CamerColar}>
                <Icon name="camera" size={35} color="#ffff" />
              </View>
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri: MyData.image
                    ? MyData.image
                    : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </TouchableOpacity>
            {/* <Text style={styles.nameText}>Vanessa</Text> */}
          </View>
          {/* profile Containr */}

          <View style={styles.bottomContaaainers}>
            <Text style={styles.NamePlate}>Edit Name</Text>
            <TextInput
              style={styles.inputContainercc}
              placeholder={'Edit Name'}
              placeholderTextColor={Colors.Primary}
              onChangeText={e => setName(e)}
              value={Name}
            />

            <View style={styles.AppBtn}>
              <Appbutton
                CustomWidth={'100%'}
                text={'Change Name'}
                onPress={() => {
                  updateName();
                }}
              />
            </View>
            {/* passwordCC */}
            <Text style={styles.NamePlate}>Change Password</Text>
            <View style={styles.PasswordContainer}>
              <TextInput
                style={styles.inputContainercc2}
                placeholder={'Old Password'}
                placeholderTextColor={Colors.Primary}
                secureTextEntry={OPassword}
                onChangeText={e => setOldPassword(e)}
              />
              <TouchableOpacity
                onPress={() => {
                  setOpassword(!OPassword);
                }}
                style={styles.iconContainercc2}>
                {OPassword ? (
                  <Icon name="eye-off" size={30} color={Colors.Primary} />
                ) : (
                  <Icon name="eye" size={30} color={Colors.Primary} />
                )}
              </TouchableOpacity>
            </View>
            {/* passwordCC */}
            <View style={styles.PasswordContainer}>
              <TextInput
                style={styles.inputContainercc2}
                placeholder={'New Password'}
                placeholderTextColor={Colors.Primary}
                secureTextEntry={Password}
                onChangeText={e => setNewPassword(e)}
              />
              <TouchableOpacity
                onPress={() => {
                  setpassword(!Password);
                }}
                style={styles.iconContainercc2}>
                {Password ? (
                  <Icon name="eye-off" size={30} color={Colors.Primary} />
                ) : (
                  <Icon name="eye" size={30} color={Colors.Primary} />
                )}
              </TouchableOpacity>
            </View>
            {/* passwordCC */}
            {/* passwordCC */}
            <View style={styles.PasswordContainer}>
              <TextInput
                style={styles.inputContainercc2}
                placeholder={'Confirm New Password'}
                placeholderTextColor={Colors.Primary}
                secureTextEntry={CPassword}
                onChangeText={e => setNewCPassword(e)}
              />
              <TouchableOpacity
                onPress={() => {
                  setCpassword(!CPassword);
                }}
                style={styles.iconContainercc2}>
                {CPassword ? (
                  <Icon name="eye-off" size={30} color={Colors.Primary} />
                ) : (
                  <Icon name="eye" size={30} color={Colors.Primary} />
                )}
              </TouchableOpacity>
            </View>
            {/* passwordCC */}

            <View style={styles.AppBtn}>
              <Appbutton
                onPress={() => {
                  updatePassword();
                }}
                CustomWidth={'100%'}
                text={'Change Password'}
              />
            </View>
          </View>
        </View>
      )}

      {showUploadBox && (
        <View style={styles.uploadOptionsContainer}>
          <TouchableOpacity
            style={styles.captureOptionItem}
            activeOpacity={0.9}
            onPress={() => openCamera(setShowUploadBox, setloading, setImgeUrl, updateDetails)}>
            <Text>From Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureOptionItem}
            activeOpacity={0.9}
            onPress={() => openPhoto(setloading, setShowUploadBox, setImgeUrl, updateDetails)}>
            <Text>From Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingScrollView>
  );
};

export { openPhoto, openCamera, updateDetails }
export default EditAccount;

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
  ProfileContainer: {
    width: '100%',
    height: h('20%'),
    // backgroundColor: 'green',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileCC: {
    width: 120,
    height: 120,
    borderRadius: 1000 / 2,
    backgroundColor: '#fff3',
    overflow: 'hidden',
  },
  nameText: {
    color: '#000',
    fontSize: h('2.4%'),
    marginTop: h('1%'),
  },
  CamerColar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContaaainers: {
    width: '90%',
    height: h('65%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    paddingTop: h('2.5%'),
  },
  inputContainercc: {
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    height: h('7%'),
    width: '100%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),
    color: Colors.Primary,
  },
  inputContainercc2: {
    height: '100%',
    width: '85%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),
    // backgroundColor: 'red',
  },
  PasswordContainer: {
    width: '100%',
    height: h('7%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    marginTop: h('1%'),
    flexDirection: 'row',
  },
  iconContainercc2: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AppBtn: {
    width: '100%',
    height: '15%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NamePlate: {
    color: Colors.Primary,
    fontSize: h('2.3%'),
    fontWeight: 'bold',
    marginBottom: h('.7%'),
    marginTop: h('2%'),
  },
  uploadOptionsContainer: {
    position: 'absolute',
    backgroundColor: '#0004',
    width: w('100%'),

    alignSelf: 'center',
    // top: '35%',
    borderWidth: 2,
    borderColor: '#0003',
    bottom: 50,
    height: '100%',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  captureOptionItem: {
    textAlign: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: h('10%'),

    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#0003',
    borderWidth: h('0.1%'),
  },
});
