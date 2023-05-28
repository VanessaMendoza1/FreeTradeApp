import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {cloneElement, useState} from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import MydealItem from '../../Components/MydealItem';
import BottomContactAdmin from '../../Components/BottomContactAdmin';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import LoadingScreen from '../../Components/LoadingScreen';

const Mydeals = ({navigation}) => {
  const [activeField, setActiveField] = React.useState('Sold');
  const [Show, setShow] = React.useState(false);
  const [sold, setSold] = React.useState([]);
  const [Bought, setBought] = React.useState([]);
  const [Trade, setTrade] = React.useState([]);
  const [loading, setloading] = React.useState(false);
  const MyData = useSelector(state => state.counter.data);
  const [deleted, setDeleted] = useState(false);
  const SoldPost = async () => {
    let SOLDDATA = [];
    const currentUserId = auth().currentUser.uid;
    await firestore()
      .collection('Sold')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().SellerID === currentUserId) {
            SOLDDATA.push(documentSnapshot.data());
          }
        });
      });

    setSold(SOLDDATA);
  };

  const BoughtData = async () => {
    let BoughtD = [];
    const currentUserId = auth().currentUser.uid;

    await firestore()
      .collection('Bought')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().BuyerID === currentUserId) {
            BoughtD.push(documentSnapshot.data());
          }
        });
      });

    setBought(BoughtD);
  };
  const TradeData = async () => {
    let TradeD = [];
    const currentUserId = auth().currentUser.uid;
    await firestore()
      .collection('Trade')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().SellerID === currentUserId) {
            TradeD.push(documentSnapshot.data());
          }
        });
      });

    setTrade(TradeD);
  };
  const deleteSold = async id => {
    setloading(true);
    firestore()
      .collection('Sold')
      .where('ItemID', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref
          .delete()
          .then(res => {
            setloading(false);
            SoldPost();
            Alert.alert('Delete successfully');
          })
          .catch(() => {
            setloading(false);
          });
      });
  };
  const deleteBought = id => {
    setloading(true);
    firestore()
      .collection('Bought')
      .where('ItemID', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref
          .delete()
          .then(res => {
            setloading(false);
            BoughtData();
            Alert.alert('Delete successfully');
          })
          .catch(() => {
            setloading(false);
          });
      });
  };
  const deleteTrade = id => {
    setloading(true);
    firestore()
      .collection('Trade')
      .where('ItemID', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot?.docs[0]?.ref
          .delete()
          .then(res => {
            setloading(false);
            setDeleted(true);
            TradeData();
            Alert.alert('Delete successfully');
          })
          .catch(() => {
            setloading(false);
          });
      });
  };
  const confirmationAlert = (type, id) =>
    Alert.alert('Delete Post', 'Do you really want to delete?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          if (type === 'Traded') {
            deleteTrade(id);
          } else if (type === 'Sold') {
            deleteSold(id);
          } else {
            deleteBought(id);
          }
        },
      },
    ]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      SoldPost();
      BoughtData();
      TradeData();
    });

    return unsubscribe;
  }, [navigation, deleted]);

  return (
    <>
      {/* <BottomContactAdmin
        visible={Show}
        onPress={() => {
          setShow(false);
        }}
      /> */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.mainContainer}>
          {/* header */}
          <View style={styles.Header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.LeftContainer}>
              {/* <Icon name="arrow-back-outline" size={30} color="#ffff" /> */}
            </TouchableOpacity>
            <View style={styles.MiddleContainer}>
              <Text style={styles.FontWork}>History</Text>
            </View>
          </View>
          {/* header */}

          {/* button Containers */}
          <View style={styles.BtnContainer}>
            {activeField === 'Sold' ? (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Sold');
                  SoldPost();
                }}
                style={styles.Btn}>
                <Text style={styles.Txt1}>Sold</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Sold');
                  SoldPost();
                }}
                style={styles.Btn2}>
                <Text style={styles.Txt2}>Sold</Text>
              </TouchableOpacity>
            )}
            <View style={styles.borderCC} />
            {activeField === 'Bought' ? (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Bought');
                  BoughtData();
                }}
                style={styles.Btn}>
                <Text style={styles.Txt1}>Bought</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Bought');
                  BoughtData();
                }}
                style={styles.Btn2}>
                <Text style={styles.Txt2}>Bought</Text>
              </TouchableOpacity>
            )}
            <View style={styles.borderCC} />
            {activeField === 'Traded' ? (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Traded');
                  TradeData();
                }}
                style={styles.Btn}>
                <Text style={styles.Txt1}>Traded</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setActiveField('Traded');
                  TradeData();
                }}
                style={styles.Btn2}>
                <Text style={styles.Txt2}>Traded</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* button Containers */}

          {activeField === 'Sold' && (
            <>
              {sold.length >= 1 ? (
                <>
                  {sold.map(item => (
                    <MydealItem
                      onPressDelete={() => {
                        confirmationAlert('Sold', item?.ItemID);
                      }}
                      Property={'Sold'}
                      deleteIcon={'delete'}
                      data={item}
                    />
                  ))}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>NO DATA</Text>
                </View>
              )}
            </>
          )}
          {activeField === 'Bought' && (
            <>
              {Bought.length >= 1 ? (
                <>
                  {Bought.map(item => (
                    <MydealItem
                      onPress={() => {
                        navigation.navigate('Review', {data: item});
                      }}
                      onPressDelete={() => {
                        confirmationAlert('Bought', item?.ItemID);
                      }}
                      Property={'Bought'}
                      iconName={'checkmark-circle'}
                      deleteIcon={'delete'}
                      iconColor={Colors.Primary}
                      data={item}
                    />
                  ))}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>NO DATA</Text>
                </View>
              )}
            </>
          )}
          {activeField === 'Traded' && (
            <>
              {Trade.length >= 1 ? (
                <>
                  {Trade.map(item => (
                    <MydealItem
                      onPress={() => {
                        navigation.navigate('Review');
                      }}
                      onPressDelete={() => {
                        confirmationAlert('Traded', item?.ItemID);
                      }}
                      Property={'Traded'}
                      iconName={'checkmark-circle'}
                      deleteIcon={'delete'}
                      iconColor={Colors.Primary}
                      deleteColor={Colors.black}
                      data={item}
                    />
                  ))}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>NO DATA</Text>
                </View>
              )}
            </>
          )}
          {activeField === 'loved' && (
            <>
              <MydealItem iconName={'heart'} iconColor={'red'} />
              <MydealItem iconName={'heart'} iconColor={'red'} />
            </>
          )}
        </View>
      )}
    </>
  );
};

export default Mydeals;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
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
  BtnContainer: {
    // backgroundColor: 'red',
    height: h('7%'),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Btn: {
    width: '22%',
    height: '75%',
    // backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn2: {
    width: '22%',
    height: '75%',
    // backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: Colors.Primary,
    // borderWidth: h('0.2%'),
  },
  Txt1: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  Txt2: {
    color: '#0009',
    fontSize: h('2%'),
  },
  borderCC: {
    borderLeftColor: '#0006',
    borderLeftWidth: h('0.2%'),
    width: h('0.5%'),
    height: '50%',
  },
  linebar: {
    width: '100%',
    borderWidth: h('0.1%'),
    borderColor: '#0006',
    alignSelf: 'center',
  },
});
