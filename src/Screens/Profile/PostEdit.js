import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import CheckBox from '@react-native-community/checkbox';
import Appbutton from '../../Components/Appbutton';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useSelector, useDispatch} from 'react-redux';
import {
  PostAdd,
  TradingAdd,
  SellingAdd,
  ServiceAdd,
} from '../../redux/postSlice';
import LoadingScreen from '../../Components/LoadingScreen';
import database from '@react-native-firebase/database';

const PostEdit = ({navigation, route}) => {
  console.warn(route.params.data.PostType === 'Trading');
  const dispatch = useDispatch();

  const [toggleCheckBox, setToggleCheckBox] = React.useState(
    route.params.data.PostType === 'Service' ? true : false,
  );
  const [toggleCheckBox2, setToggleCheckBox2] = React.useState(
    route.params.data.PostType === 'Selling' ? true : false,
  );
  const [toggleCheckBox3, setToggleCheckBox3] = React.useState(true);
  const [toggleCheckBox4, setToggleCheckBox4] = React.useState(
    route.params.data.PostType === 'Trading' ? true : false,
  );

  const [Title, setTitle] = React.useState(route.params.data.Title);
  const [Discount, setDiscount] = React.useState(route.params.data.Discount);
  const [Price, setPrice] = React.useState(route.params.data.Price);
  const [Description, setDescription] = React.useState(
    route.params.data.Description,
  );
  const [loading, setloading] = React.useState(false);

  const updatePost = () => {
    setloading(true);
    firestore()
      .collection('Post')
      .where('DocId', '==', route.params.data.DocId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            Title: Title,
            Discount: Discount,
            Price: Price,
            Description: Description,
            PostType: toggleCheckBox
              ? 'Service'
              : toggleCheckBox4
              ? 'Trading'
              : 'Selling',
          });
          //not doc.update({foo: "bar"})

          allmypost();

          //
        });
      });
  };

  const DeletePost = () => {
    setloading(true);
    firestore()
      .collection('Post')
      .doc(route.params.data.DocId)
      .delete()
      .then(() => {
        allmypost();
      })
      .catch(error => {
        console.error('Error removing document: ', error);
        setloading(false);
      });
  };

  const allmypost = async () => {
    let SellingData = [];
    let TradingData = [];
    let ServiceData = [];
    await firestore()
      .collection('Post')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().status === false) {
            if (documentSnapshot.data().PostType === 'Trading') {
              TradingData.push(documentSnapshot.data());
            }
            if (documentSnapshot.data().PostType === 'Selling') {
              SellingData.push(documentSnapshot.data());
            }
            if (documentSnapshot.data().PostType === 'Service') {
              ServiceData.push(documentSnapshot.data());
            }
          }
        });
      });

    await dispatch(SellingAdd(SellingData));
    await dispatch(TradingAdd(TradingData));
    await dispatch(ServiceAdd(ServiceData));
    alert('Done');
    setloading(false);
    navigation.navigate('Profile');
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView>
          <View style={styles.mainContainer}>
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
                <Text style={styles.FontWork}>Edit</Text>
              </View>
            </View>
            {/* header */}

            <View style={styles.Container}>
              {/* btn */}
              <View style={styles.CheckboxContainer}>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(false);
                      setToggleCheckBox4(false);
                      setToggleCheckBox(newValue);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Service</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox2}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox2(newValue);
                      setToggleCheckBox(false);
                      setToggleCheckBox4(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Selling</Text>
                </View>
                <View style={styles.RemeberMebOx}>
                  <CheckBox
                    value={toggleCheckBox4}
                    style={{width: 20, height: 20}}
                    onValueChange={newValue => {
                      setToggleCheckBox4(newValue);
                      setToggleCheckBox(false);
                      setToggleCheckBox2(false);
                    }}
                    tintColors={{true: Colors.Primary}}
                    onTintColor={'#0002'}
                  />
                  <Text style={styles.RemebermeText}>Trading</Text>
                </View>
              </View>
              {/* btn */}
              <Text style={styles.ImgVides}>Edit Details</Text>

              <TextInput
                style={styles.inputTxtC}
                placeholder={'Title'}
                value={Title}
                onChangeText={e => {
                  setTitle(e);
                }}
                placeholderTextColor={Colors.Primary}
              />

              {toggleCheckBox2 && (
                <TextInput
                  style={styles.inputTxtC2}
                  placeholder={'Discount (Optional)'}
                  placeholderTextColor={'#FF2D2D'}
                  value={Discount}
                  keyboardType={'number-pad'}
                  onChangeText={e => {
                    setDiscount(e);
                  }}
                />
              )}
              {toggleCheckBox2 && (
                <TextInput
                  style={styles.inputTxtC}
                  placeholder={'Price (Optional)'}
                  value={Price}
                  keyboardType={'number-pad'}
                  onChangeText={e => {
                    setPrice(e);
                  }}
                  placeholderTextColor={Colors.Primary}
                />
              )}

              <TextInput
                style={styles.inputTxtC3}
                placeholder={'Description'}
                value={Description}
                placeholderTextColor={Colors.Primary}
                multiline={true}
                onChangeText={e => {
                  setDescription(e);
                }}
              />

              <View style={styles.Btncc}>
                <Appbutton
                  onPress={() => {
                    updatePost();
                  }}
                  text={'Submit'}
                />
              </View>
              <View style={styles.Btncc2}>
                <Appbutton
                  Deletes
                  onPress={() => {
                    DeletePost();
                  }}
                  text={'Delete'}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default PostEdit;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: h('110%'),
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
    fontSize: h('2.7%'),
    fontWeight: 'bold',
  },
  RemeberMebOx: {
    width: '35%',
    height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RemeberMebOx2: {
    width: '100%',
    height: '10%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  CheckboxContainer: {
    width: '85%',
    height: h('5%'),
    flexDirection: 'row',
    marginTop: h('3%'),
    // backgroundColor: 'red',
  },
  CheckboxContainer2: {
    width: '60%',
    height: h('5%'),
    flexDirection: 'row',

    // backgroundColor: 'red',
  },
  Container: {
    width: '90%',
    height: '100%',
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  RemebermeText: {
    color: '#0008',
    fontSize: h('2.2%'),
    marginLeft: h('1%'),
    marginLeft: h('1%'),
  },
  ImgVid: {
    // backgroundColor: 'red',
    width: '100%',
    height: h('10%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h('1%'),
  },
  VideCC: {
    backgroundColor: '#0003',
    width: '100%',
    height: h('20%'),

    marginTop: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
  },
  ImgVides: {
    fontSize: h('2%'),
    fontWeight: 'bold',
    color: '#0008',
    marginTop: h('2%'),
    marginBottom: h('1%'),
  },
  imgContainers: {
    width: '30%',
    height: '100%',
    backgroundColor: '#0003',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: h('1%'),
  },
  inputTxtC: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'red',
    marginTop: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    color: '#000',
    fontSize: h('2%'),
    paddingLeft: h('1%'),
  },
  inputTxtC3: {
    width: '100%',
    height: h('15%'),
    // backgroundColor: 'red',
    marginTop: h('2%'),
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
    color: '#000',
    fontSize: h('2%'),
    paddingLeft: h('1%'),
  },
  inputTxtC2: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'red',
    marginTop: h('2%'),
    borderColor: '#FF2D2D',
    borderWidth: h('0.2%'),
    color: '#FF2D2D',
    fontSize: h('2%'),
    paddingLeft: h('1%'),
  },
  Btncc: {
    width: '100%',
    height: h('10%'),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btncc2: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
