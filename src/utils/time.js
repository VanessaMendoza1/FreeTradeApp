import moment from 'moment-timezone';
import * as RNLocalize from "react-native-localize";

const standardTimeZone = "America/New_York"
const timeFormat = "YYYY-MM-DD HH:mm"

const getCurrentTimeStamp = () => {
    return moment().unix()
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