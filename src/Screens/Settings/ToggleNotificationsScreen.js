import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Switch,
} from 'react-native';
import React from 'react';
import {w, h} from 'react-native-responsiveness';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    areNotificationsHidden,
    toggleHideNotification,
} from "../../utils/appConfigurations"

const ToggleNotificationsScreen = ({navigation}) => {
    const [ hideNotifications, setHideNotifications ] = React.useState(false)
    
    React.useEffect(() => {
        console.log({hideNotifications})
    }, [hideNotifications])

    React.useEffect(() => {
        areNotificationsHidden(setHideNotifications)
    }, [])

    return (
        <ScrollView style={{backgroundColor: "#eee"}}>
            <>
                <View style={styles.MainContainer}>
                    <View style={styles.Header}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={styles.LeftContainer}>
                            <Icon name="arrow-back-outline" size={30} color="#eee" />
                        </TouchableOpacity>
                        <View style={styles.MiddleContainer}>
                            <Text style={styles.FontWork}>Read Notifications</Text>
                        </View>
                    </View>
                </View>
                {/* <TouchableOpacity onPress={() => toggleHideNotification(setHideNotifications)} style={{marginTop:100}}>
                    <Text style={{color: "black"}}>{String(hideNotifications)}</Text>
                </TouchableOpacity> */}
                <View style={{marginTop: h('25%')}}>
                    <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 20}}>Show Notifications</Text>
                    <View style={{alignSelf: "center", flexDirection: "row", marginTop: 10}}>
                        <Switch
                            style={{alignSelf: "center"}}
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={!hideNotifications ? Colors.Primary : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleHideNotification(setHideNotifications)}
                            value={!hideNotifications}
                        />
                        <Text style={{color: "black", textAlign: "center", paddingTop: 5, marginLeft: 10}}>{hideNotifications ? "Notifications Hidden" : "Notifications Shown"}</Text>
                    </View>
                </View>
            </>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#eee',
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
      color: '#eee',
      fontSize: h('2.4%'),
      fontWeight: 'bold',
    },
});

export default ToggleNotificationsScreen