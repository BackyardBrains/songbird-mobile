
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