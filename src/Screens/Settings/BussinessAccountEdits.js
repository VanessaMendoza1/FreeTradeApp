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
import { openPhoto, openCamera, updateDetails } from './EditAccount'
const heightDropItem = 40;

const BussinessAccountEdits = ({navigation}) => {
  const MyData = useSelector(state => state.counter.data);
  console.warn(MyData.name);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setmodalType] = React.useState('');

  const [ImageUrl, setImgeUrl] = React.useState('');
  const [showUploadBox, setShowUploadBox] = React.useState(false);

  const [items, setItems] = React.useState([
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
    {label: '13:00 Pm', value: '13:00 Pm'},
    {label: '14:00 Pm', value: '14:00 Pm'},
    {label: '15:00 Pm', value: '15:00 Pm'},
    {label: '16:00 Pm', value: '16:00 Pm'},
    {label: '17:00 Pm', value: '17:00 Pm'},
    {label: '18:00 Pm', value: '18:00 Pm'},
    {label: '19:00 Pm', value: '19:00 Pm'},
    {label: '20:00 Pm', value: '20:00 Pm'},
    {label: '21:00 Pm', value: '21:00 Pm'},
    {label: '22:00 Pm', value: '22:00 Pm'},
    {label: '23:00 Pm', value: '23:00 Pm'},
  ]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items2, setItems2] = React.useState([
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
    {label: '13:00 Pm', value: '13:00 Pm'},
    {label: '14:00 Pm', value: '14:00 Pm'},
    {label: '15:00 Pm', value: '15:00 Pm'},
    {label: '16:00 Pm', value: '16:00 Pm'},
    {label: '17:00 Pm', value: '17:00 Pm'},
    {label: '18:00 Pm', value: '18:00 Pm'},
    {label: '19:00 Pm', value: '19:00 Pm'},
    {label: '20:00 Pm', value: '20:00 Pm'},
    {label: '21:00 Pm', value: '21:00 Pm'},
    {label: '22:00 Pm', value: '22:00 Pm'},
    {label: '23:00 Pm', value: '23:00 Pm'},
  ]);
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

  const [Business, setBusiness] = React.useState('');
  const [Address, setAddress] = React.useState('');
  const [Website, setWebsite] = React.useState('');
  const [Phone, sePhone] = React.useState('');

  const [loading, setloading] = React.useState(false);

  const PostChangeName = async () => {
    let  newarr = []
    await firestore()
      .collection('Post')
      .get()
  .then(querySnapshot => {
   
      querySnapshot.forEach(documentSnapshot => {
     
       
         
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
        'user.name': Business,
      })
      .then(() => {
        console.log('User updated!');
      });
    })
  }
  };
 

  const UpdateData = () => {
    setloading(true);
    if (
      Business !== '' &&
      Address !== '' &&
      Website !== '' &&
      Phone !== '' &&
      value4 !== null &&
      value3 !== null &&
      value2 !== null &&
      value !== null
    ) {
      firestore()
        .collection('Users')
        .doc(MyData.UserID)
        .update({
          BusinessName: Business,
          Address: Address,
          Website: Website,
          Phone: Phone,
          bussinessdaysFrom: value3,
          bussinessdaysto: value4,
          bussinessHoursFrom: value,
          bussinessHoursto: value2,
          AccountType: 'Bussiness',
          BussinessDetails: true,
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
          alert('Done');
          PostChangeName()

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
              <Text style={styles.FontWork}>Setting</Text>
            </View>
          </View>
          {/* header */}
          {/* profile Container */}
          

          {/* <TouchableOpacity
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
            </TouchableOpacity> */}



          <TouchableOpacity style={styles.ProfileContainer} onPress={() => {
                setShowUploadBox(true);
              }}>
            <View style={styles.ProfileCC}>
              {/* <View style={styles.CamerColar}>
              <Icon name="camera" size={35} color="#ffff" />
            </View> */}
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                source={{
                  uri: MyData.image
                    ? MyData.image
                    : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </View>
            <Text style={styles.nameText}>{MyData.name}</Text>
          </TouchableOpacity>
          {/* profile Containr */}

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
              text={'Add Hours'}
              onPress={() => {
                setmodalType('Hours');

                setModalVisible(true);
              }}
            />
            <View style={{height: h('2%')}} />
            <Appbutton
              text={'Add Days'}
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
            onPress={openCamera(setShowUploadBox, setloading, setImgeUrl, updateDetails)}>
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
            <Text style={styles.markText}>
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
  AppBtn: {
    width: '100%',
    height: h('7%'),
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
    width: '30%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCC2: {
    width: '40%',
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
    height: h('60%'),
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
