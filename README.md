<img src="https://img.shields.io/travis/innFactory/react-native-aws-mobile-analytics.svg"/>


# react-native-aws-mobile-analytics
A react-native module for using Amazon's AWS Mobile Analytics with the aws-sdk

Highly inspirated by the javascript version [aws-sdk-mobile-analytics-js](https://github.com/aws/aws-sdk-mobile-analytics-js)

<br/>

## Usage
Add react-native-aws-mobile-analytics
```
npm install --save react-native-aws-mobile-analytics
```

Add Permission for Network State to your `AndroidManifest.xml`
```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```


Add aws-sdk
```
npm install --save aws-sdk
```

react-native-aws-mobile-analytics needs the [react-native-device-info](https://github.com/rebeccahughes/react-native-device-info) package as dependency for an unique client id. Make sure it is correct linked. You may have to call react-native link:
```
react-native link
```

<br/>

Create file `MobileAnalytics.js` where you can do the configuration:
```javascript
import AWS from "aws-sdk/dist/aws-sdk-react-native";
import AMA from "react-native-aws-mobile-analytics";
import {
    Platform,
} from 'react-native';

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    region: 'us-east-1',
    IdentityPoolId: 'us-east-1:4c6d17ff-9eb1-4805-914d-8db8536ab130',
});


let appId_PROD = "2e9axxxxxxx742c5a35axxxxxxxxx2f";
let appId_DEV = "xxxx44be23c4xxx9xxxxxxxxxxxxx3fb";

let options = {
    appId: __DEV__?appId_DEV:appId_PROD,
    platform : Platform.OS === 'ios' ? 'iPhoneOS' : 'Android',
    //logger: console // comment in for debugging
};

const MobileAnalyticsClient  = new AMA.Manager(options);
export default MobileAnalyticsClient;
```

<br/>

Before you could send the first event you have to call `MobileAnalyticsClient.initialize(callback)` and wait for the callback. You can handle that in your root component like following:
```javascript
import React from "react";
import MobileAnalyticsClient from "./MobileAnalytics";
import SomeComponent from "./components/SomeComponent";

export default class App extends React.Component {
    constructor(){
        super();

        this.state = {
            isMobileAnalyticsLoading: true,
        };

        MobileAnalyticsClient.initialize(()=>this.setState({isMobileAnalyticsLoading: false}));
    }
    render() {
        if(this.state.isMobileAnalyticsLoading){
            return null;
        }
        return (
          <SomeComponent/>
        );
    }
};
```

<br/>

Now you are able to send event in all your components:
```javascript
import MobileAnalyticsClient from "../MobileAnalytics";


export default class SomeComponent extends Component {
    constructor() {
        super();
        // send a custom event
        MobileAnalyticsClient.recordEvent('analyticsDemo', { 'attribute_1': 'main', 'attribute_2': 'page' }, { 'metric_1': 1 });
    }
}
```

<br/>

#### Checkout the full example:
[react-native-aws-mobile-analytics-demo](https://github.com/innFactory/react-native-aws-mobile-analytics-demo)

<br/>

## Contributors

[Anton Spöck](https://github.com/spoeck)

Powered by [innFactory](https://innfactory.de/)