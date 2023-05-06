import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    getBusinessSubscriptionCharges,
    getIndividualSubscriptionTariff,
    getTermsAndConditions,
    getPolicy,
    getAboutUs,
} from "../../utils/appConfigurations"

const TermsAndConditionsScreen = ({navigation}) => {
    const [ termsAndConditionsContent, setTermsAndConditionsContent ] = React.useState("")
    console.log({termsAndConditionsContent})
    React.useEffect(() => {
        getTermsAndConditions(setTermsAndConditionsContent)
    }, [])

    return (
        <ScrollView>
            <>
                <View style={styles.MainContainer}>
                    <View style={styles.Header}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={styles.LeftContainer}>
                            <Icon name="arrow-back-outline" size={30} color="#ffff" />
                        </TouchableOpacity>
                        <View style={styles.MiddleContainer}>
                            <Text style={styles.FontWork}>Terms And Conditions</Text>
                        </View>
                    </View>
                </View>
                
                <View style={{
                    textAlign: "center",
                    backgroundColor: "#eee",
                    marginHorizontal: 10,
                    // borderRadius: 10,
                    // paddingVertical: 20,
                    paddingHorizontal: 20,     
                }}>
                    <Text style={{backgroundColor: '#eee',}}>
                        {termsAndConditionsContent}
                    </Text>
                </View>
            </>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#eee',
      paddingBottom: 30,
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
  });

export default TermsAndConditionsScreen