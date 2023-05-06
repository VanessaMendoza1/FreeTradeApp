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
    getContactUs,
    getContactUsEmail
} from "../../utils/appConfigurations"

const ContactUsScreen = ({navigation}) => {
    const [ contactUs, setContactUs ] = React.useState("")
    const [ contactUsEmail, setContactUsEmail ] = React.useState("")
    
    React.useEffect(() => {
        getContactUs(setContactUs)
        getContactUsEmail(setContactUsEmail)
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
                            <Text style={styles.FontWork}>Contact Us</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    textAlign: "center",
                    backgroundColor: "#D3D3D3",
                    marginHorizontal: 10,
                    borderRadius: 10,
                    paddingVertical: 20,
                    paddingHorizontal: 20,     
                }}>
                    <Text style={{
                        textAlign: "left",
                        fontSize: 17
                    }}>
                        {contactUs}
                    </Text>
                    <Text style={{
                        textAlign: "left",
                        fontSize: 17,
                        marginTop: 10
                    }}>
                        Email <Text style={{color: Colors.Primary}}>{contactUsEmail}</Text>
                    </Text>
                </View>
            </>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: 'white',
      paddingBottom: 100,
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
  

export default ContactUsScreen