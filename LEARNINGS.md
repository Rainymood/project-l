# Learnings

## By default children are only as wide as they need to be

![](./doc/img4.png)

Here I tried to put `HomeScreen` in `Container` and the `HomeScreen`
component, although it has `flex: 1` it takes exactly the space it needs.

## Padding vs Margin

* **Padding** is the amount between the content and the border
* **Margin** is the amount between two elements

This is with a border but with no margin and no padding. 

![](./doc/img5-padding.png)

## Standing on the shoulders of giants

![](./doc/img7.png)


```
 ~/Documents/Projects/project-l   master 
 ➜  npm install --save react-google-calendar-api

Unhandled rejection Error: EACCES: permission denied, open '/Users/janmeppe/.npm/_cacache/index-v5/39/a3/7b117305bfc1aab7888d1946886be59b861a011320712db72a490298c163'

npm ERR! cb() never called!

npm ERR! This is an error with npm itself. Please report this error at:
npm ERR!     <https://npm.community>

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/janmeppe/.npm/_logs/2020-07-07T10_56_42_387Z-debug.log
```

I know I tried this before 

```
sudo npm install --unsafe-perm=true --allow-root
```

Let's try clearing the cache found [here](https://stackoverflow.com/questions/50639690/on-npm-install-unhandled-rejection-error-eacces-permission-denied)

```
sudo npm cache clean --force --unsafe-perm
```

Big oof

```
npm WARN using --force I sure hope you know what you are doing.
```

That seemed to fix the issue.

## Setting up Oauth2 is a ... ....! 

What a hassle... geez ... 

struggling with this

https://developers.google.com/calendar

https://developers.google.com/calendar/auth

>Every request your application sends to the Google Calendar API must include an authorization token. The token also identifies your application to Google. 

I guess that we are forced to use this. 

I went here https://developers.google.com/calendar/quickstart/js

And clicked on these two buttons which gave me my credentials ... 

![](./doc/img8.png)

## You need a `apiGoogleconfig.json` 

OK That is fine. You need to have this file in your directory with the credentials. 

Make sure you have a file `apiGoogleconfig.json` with this structure

```json
{
    "clientId": "<CLIENT_ID>",
    "apiKey": "<API_KEY>",
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
}
```

# In classes you don't need the `function` keyword

```js

import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from 'react-google-calendar-api';

export default class DoubleButton extends React.Component {

    ...

    // wrong
    function handleItemClick(event, name) { 
        ...
      }

    // right
    handleItemClick(event, name) {
        ...
      }
    }
```


# "JSX expressions must have one parent element.ts(2657)" ?

JSX expressions must have one parent element.ts(2657)

What this means is that your `return` function must return ONE thing and not two like here

```js
return () {
    <button onClick={(e) => this.handleItemClick(e, 'sign-in')} > sign-in </button>
    <button onClick={(e) => this.handleItemClick(e, 'sign-out')} > sign-out </button>
}
```

Wrap it in a `<View>`? 


# Instance.render is not a function 

Nailed it. You called the function `return` not `render` nice. 

```js
return() { 
    <View>
        <button onClick={(e) => this.handleItemClick(e, 'sign-in')}> sign-in </button>
        <button onClick={(e) => this.handleItemClick(e, 'sign-out')}> sign-out </button>
    </View>;
}
```

# Error: this.gapi not defined

So basically `this.gapi` is not defined. It is initialised as `null` but doesn't get defined. 

```js
ApiCalendar {
  "calendar": "primary",
  "createEvent": [Function bound createEvent],
  "createEventFromNow": [Function bound createEventFromNow],
  "gapi": undefined,
  "handleAuthClick": [Function bound handleAuthClick],
  "handleSignoutClick": [Function bound handleSignoutClick],
  "initClient": [Function bound initClient],
  "listUpcomingEvents": [Function bound listUpcomingEvents],
  "listenSign": [Function bound listenSign],
  "onLoad": [Function bound onLoad],
  "onLoadCallback": [Function anonymous],
  "setCalendar": [Function bound setCalendar],
  "sign": false,
  "updateSigninStatus": [Function bound updateSigninStatus],
}
```

Logging `ApiCalendar` gives the following thing. 

I found this quote "You should change your onload call to addEventListener('load', callback);" here 
https://stackoverflow.com/questions/51977448/how-to-use-gapi-in-react

And looking in the source code we find this

```js
    handleClientLoad() {
        this.gapi = window['gapi'];
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        script.onload = () => { // ONLOAD! 
            window['gapi'].load('client:auth2', this.initClient);
        };
    }
```

Note that the current package that I'm using is `react-google-calendar-api` and **not** `react-native-google-calendar-api`

This is the same function but in a native port

```js

  /**
   * Init Google Api
   * And create gapi in global
   */
  handleClientLoad() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    script.onload = () => {
      window.gapi.load('client:auth2', this.initClient);
    };
  }
```

So it indeed is a bit different. 

## initClient() in react-native port

```js
 /**
   * Auth to the google Api.
   */
  initClient() {
    this.gapi = window['gapi'];
    this.gapi.client.init(Config).then(() => {
      // Listen for sign-in state changes.
      this.gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(this.updateSigninStatus);
      // Handle the initial sign-in state.
      this.updateSigninStatus(
        this.gapi.auth2.getAuthInstance().isSignedIn.get(),
      );
      if (this.onLoadCallback) {
        this.onLoadCallback();
      }
    });
  }
```

## initClient() in react port

```js
    /**
     * Auth to the google Api.
     */
    initClient() {
        this.gapi = window['gapi'];
        this.gapi.client.init(Config)
            .then(() => {
            // Listen for sign-in state changes.
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
            if (this.onLoadCallback) {
                this.onLoadCallback();
            }
        })
            .catch((e) => {
            console.log(e);
        });
    }
```

