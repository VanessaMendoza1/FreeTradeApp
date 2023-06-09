import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../../Components/Appbutton';
import SettingItem from '../../Components/SettingItem';
import Icons from '../../utils/icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector, useDispatch} from 'react-redux';
import {DataInsert} from '../../redux/counterSlice';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import LoadingScreen from '../../Components/LoadingScreen';
import {openPhoto, openCamera, updateDetails} from './EditAccount';
import auth from '@react-native-firebase/auth';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const heightDropItem = 40;

const allowedTimings = [
  {label: '0:00 Am', value: '0:00 Am'},
  {label: '1:00 Am', value: '1:00 Am'},
  {label: '2:00 Am', value: '2:00 Am'},
  {label: '3:00 Am', value: '3:00 Am'},
  {label: '4:00 Am', value: '4:00 Am'},
  {label: '5:00 Am', value: '5:00 Am'},
  {label: '6:00 Am', value: '6:00 Am'},
  {label: '7:00 Am', value: '7:00 Am'},
  {label: '8:00 Am', value: '8:00 Am'},
  {label: '9:00 Am', value: '9:00 Am'},
  {label: '10:00 Am', value: '10:00 Am'},
  {label: '11:00 Am', value: '11:00 Am'},
  {label: '12:00 Pm', value: '12:00 Pm'},
  {label: '1:00 Pm', value: '1:00 Pm'},
  {label: '2:00 Pm', value: '2:00 Pm'},
  {label: '3:00 Pm', value: '3:00 Pm'},
  {label: '4:00 Pm', value: '4:00 Pm'},
  {label: '5:00 Pm', value: '5:00 Pm'},
  {label: '6:00 Pm', value: '6:00 Pm'},
  {label: '7:00 Pm', value: '7:00 Pm'},
  {label: '8:00 Pm', value: '8:00 Pm'},
  {label: '9:00 Pm', value: '9:00 Pm'},
  {label: '10:00 Pm', value: '10:00 Pm'},
  {label: '11:00 Pm', value: '11:00 Pm'},
  {label: '12:00 Pm', value: '12:00 Pm'},
];

const getCurrentBusinessDetails = (
  // setOldPassword,
  setBusiness,
  setAddress,
  setWebsite,
  sePhone,
  setValue,
  setValue2,
  setValue3,
  setValue4,
  setClosedOnDayModalValue,
) => {
  const currentUserId = auth().currentUser.uid;
  firestore()
    .collection('Users')
    .doc(currentUserId)
    .get()
    // .update({
    //   BusinessName: Business,
    //   Address: Address,
    //   Website: Website,
    //   Phone: Phone,
    //   bussinessdaysFrom: value3,
    //   bussinessdaysto: value4,
    //   closedDays: closedOnDayModalValue,
    //   bussinessHoursFrom: value,
    //   bussinessHoursto: value2,
    //   AccountType: 'Bussiness',
    //   BussinessDetails: true,
    // })
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        let {
          // password,
          BusinessName,
          Address,
          Phone,
          Website,
          bussinessdaysFrom,
          bussinessdaysto,
          closedDays,
          bussinessHoursFrom,
          bussinessHoursto,
        } = documentSnapshot.data();
        console.log({DATA: documentSnapshot.data()});

        // setOldPassword(password)
        setBusiness(BusinessName);
        setAddress(Address);
        setWebsite(Website);
        sePhone(Phone);
        setValue(bussinessHoursFrom);
        setValue2(bussinessHoursto);
        setValue3(bussinessdaysFrom);
        setValue4(bussinessdaysto);
        setClosedOnDayModalValue(closedDays);
      }
    });
};

const BussinessAccountEdits = () => {
  const navigation = useNavigation();
  const MyData = useSelector(state => state?.counter?.data);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setmodalType] = React.useState('');

  const [ImageUrl, setImgeUrl] = React.useState('');
  const [showUploadBox, setShowUploadBox] = React.useState(false);

  const [items, setItems] = React.useState(allowedTimings);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items2, setItems2] = React.useState(allowedTimings);
  const [open2, setOpen2] = React.useState(false);
  const [value2, setValue2] = React.useState(null);
  const [items3, setItems3] = React.useState([
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Friday', value: 'Friday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ]);
  const [open3, setOpen3] = React.useState(false);
  const [value3, setValue3] = React.useState(null);
  const [items4, setItems4] = React.useState([
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Friday', value: 'Friday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ]);
  const [open4, setOpen4] = React.useState(false);
  const [value4, setValue4] = React.useState(null);

  const [closedFromDayModalVisibility, setClosedFromDayModalVisibility] =
    React.useState(false);
  const [closedOnDayModalValue, setClosedOnDayModalValue] =
    React.useState(null);
  // const [closedToDayModalValue, setClosedToDayModalValue] = React.useState(null)

  const [OPassword, setOpassword] = React.useState(true);
  const [Password, setpassword] = React.useState(true);
  const [CPassword, setCpassword] = React.useState(true);

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newCPassword, setNewCPassword] = React.useState('');

  const [Business, setBusiness] = React.useState('');
  const [Address, setAddress] = React.useState('');
  const [Website, setWebsite] = React.useState('');
  const [Phone, sePhone] = React.useState('');

  const [loading, setloading] = React.useState(false);
  const subdata = useSelector(state => state.sub.subdata);

  useFocusEffect(
    React.useCallback(() => {
      console.log(
        'Focussed BussinessAcountEdits.js, running getCurrentBusinessDetails',
      );
      getCurrentBusinessDetails(
        // setOldPassword,
        setBusiness,
        setAddress,
        setWebsite,
        sePhone,
        setValue,
        setValue2,
        setValue3,
        setValue4,
        setClosedOnDayModalValue,
      );
      return () => null;
    }, []),
  );

  const PostChangeName = async () => {
    const currentUserId = auth().currentUser.uid;
    let newarr = [];
    await firestore()
      .collection('Post')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().UserID === currentUserId) {
            newarr.push(documentSnapshot.data().DocId);
          }
        });
      });
    if (newarr) {
      newarr.map(async (item, index) => {
        await firestore()
          .collection('Post')
          .doc(`${item}`)
          .update({
            'user.name': Business,
          })
          .then(() => {
            console.log('User updated!');
          });
      });
    }
  };

  const UpdateData = () => {
    const currentUserId = auth().currentUser.uid;
    setloading(true);
    if (
      Business !== ''
      // && Address !== '' &&
      // Website !== '' &&
      // Phone !== '' &&
      // value4 !== null &&
      // value3 !== null &&
      // value2 !== null &&
      // value !== null
    ) {
      firestore()
        .collection('Users')
        .doc(currentUserId)
        .update({
          BusinessName: Business,
          Address: Address,
          Website: Website,
          Phone: Phone,
          bussinessdaysFrom: value3,
          bussinessdaysto: value4,
          closedDays: closedOnDayModalValue,
          bussinessHoursFrom: value,
          bussinessHoursto: value2,
          AccountType: 'Bussiness',
          BussinessDetails: true,
        })
        .then(async () => {
          let userData = [];
          await firestore()
            .collection('Users')
            .doc(currentUserId)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
                userData.push(documentSnapshot.data());
              }
            })
            .catch(err => {
              setloading(false);
            });

          await dispatch(DataInsert(userData[0]));
          alert('Done');
          PostChangeName();

          setloading(false);
        })
        .catch(err => {
          setloading(false);
          console.log(err);
        });
    } else {
      alert('All Fields are Required');
      setloading(false);
    }
  };

  const updatePassword = () => {
    setloading(true);
    if (newCPassword === newPassword) {
      auth()
        .signInWithEmailAndPassword(MyData?.email, oldPassword)
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
    <ScrollView>
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
              <Text style={styles.FontWork}>Settings</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.ProfileContainer}
            onPress={() => {
              setShowUploadBox(true);
            }}>
            <View style={styles.ProfileCC}>
              <View style={styles.CamerColar}>
                <Icon name="camera" size={35} color="#ffff" />
              </View>
              {/* <View style={styles.CamerColar}>
              <Icon name="camera" size={35} color="#ffff" />
            </View> */}
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri: MyData?.image
                    ? MyData?.image
                    : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </View>
            <Text style={styles.nameText}>
              {subdata.length > 0
                ? subdata[0].plan === 'Bussiness'
                  ? MyData?.BusinessName
                  : MyData?.name
                : MyData?.name}
            </Text>
          </TouchableOpacity>
          {/* profile Containr */}

          {/* <Text style={styles.NamePlate}>Change Password</Text> */}
          <View style={styles.PasswordContainer}>
            <TextInput
              style={styles.inputContainercc2}
              placeholder={'Old Password'}
              value={oldPassword}
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
          <View style={styles.AppBtn1}>
            <Appbutton
              onPress={() => {
                updatePassword();
              }}
              CustomWidth={'90%'}
              text={'Change Password'}
            />
          </View>

          <View style={styles.bottomContaaainers}>
            <TextInput
              style={styles.inputContainercc}
              placeholder={'Business name'}
              placeholderTextColor={Colors.Primary}
              onChangeText={e => setBusiness(e)}
              value={Business}
            />
            <TextInput
              style={styles.inputContainercc}
              placeholder={'Address'}
              placeholderTextColor={Colors.Primary}
              onChangeText={e => setAddress(e)}
              value={Address}
            />
            <TextInput
              style={styles.inputContainercc}
              placeholder={'Website (optional)'}
              placeholderTextColor={Colors.Primary}
              onChangeText={e => setWebsite(e)}
              value={Website}
            />
            <TextInput
              style={styles.inputContainercc}
              placeholder={'Phone Number'}
              placeholderTextColor={Colors.Primary}
              onChangeText={e => sePhone(e)}
              value={Phone}
            />

            <View style={{height: h('2%')}} />

            <Appbutton
              CustomWidth={'100%'}
              text={'Add Hours'}
              onPress={() => {
                setmodalType('Hours');

                setModalVisible(true);
              }}
            />
            <View style={{height: h('2%')}} />
            <Appbutton
              text={'Add Days'}
              CustomWidth={'100%'}
              onPress={() => {
                setmodalType('days');
                setModalVisible(true);
              }}
            />

            {/* hors */}

            {/* hors */}
          </View>
          <View style={styles.AppBtn}>
            <Appbutton
              text={'Submit'}
              onPress={() => {
                UpdateData();
              }}
            />
          </View>
        </View>
      )}

      {showUploadBox && (
        <View style={styles.uploadOptionsContainer}>
          <TouchableOpacity
            style={styles.captureOptionItem}
            activeOpacity={0.9}
            onPress={() =>
              openCamera(
                setShowUploadBox,
                setloading,
                setImgeUrl,
                updateDetails,
                navigation,
              )
            }>
            <Text>From Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureOptionItem}
            activeOpacity={0.9}
            onPress={() =>
              openPhoto(
                setloading,
                setShowUploadBox,
                setImgeUrl,
                updateDetails,
                dispatch,
                navigation,
              )
            }>
            <Text>From Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                width: '95%',
                height: h('5%'),
                // backgroundColor: 'red',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={{...styles.markText, marginBottom: 20}}>
              Add {modalType === 'Hours' ? 'Business Hours' : 'Days'}
            </Text>
            {/* hors */}
            {modalType === 'Hours' && (
              <View style={styles.workingHours}>
                <Text style={styles.markText}>Business Hours</Text>

                <View style={styles.FromTo}>
                  <View style={styles.leftCC2}>
                    <View style={{zIndex: 4000}}>
                      <DropDownPicker
                        open={open}
                        placeholder="from"
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        zIndex={3000}
                        setValue={setValue}
                        setItems={setItems}
                        style={{
                          borderColor: Colors.Primary,
                          backgroundColor: 'white',
                          width: '90%',
                          borderRadius: h(0),
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.leftCC}>
                    <View style={{zIndex: 5000}}>
                      <DropDownPicker
                        open={open2}
                        placeholder="To"
                        value={value2}
                        items={items2}
                        setOpen={setOpen2}
                        setValue={setValue2}
                        setItems={setItems2}
                        style={{
                          borderColor: Colors.Primary,
                          backgroundColor: 'white',
                          width: '90%',
                          borderRadius: h(0),
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {modalType !== 'Hours' && (
              <>
                <View style={styles.workingHours}>
                  <Text style={styles.markText}>Business Days</Text>

                  <View
                    style={[
                      styles.FromTo,
                      {
                        minHeight: open
                          ? (items.length + 1) * heightDropItem
                          : heightDropItem,
                      },
                    ]}>
                    <View style={styles.leftCC3}>
                      <View style={{zIndex: 2000}}>
                        <DropDownPicker
                          open={open3}
                          placeholder="from"
                          value={value3}
                          items={items3}
                          setOpen={setOpen3}
                          setValue={setValue3}
                          setItems={setItems3}
                          maxHeight={120}
                          style={{
                            borderColor: Colors.Primary,
                            backgroundColor: 'white',
                            width: '90%',
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.leftCC3}>
                      <View style={{zIndex: 2000}}>
                        <DropDownPicker
                          open={open4}
                          placeholder="To"
                          value={value4}
                          items={items4}
                          setOpen={setOpen4}
                          setValue={setValue4}
                          setItems={setItems4}
                          maxHeight={120}
                          style={{
                            borderColor: Colors.Primary,

                            backgroundColor: 'white',
                            width: '90%',
                            borderRadius: h(0),
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* HERE !!! */}
                <View
                  style={{
                    ...styles.workingHours,
                    marginTop: 100,
                  }}>
                  <Text style={styles.markText}>Closed Days</Text>

                  <View
                    style={[
                      styles.FromTo,
                      {
                        minHeight: open
                          ? (items.length + 1) * heightDropItem
                          : heightDropItem,
                      },
                    ]}>
                    <View style={{...styles.leftCC3, width: '100%'}}>
                      <View style={{zIndex: 2001}}>
                        <DropDownPicker
                          open={closedFromDayModalVisibility}
                          placeholder="Closed Day"
                          value={closedOnDayModalValue}
                          items={items3}
                          setOpen={setClosedFromDayModalVisibility}
                          setValue={setClosedOnDayModalValue}
                          setItems={setItems3}
                          maxHeight={120}
                          // style={{backgroundColor: "pink"}}
                          // containerProps={{backgroundColor: "pink"}}
                          style={{
                            borderColor: Colors.Primary,
                            backgroundColor: 'white',
                            width: '90%',
                          }}
                        />
                      </View>
                    </View>
                    {/* <View style={styles.leftCC3}>
                      <View style={{zIndex: 2000}}>
                        <DropDownPicker
                          open={closedToDayModalVisibility}
                          placeholder="To"
                          value={closedToDayModalValue}
                          items={items4}
                          setOpen={setClosedToDayModalVisibility}
                          setValue={setClosedToDayModalValue}
                          setItems={setItems4}
                          maxHeight={120}
                          style={{
                            borderColor: Colors.Primary,

                            backgroundColor: 'white',
                            width: '90%',
                            borderRadius: h(0),
                          }}
                        />
                      </View>
                    </View> */}
                  </View>
                </View>
              </>
            )}

            {/* hors */}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BussinessAccountEdits;

const styles = StyleSheet.create({
  mainContinaer: {
    backgroundColor: 'white',
    width: '100%',
    height: h('130%'),
    marginBottom: 20,
  },
  NamePlate: {
    color: Colors.Primary,
    fontSize: h('2.3%'),
    fontWeight: 'bold',
    marginBottom: h('.7%'),
    marginTop: h('2%'),
  },
  PasswordContainer: {
    alignSelf: 'center',
    width: '90%',
    height: h('7%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    marginTop: h('1%'),
    flexDirection: 'row',
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
  bottomContaaainers: {
    width: '90%',
    height: h('55%'),
    // backgroundColor: 'red',
    alignSelf: 'center',
    paddingTop: h('2.5%'),
    alignItems: 'center',
  },
  inputContainercc: {
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    height: h('7%'),
    width: '100%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),
    marginTop: h('1%'),
  },
  inputContainercc2: {
    height: '100%',
    width: '85%',
    fontSize: h('2%'),
    paddingLeft: h('1.5%'),

    // backgroundColor: 'blue',
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
    height: h('7%'),
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: -1,
  },
  AppBtn1: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: -1,
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
  workingHours: {
    // backgroundColor: 'green',
    width: '90%',
    height: h('15%'),
    marginTop: h('1%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  markText: {
    color: Colors.Primary,
    fontSize: h('3%'),
    marginTop: h('1%'),
    marginLeft: h('1.5%'),
  },
  FromTo: {
    width: '100%',
    height: '50%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingLeft: h('0.7%'),
    zIndex: -1,
  },
  leftCC: {
    width: '45%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCC2: {
    width: '45%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCC3: {
    width: '50%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0009',
  },
  modalView: {
    width: '100%',
    height: h('90%'),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
    height: '46%',
    // alignItems: 'flex-end',
    justifyContent: 'flex-start',
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
