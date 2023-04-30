import firestore from '@react-native-firebase/firestore'

const dataTypeForBusinessSubscriptionCharges = "BusinessSubscriptionTariff"
const dataTypeForIndividualSubscriptionTariff = "IndividualSubscriptionTariff"
const dataTypeForTermsAndConditions = "TermsAndConditions"
const dataTypeForPolicy = "Policy"
const dataTypeForAboutUs = "AboutUs"
const dataTypeForContactUsNumber = "ContactUsNumber"

const getConfigurations = (dataType, callback) => {
    firestore()
        .collection('AppConfigurations')
        .where('dataType', '==', dataType)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                callback(documentSnapshot.data().value);
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
const getContactUs = (callback) => getConfigurations(dataTypeForContactUsNumber, callback)

export {
    getBusinessSubscriptionCharges,
    getIndividualSubscriptionTariff,
    getTermsAndConditions,
    getPolicy,
    getAboutUs,
    getContactUs,
}