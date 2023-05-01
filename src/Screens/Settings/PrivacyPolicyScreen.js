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

const PrivacyPolicyScreen = ({navigation}) => {
    const [ policyContent, setPolicyContent ] = React.useState("")
    
    React.useEffect(() => {
        getPolicy(setPolicyContent)
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
                            <Text style={styles.FontWork}>Privacy Policy</Text>
                        </View>
                    </View>
                </View>

                <Text style={{backgroundColor: '#eee',}}>
                    {policyContent}
                </Text>
            </>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#eee',
      paddingBottom: 50,
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
    //   backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
    },
    FontWork: {
      color: 'white',
      fontSize: h('2.4%'),
      fontWeight: 'bold',
    },
  });

export default PrivacyPolicyScreen