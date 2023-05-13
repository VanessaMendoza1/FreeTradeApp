import moment from 'moment-timezone';
import * as RNLocalize from "react-native-localize";

const timeFormat = "DD-MM-YYYY  hh:mm A"

const getCurrentTimeStamp = () => {
    return moment(new Date()).unix() * 1000
}

const getTimeFromATimeZone = (timestamp, timeZone) => {
    let localTime = moment(timestamp).tz(timeZone).format(timeFormat)
    return localTime;
}

const convertToLocalTime = (timestamp) => {
    try{
        const localTimeZone = RNLocalize.getTimeZone()
        return getTimeFromATimeZone(timestamp, localTimeZone)
    } catch(err){
        console.log("TIME CONVERSION ERROR")
        console.log("the timestamp isnt a unix time")
        console.log(err)
        return "Its an Old Time Format"
    }
}

module.exports =  {
    convertToLocalTime,
    getCurrentTimeStamp
}