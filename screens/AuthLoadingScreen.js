import React from "react";
import { ActivityIndicator, AsyncStorage, StatusBar, View } from "react-native";
import User from "../User";
import * as firebase from "firebase";

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  UNSAFE_componentWillMount() {
    //Initialize Firebase
    const config = {
      apiKey: "AIzaSyAnUayOcStysO0cVcpjJqvDDILKjnpimIs",
      authDomain: "chat-app-1701f.firebaseapp.com",
      databaseURL: "https://chat-app-1701f-default-rtdb.firebaseio.com",
      projectId: "chat-app-1701f",
      storageBucket: "chat-app-1701f.appspot.com",
      messagingSenderId: "669375410878",
      appId: "1:669375410878:web:f45390f0cce61c6760a4ef",
    };
    firebase.initializeApp(config);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem("userPhone");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? "App" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
