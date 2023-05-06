import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Icon from 'react-native-vector-icons/Ionicons';
import Appbutton from '../Components/Appbutton';
import Colors from '../utils/Colors';
import { getSubscriptionTarriff } from '../Screens/Settings/SubscriptionPage'
const SubModal = ({visible, onPress, Plan}) => {

  const [businessSubscriptionPricing, setBusinessSubscriptionPricing] = React.useState(9.99)
  const [individualSubscriptionPricing, setIndividualSubscriptionPricing] = React.useState(1.99)
  React.useEffect(() => {
    getSubscriptionTarriff(setIndividualSubscriptionPricing, setBusinessSubscriptionPricing)
  }, [])

  return (
    <>
      {visible ? (
        <View style={[styles.mainContainer]}>
          <View
            style={[
              styles.BottomModal,
              {height: Plan === 'Personal' ? h('35%') : h('55%')},
            ]}>
            <Text style={styles.Contran}>
              {Plan === 'Personal' ? 'Personal Plan' : 'Business Plan'}
            </Text>
            <Text style={styles.Contran2}>
              {Plan === 'Personal' ? `${individualSubscriptionPricing}/Month` : `${businessSubscriptionPricing}/Month`}
            </Text>
            {/* abc */}
            {Plan === 'Personal' && (
              <View style={[styles.SqBook, {marginBottom: h('5%')}]}>
                <View style={styles.leftSQ}>
                  <Image
                    style={{width: '70%', height: '70%', resizeMode: 'contain'}}
                    source={require('../../assets/csq.png')}
                  />
                </View>
                <View style={styles.leftSQ2}>
                  <Text style={styles.SSQ1}>
                    Buy, sell or trade with each other.
                  </Text>
                  <Text style={styles.SSQ1}>No extra charges.</Text>
                </View>
              </View>
            )}
            {Plan != 'Personal' && (
              <>
                <View style={[styles.SqBook, {marginBottom: h('3.5%')}]}>
                  <View style={styles.leftSQ}>
                    <Image
                      style={{
                        width: '70%',
                        height: '70%',
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/csq.png')}
                    />
                  </View>
                  <View style={styles.leftSQ2}>
                    <Text style={styles.SSQ1}>
                      Get noticed by posting pictures
                    </Text>
                    <Text style={styles.SSQ1}>
                      or videos on Ads & increase your
                    </Text>
                    <Text style={styles.SSQ1}>sales locally.</Text>
                  </View>
                </View>
                <View style={[styles.SqBook, {marginBottom: h('3%')}]}>
                  <View style={styles.leftSQ}>
                    <Image
                      style={{
                        width: '70%',
                        height: '70%',
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/csq.png')}
                    />
                  </View>
                  <View style={styles.leftSQ2}>
                    <Text style={styles.SSQ1}>
                      No other Ads will play on your posts.
                    </Text>
                  </View>
                </View>
                <View style={[styles.SqBook, {marginBottom: h('3%')}]}>
                  <View style={styles.leftSQ}>
                    <Image
                      style={{
                        width: '70%',
                        height: '70%',
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/csq.png')}
                    />
                  </View>
                  <View style={styles.leftSQ2}>
                    <Text style={styles.SSQ1}>
                      Your business profile includes all
                    </Text>
                    <Text style={styles.SSQ1}>
                      your information & your inventory.
                    </Text>
                  </View>
                </View>
                <View style={[styles.SqBook, {marginBottom: h('5%')}]}>
                  <View style={styles.leftSQ}>
                    <Image
                      style={{
                        width: '70%',
                        height: '70%',
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/csq.png')}
                    />
                  </View>
                  <View style={styles.leftSQ2}>
                    <Text style={styles.SSQ1}>
                      Free marketing on social media &
                    </Text>
                    <Text style={styles.SSQ1}>marketing material.</Text>
                  </View>
                </View>
              </>
            )}

            {/* abc */}

            <Appbutton onPress={onPress} text={'Get Started'} />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default SubModal;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0006',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10000,
    alignItems: 'center',
  },
  BottomModal: {
    width: '95%',
    height: h('45%'),
    backgroundColor: 'white',
    borderRadius: h('1%'),
    alignItems: 'center',
  },
  ImgCC: {
    // backgroundColor: 'red',
    width: '30%',
    height: '35%',
    alignSelf: 'center',
    marginTop: h('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconC: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  Contran: {
    color: Colors.Primary,
    fontSize: h('3%'),
    alignSelf: 'center',
    marginTop: h('3%'),
  },
  Contran2: {
    color: '#000',
    fontSize: h('2.2%'),
    alignSelf: 'center',
    marginTop: h('1%'),
    marginBottom: h('5%'),
  },
  SqBook: {
    // backgroundColor: 'red',
    width: '90%',
    height: '7%',
    flexDirection: 'row',
    marginBottom: h('1%'),
  },
  leftSQ: {
    // backgroundColor: 'gold',
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSQ2: {
    // backgroundColor: 'green',
    width: '75%',
    height: '100%',
    justifyContent: 'center',
  },
  SSQ1: {
    color: '#0008',
    fontSize: h('1.8%'),
  },
});
