
// https://blog.logrocket.com/react-native-geolocation-a-complete-tutorial/




import RNLocation from 'react-native-location';
import { useDispatch, useSelector } from 'react-redux';
import { initLocation } from '.';

RNLocation.configure({
  distanceFilter: 2 // number of meters you move before location updates
 })



export const handleLocation = () => {
  return async (dispatch, getState, { DeviceManager } ) => {
    let location;
    // let permission = await RNLocation.checkPermission({
    //   ios: 'whenInUse', // or 'always'
    //   android: {
    //     detail: 'coarse' // or 'fine'
    //   }
    // });

    // if(!permission) {

    //   permission = await RNLocation.requestPermission({
    //     ios: "whenInUse",
    //     android: {
    //       detail: "coarse",
    //       rationale: {
    //         title: "We need to access your location",
    //         message: "We use your location to show where you are on the map",
    //         buttonPositive: "OK",
    //         buttonNegative: "Cancel"
    //       }
    //     }
    //   })
    // }
    location = await RNLocation.getLatestLocation({timeout: 100})

    dispatch(initLocation(location));
    const locationState = getState().BLEs.location;
    console.log("location state: ", locationState);
    return location;
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


