
// https://blog.logrocket.com/react-native-geolocation-a-complete-tutorial/

const permissionHandle = async () => {
    console.log('here')
 
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    });
 
    return permission;
}



import { useDispatch, useSelector } from 'react-redux';
import { initLocation } from '../actions';

export const handleLocation = async () => {
  let location;
  let permission = await RNLocation.checkPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'coarse' // or 'fine'
    }
  });

  if(!permission) {

    permission = await RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse",
        rationale: {
          title: "We need to access your location",
          message: "We use your location to show where you are on the map",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    })
  }
  location = await RNLocation.getLatestLocation({timeout: 100})

  const dispatch = useDispatch();
  dispatch(initLocation(location));
  const locationState = useSelector(state => state.BLEs.location);
  console.log("location state: ", locationState);
  return location;
}