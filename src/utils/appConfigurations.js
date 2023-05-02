import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
const dataTypeForBusinessSubscriptionCharges = "BusinessSubscriptionTariff"
const dataTypeForIndividualSubscriptionTariff = "IndividualSubscriptionTariff"
const dataTypeForTermsAndConditions = "TermsAndConditions"
const dataTypeForPolicy = "Policy"
const dataTypeForAboutUs = "AboutUs"
const dataTypeForContactUs = "ContactUs"

const getConfigurations = (dataType, callback) => {
    firestore()
        .collection('AppConfigurations')
        .where('dataType', '==', dataType)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                let content = documentSnapshot.data().value
                let contentWithLineBreaks = content.replaceAll("#NEW_LINE", "\n")
                console.log({contentWithLineBreaks})
                callback(contentWithLineBreaks);
                return
            });
        })
        .catch((err) => {
            console.log("Caught error while pulling app configuration")
            console.log(err)
        })
}

const getBusinessSubscriptionCharges = (callback) => getConfigurations(dataTypeForBusinessSubscriptionCharges, callback)
const getIndividualSubscriptionTariff = (callback) => getConfigurations(dataTypeForIndividualSubscriptionTariff, callback)
const getTermsAndConditions = (callback) => getConfigurations(dataTypeForTermsAndConditions, callback)
const getPolicy = (callback) => getConfigurations(dataTypeForPolicy, callback)
const getAboutUs = (callback) => getConfigurations(dataTypeForAboutUs, callback)
const getContactUs = (callback) => getConfigurations(dataTypeForContactUs, callback)

const areNotificationsHidden = (callback) => {
    let currentUserId = auth().currentUser.uid
    firestore()
        .collection('Users')
        .doc(currentUserId)
        .get()
        .then(documentSnapshot => {
            if (documentSnapshot.exists) {
                if (documentSnapshot.data().hideNotifications && documentSnapshot.data().hideNotifications == true){
                    callback(true)
                }
            }
        })
        .catch(err => {
            console.warn(err);
        });
        
}

const toggleHideNotification = (callback) => {
    let currentUserId = auth().currentUser.uid
    console.log({currentUserId})
    firestore()
        .collection('Users')
        .doc(currentUserId)
        .get()
        .then(documentSnapshot => {
            console.log("1")
            if (documentSnapshot.exists) {
                console.log("2")
                let hideNotifications
                if (documentSnapshot.data().hideNotifications && documentSnapshot.data().hideNotifications == true){
                    console.log("3")
                    hideNotifications = false
                } else {
                    console.log("4")
                    hideNotifications = true
                }

                firestore()
                    .collection('Users')
                    .doc(currentUserId)
                    .update("hideNotifications", hideNotifications)
                    .then((_) => callback(hideNotifications))
                    .catch(err => {
                        console.warn(err);
                    });
                
            }
        })
        .catch(err => {
            console.warn(err);
        });
      
}

export {
    getBusinessSubscriptionCharges,
    getIndividualSubscriptionTariff,
    getTermsAndConditions,
    getPolicy,
    getAboutUs,
    getContactUs,
    areNotificationsHidden,
    toggleHideNotification
}