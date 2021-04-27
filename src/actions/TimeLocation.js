
// https://blog.logrocket.com/react-native-geolocation-a-complete-tutorial/



import { initLocation } from '.';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';


export const handleLocation = () => {
return async (dispatch, getState) => {
  let permission = false;
  if(Platform.OS === 'ios'){
    hasPermission = await Geolocation.requestAuthorization();
    if (permission) dispatch(getLocation());
  }
  else {
    permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        dispatch(getLocation());
    } 
    else {
        console.log('permission denied');
    }
  }
}
}

export const getLocation = () => {
return async (dispatch, getState) => {
  Geolocation.getCurrentPosition(
    (position) => {
      console.log("pos", position);
      dispatch(initLocation(position.coords));
    },
    (error) => {
      // See error code charts below.
      console.log("err", error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 30000 }
  ); 
}
}


export const toDegreesMinutesAndSeconds = (coordinate) => {
  let absolute = Math.abs(coordinate);
  let degrees = Math.floor(absolute);
  let minutesNotTruncated = (absolute - degrees) * 60;
  let minutes = Math.floor(minutesNotTruncated);
  let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return degrees + "" + minutes + seconds + "00";
}

export const convertDMS = (lat, lng) => {

  let latitude = toDegreesMinutesAndSeconds(lat);
  let latitudeCardinal = lat >= 0 ? "N" : "S";

  let longitude = toDegreesMinutesAndSeconds(lng);
  if (longitude.length === 8) longitude = '0' + longitude;
  let longitudeCardinal = lng >= 0 ? "E" : "W";

  return latitude + ":" + latitudeCardinal + ":" + longitude + ":" + longitudeCardinal;
}

export const displayGpsDMS = (inParam) => {
  let temp = inParam.split(':');
  let lat = temp[0];
  let latCard = temp[1];
  let long = temp[2];
  let longCard = temp[3];
  let arr = [];
  arr[0] = lat + " " + latCard;
  arr[1] = long + " " + longCard;
  return arr;
}

  export const convertToDisplay = ( clockStr, screenStr ) => {
  if (clockStr === "...") return clockStr;
  let returnStr = '';
  let clockArr = clockStr.split(':');
  let hour = (parseInt(clockArr[0])%12).toString();
  if (hour === "0") hour = "12";
  returnStr += hour;
  returnStr += ":" + clockArr[1] + ":" + clockArr[2] + " ";
  if (parseInt(clockArr[0]) >= 12) returnStr += "PM,  ";
  else returnStr += "AM,  ";
  if (screenStr === "deviceScreen") returnStr += '\n';
  returnStr += clockArr[3] + "/" + clockArr[4] + "/" + clockArr[5];

  return returnStr;
}


