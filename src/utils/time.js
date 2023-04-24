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

const getCurrentLocalTime = (timestamp) => {
    const localTimeZone = RNLocalize.getTimeZone()
    return getTimeFromATimeZone(localTimeZone)
}

module.exports =  {
    getCurrentLocalTime,
    getCurrentTimeStamp
}