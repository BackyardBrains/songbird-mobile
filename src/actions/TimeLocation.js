
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

  const convertToDisplay = ( clockStr, screenStr ) => {
  if (clockStr === "...") return clockStr;
  let returnStr = '';
  let clockArr = clockStr.split(':');
  returnStr += (parseInt(clockArr[0])%12).toString();
  returnStr += ":" + clockArr[1] + ":" + clockArr[2] + " ";
  if (parseInt(clockArr[0]) >= 12) returnStr += "PM,  ";
  else returnStr += "AM,  ";
  if (screenStr === "deviceScreen") returnStr += '\n';
  returnStr += clockArr[3] + "/" + clockArr[4] + "/" + clockArr[5];

  return returnStr;
}
export default convertToDisplay;