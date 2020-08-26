import {MarkerData} from '../../models/mapdata';
import {EventLocation} from '../../models/location';
import {ObjectFunctions} from '../../common/object.functions';
declare var google: any;


export class GeoHelperFunctions {

    public static calculateDistance(pointA: MarkerData, pointB: MarkerData, returnMiles: boolean) {

        if (pointA.lat === undefined || pointA.lat === null ||
            pointA.lng === undefined ||  pointA.lng === null ||
            pointB.lat === undefined || pointB.lat === null ||
            pointB.lng === undefined || pointB.lng === null ) {
            console.log('geo.helper.functions.ts calculateDistance invalid coordinate');
            return NaN;
        }
        const radlat1 = Math.PI * pointA.lat / 180;
        const radlat2 = Math.PI * pointB.lat / 180;
        const radlon1 = Math.PI * pointA.lng / 180;
        const radlon2 = Math.PI * pointB.lng / 180;
        const theta = pointA.lng - pointB.lng;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;

        if (returnMiles === true) {
            dist = dist * 0.8684;
        } else {
            dist = dist * 1.609344;
        }

        return Math.ceil( dist );
    }

    public static  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
    }

    public static  DistanceBetweenEarthCoordinates(lat1, lon1, lat2, lon2, returnMiles: boolean) {
    if (lat1 === undefined || lat1 === null ||
        lon1 === undefined ||  lon1 === null ||
        lat2 === undefined || lat2 === null ||
        lon2 === undefined || lon2 === null ) {
        console.log('geo.helper.functions.ts calculateDistance invalid coordinate');
        return NaN;
    }
    const earthRadiusKm = 6371;
    const earthRadiusMiles = 3959;
    const dLat = GeoHelperFunctions.degreesToRadians(lat2 - lat1);
    const dLon = GeoHelperFunctions.degreesToRadians(lon2 - lon1);

    lat1 = GeoHelperFunctions.degreesToRadians(lat1);
    lat2 = GeoHelperFunctions.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (returnMiles === true) {
        console.log('geo.helper.functions.ts DistanceBetweenEarthCoordinates in miles');
        return earthRadiusMiles * c;
    } else {
        console.log('geo.helper.functions.ts DistanceBetweenEarthCoordinates in kilometers');
        return earthRadiusKm * c;
    }
    }

    public static GetLocationName(location: EventLocation): string {
        let locationName = '';

        if ( ObjectFunctions.isValid( location ) === false) {
            return locationName;
        }
        locationName = location.Name;

        if (ObjectFunctions.isNullOrWhitespace(location.State) === true) {
            return locationName;
        }
        locationName =  locationName + ',' + location.State;

        if (ObjectFunctions.isNullOrWhitespace(location.Country) === true) {
            return locationName;
        }
        locationName =  locationName + ',' + location.Country;
        return locationName;
    }

    /*
    For iOS you have to add this configuration to your configuration.xml file
        <edit-config file="*-Info.plist" mode="merge" target="NSLocationWhenInUseUsageDescription">
            <string>We use your location for full functionality of certain app features.</string>
        </edit-config>
    
     public  getCurrentLocation() : EventLocation {

        const location = new EventLocation();
        console.log('store-filter.ts getCurrentLocation EventLocation');
        //   this.location = new EventLocation();

        if (!navigator.geolocation ) {
                console.log('store-filter.ts getCurrentLocation returning');
            return;
        }

            // this.processing = true;
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('store-filter.ts.ts getCurrentLocation position:', position);
            location.Latitude = position.coords.latitude.toString();
            location.Longitude = position.coords.longitude.toString();
            return location;
        });
       }
*/
       /* ionic google maps
       import { Platform } from 'ionic-angular';
import {
  LocationService,
  GoogleMap,
  GoogleMapOptions,
  MyLocation
} from '@ionic-native/google-maps';

export class MapPage {

  map: GoogleMap;

  constructor(private platform: Platform) {
    this.platforms.ready(()=> {
      this.loadMap();
    });
  }
       */

    // GPS spoof check
    // First, i check mock location, like in other code here.
    // LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    // LocationListener locationListener = new MyLocationListener();
    // locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 10, locationListener);
  /*  public static  isMockLocationOn(Location location, Context context): boolean {
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            return location.isFromMockProvider();
        } else {
            String mockLocation = "0";
            try {
                mockLocation = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ALLOW_MOCK_LOCATION);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return !mockLocation.equals("0");
        }
    }

    // Second, i check running apps and services, that need permission to access mock location. And it seems work well.
    //
    public static  getListOfFakeLocationApps(Context context): List<String> {
        List<String> runningApps = getRunningApps(context, false);
        for (int i = runningApps.size() - 1; i >= 0; i--) {
            String app = runningApps.get(i);
            if(!hasAppPermission(context, app, "android.permission.ACCESS_MOCK_LOCATION")){
                runningApps.remove(i);
            }
        }
        return runningApps;
    }

    public static  getRunningApps(Context context, boolean includeSystem): List<String> {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);

        List<String> runningApps = new ArrayList<>();

        List<ActivityManager.RunningAppProcessInfo> runAppsList = activityManager.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo processInfo : runAppsList) {
            for (String pkg : processInfo.pkgList) {
                runningApps.add(pkg);
            }
        }

        try {
            //can throw securityException at api<18 (maybe need "android.permission.GET_TASKS")
            List<ActivityManager.RunningTaskInfo> runningTasks = activityManager.getRunningTasks(1000);
            for (ActivityManager.RunningTaskInfo taskInfo : runningTasks) {
                runningApps.add(taskInfo.topActivity.getPackageName());
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        List<ActivityManager.RunningServiceInfo> runningServices = activityManager.getRunningServices(1000);
        for (ActivityManager.RunningServiceInfo serviceInfo : runningServices) {
            runningApps.add(serviceInfo.service.getPackageName());
        }

        runningApps = new ArrayList<>(new HashSet<>(runningApps));

        if(!includeSystem){
            for (int i = runningApps.size() - 1; i >= 0; i--) {
                String app = runningApps.get(i);
                if(isSystemPackage(context, app)){
                    runningApps.remove(i);
                }
            }
        }
        return runningApps;
    }

    public static  isSystemPackage(Context context, String app): boolean{
        PackageManager packageManager = context.getPackageManager();
        try {
            PackageInfo pkgInfo = packageManager.getPackageInfo(app, 0);
            return (pkgInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static  hasAppPermission(Context context, String app, String permission): boolean{
        PackageManager packageManager = context.getPackageManager();
        PackageInfo packageInfo;
        try {
            packageInfo = packageManager.getPackageInfo(app, PackageManager.GET_PERMISSIONS);
            if(packageInfo.requestedPermissions!= null){
                for (String requestedPermission : packageInfo.requestedPermissions) {
                    if (requestedPermission.equals(permission)) {
                        return true;
                    }
                }
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }*/

    /* another spoof check
    //First, we can check whether MockSetting option is turned ON
public static boolean isMockSettingsON(Context context) {
    // returns true if mock location enabled, false if not enabled.
    if (Settings.Secure.getString(context.getContentResolver(),
                                Settings.Secure.ALLOW_MOCK_LOCATION).equals("0"))
        return false;
    else
        return true;
}

// Second, we can check whether are there other apps in the device,
// which are using android.permission.ACCESS_MOCK_LOCATION (Location Spoofing Apps)
public static boolean areThereMockPermissionApps(Context context) {
    int count = 0;

    PackageManager pm = context.getPackageManager();
    List<ApplicationInfo> packages =
        pm.getInstalledApplications(PackageManager.GET_META_DATA);

    for (ApplicationInfo applicationInfo : packages) {
        try {
            PackageInfo packageInfo = pm.getPackageInfo(applicationInfo.packageName,
                                                        PackageManager.GET_PERMISSIONS);

            // Get Permissions
            String[] requestedPermissions = packageInfo.requestedPermissions;

            if (requestedPermissions != null) {
                for (int i = 0; i < requestedPermissions.length; i++) {
                    if (requestedPermissions[i]
                        .equals("android.permission.ACCESS_MOCK_LOCATION")
                        && !applicationInfo.packageName.equals(context.getPackageName())) {
                        count++;
                    }
                }
            }
        } catch (NameNotFoundException e) {
            Log.e("Got exception " , e.getMessage());
        }
    }

    if (count > 0)
        return true;
    return false;
}

If both above methods, first and second are true, then there are good chances that location may be spoofed or fake.
Now, spoofing can be avoided by using Location Manager's API.
We can remove the test provider before requesting the location updates from both the providers (Network and GPS)

LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);

try {
    Log.d(TAG ,"Removing Test providers")
    lm.removeTestProvider(LocationManager.GPS_PROVIDER);
} catch (IllegalArgumentException error) {
    Log.d(TAG,"Got exception in removing test  provider");
}

lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, locationListener);

I have seen that removeTestProvider(~) works very well over Jelly Bean and onwards version.
This API appeared to be unreliable till Ice Cream Sandwich.


 just a point: in Android 6.0 ALLOW_MOCK_LOCATION is deprecated. And actually there's
 no checkbox for mock location as well. One can check if location is fake or not right from
 location object: location.isFromMockProvider()

  I used a customized combination of isMockSettingsON(),
   Location.isFromMockProvider() and areThereMockPermissionApps()
   with a black list of apps. There are a lot of preinstalled system
   apps with ACCESS_MOCK_LOCATION permission, for example on HTC and Samsung devices.
    A whitelist of all legitimate apps would be better but a black list of most popular
     location spoofing apps worked well in my case. And I also checked if the device was rooted.
    */
}
