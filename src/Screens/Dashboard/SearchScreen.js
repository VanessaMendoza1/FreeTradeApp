import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import ServiceItem from '../../Components/ServiceItem';
import {useSelector, useDispatch} from 'react-redux';

const SearchScreen = ({navigation}) => {
  const [activeField, setActiveField] = React.useState('Services');

  const [searchValue, setSearchValue] = React.useState('');

  const UserData = useSelector(state => state.counter.data);
  const ServiceAllData = useSelector(state => state.post.ServiceData);
  const SellingAllData = useSelector(state => state.post.SellingData);
  const TradingAllData = useSelector(state => state.post.TradingData);

  const [ServiceData, setServiceData] = React.useState(ServiceAllData);

  const [SellingData, setSellingData] = React.useState(SellingAllData);
  const [TradingData, setTradingData] = React.useState(TradingAllData);

  const searchFilter = text => {
    if (activeField === 'Services') {
      console.warn('This ran');
      const newData = ServiceData.filter(item => {
        return item.Title.toUpperCase().search(text.toUpperCase()) > -1;
      });
      if (text.trim().length === 0) {
        setServiceData(ServiceAllData);
      } else {
        setServiceData(newData);
      }
      setSearchValue(text);
    }
    if (activeField === 'Selling') {
      console.warn('This ran 2');
      const newData = SellingData.filter(item => {
        return item.Title.toUpperCase().search(text.toUpperCase()) > -1;
      });
      if (text.trim().length === 0) {
        setSellingData(SellingAllData);
      } else {
        setSellingData(newData);
      }
      setSearchValue(text);
    }
    if (activeField === 'Trading') {
      console.warn('This ran 3');
      const newData = TradingData.filter(item => {
        return item.Title.toUpperCase().search(text.toUpperCase()) > -1;
      });
      if (text.trim().length === 0) {
        setTradingData(TradingAllData);
      } else {
        setTradingData(newData);
      }
      setSearchValue(text);
    }
  };

  return (
    <View style={styles.maincontainer}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.LeftContainer}>
          <Icon name="arrow-back-outline" size={30} color="#ffff" />
        </TouchableOpacity>
        <View style={styles.Searchbox}>
          <View style={styles.leftContainer}>
            <Icon name="search" size={30} color={Colors.Primary} />
          </View>
          <TextInput
            placeholder="Search Trade / Sell"
            onChangeText={text => searchFilter(text)}
            style={styles.Txtinput}
            placeholderTextColor={Colors.Primary}
          />
        </View>
      </View>
      {/* header */}

      {/* location meter */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LocationScreen');
        }}
        style={styles.LocationMeter}>
        <View style={styles.ImgContainer2}>
          <Image
            style={{width: '70%', height: '70%', resizeMode: 'contain'}}
            source={require('../../../assets/carimg.png')}
          />
        </View>
        <Text style={styles.LondonUkText}>{UserData.location}</Text>
      </TouchableOpacity>
      {/* location meter */}

      {/* button Containers */}
      <View style={styles.BtnContainer}>
        {activeField === 'Services' ? (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Services');
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Services</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Services');
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Services</Text>
          </TouchableOpacity>
        )}
        {activeField === 'Selling' ? (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Selling');
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Selling</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Selling');
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Selling</Text>
          </TouchableOpacity>
        )}
        {activeField === 'Trading' ? (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Trading');
            }}
            style={styles.Btn}>
            <Text style={styles.Txt1}>Trading</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setActiveField('Trading');
            }}
            style={styles.Btn2}>
            <Text style={styles.Txt2}>Trading</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* button Containers */}

      {/* button Containers */}
      {activeField === 'Services' && (
        <>
          {ServiceAllData.length >= 1 ? (
            <FlatList
              data={ServiceAllData}
              contentContainerStyle={{paddingBottom: h('3%')}}
              numColumns={3}
              renderItem={({item}) => {
                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        margin: 2,
                        backgroundColor: '#fff',
                        height: h('19%'),
                      }}>
                      <ServiceItem
                        item={item}
                        onPress={() => {
                          navigation.navigate('PostScreen', {data: item});
                        }}
                      />
                    </View>
                  </>
                );
              }}
              keyExtractor={item => item.DocId}
            />
          ) : (
            <View style={styles.ViewMainFrame}>
              <Text>No search results. Please try changing your</Text>
              <Text>location to find in a different city.</Text>
            </View>
          )}
        </>
      )}
      {activeField === 'Selling' && (
        <>
          {SellingAllData.length >= 1 ? (
            <FlatList
              data={SellingAllData}
              contentContainerStyle={{paddingBottom: h('3%')}}
              numColumns={3}
              renderItem={({item, index}) => {

                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        margin: 2,
                        backgroundColor: '#fff',
                        height: h('19%'),
                      }}>
                      <ServiceItem
                        item={item}
                        onPress={() => {
                          navigation.navigate('PostScreen', {data: item});
                        }}
                      />
                    </View>
                  </>
                );
              }}
              keyExtractor={item => item.DocId}
            />
          ) : (
            <View style={styles.ViewMainFrame}>
              <Text>No search results. Please try changing your</Text>
              <Text>location to find in a different city.</Text>
            </View>
          )}
        </>
      )}
      {activeField === 'Trading' && (
        <>
          {TradingAllData.length >= 1 ? (
            <FlatList
              data={TradingAllData}
              contentContainerStyle={{paddingBottom: h('3%')}}
              numColumns={3}
              renderItem={({item}) => {
                return (
                  <>
                    <View
                      style={{
                        flex: 1,
                        margin: 2,
                        backgroundColor: '#fff',
                        height: h('19%'),
                      }}>
                      <ServiceItem
                        item={item}
                        onPress={() => {
                          navigation.navigate('PostScreen', {data: item});
                        }}
                      />
                    </View>
                  </>
                );
              }}
              keyExtractor={item => item.DocId}
            />
          ) : (
            <View style={styles.ViewMainFrame}>
              <Text>No search results. Please try changing your</Text>
              <Text>location to find in a different city.</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: Colors.Primary,
    width: '100%',
    height: h('12'),
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  Searchbox: {
    backgroundColor: 'white',
    width: '80%',
    height: '50%',
    borderRadius: h('0.5%'),
    flexDirection: 'row',
  },
  LeftContainer: {
    width: '15%',
    height: '100%',
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer: {
    width: '10%',
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Txtinput: {
    width: '90%',
    height: '100%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    fontSize: h('2%'),
    color: '#0008',
    // alignItems: 'center',
  },
  SearchText: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  LocationMeter: {
    width: '100%',
    height: h('7%'),
    // backgroundColor: 'green',
    flexDirection: 'row',
    paddingLeft: h('2%'),
    alignItems: 'center',
  },
  ImgContainer2: {
    width: '13%',
    height: '100%',
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LondonUkText: {
    color: Colors.Primary,
    fontSize: h('2%'),
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
    width: '32%',
    height: '75%',
    backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Btn2: {
    width: '32%',
    height: '75%',
    // backgroundColor: Colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Primary,
    borderWidth: h('0.2%'),
  },
  Txt1: {
    color: '#fff',
    fontSize: h('2%'),
  },
  Txt2: {
    color: Colors.Primary,
    fontSize: h('2%'),
  },
  ViewMainFrame: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
