import React from "react";

import {
  AsyncStorage,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "native-base";
import * as firebase from "firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import User from "../User";
import { Constants } from "react-native-unimodules";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    phone: "",
    name: "",
  };

  handleChange = (key) => (val) => {
    this.setState({ [key]: val });
  };

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      ToastAndroid.show("Wrong phone number", ToastAndroid.SHORT);
    } else if (this.state.name.length < 3) {
      ToastAndroid.show("Name must be Minimum 3 Character", ToastAndroid.SHORT);
    } else {
      await AsyncStorage.setItem("userPhone", this.state.phone);
      User.phone = this.state.phone;
      firebase
        .database()
        .ref("users/" + User.phone)
        .set({
          name: this.state.name,
        });
      this.props.navigation.navigate("App");
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          console.log("Keyboard Dismissed");
        }}
      >
        <SafeAreaView style={styles.screen}>
          <Image
            style={styles.logo}
            source={require("../assets/images/icon.png")}
          />
          <TextInput
            style={styles.form}
            placeholder="Phone Number"
            keyboardType="numeric"
            onChangeText={this.handleChange("phone")}
            value={this.state.phone}
          />
          <TextInput
            style={styles.form}
            placeholder="UserName"
            onChangeText={this.handleChange("name")}
            value={this.state.name}
          />
          <TouchableOpacity style={styles.button} onPress={this.submitForm}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5252",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    width: "95%",
    marginVertical: 10,
  },
  form: {
    backgroundColor: "#f8f4f4",
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    width: "95%",
    alignSelf: "center",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
