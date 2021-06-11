import React from "react";
import {
  ActivityIndicator,
  ToastAndroid,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import ImagePicker from "react-native-image-picker/lib/commonjs";
import User from "../User";
import { Container, Button } from "native-base";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerAlign: "center",
    title: "Profile",
  };

  state = {
    name: User.name,
    imageSource: User.image
      ? { uri: User.image }
      : require("../images/student.png"),
    upload: false,
  };

  handleChange = (key) => (value) => {
    this.setState({
      [key]: value,
    });
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      ToastAndroid.show("Inavalid Name", ToastAndroid.SHORT);
    }
    if (User.name !== this.state.name) {
      User.name = this.state.name;
      this.updateUser();
    }
  };

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: "photo",
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: "images",
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        this.setState(
          {
            upload: true,
            imageSource: { uri: response.uri },
          },
          this.uploadFile
        );
      }
    });
  };

  updateUser = () => {
    firebase.database().ref("users").child(User.phone).set(User);
    Alert.alert("Success", "Successfully saved.");
  };

  updateUserImage = (imageUrl) => {
    User.image = imageUrl;
    this.updateUser();
    this.setState({ upload: false, imageSource: { uri: imageUrl } });
  };

  uploadFile = async () => {
    const file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile_pictures/${User.phone}.png`)
      .put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => this.updateUserImage(url))
      .catch((error) => {
        this.setState({
          upload: false,
          imageSource: require("../images/student.png"),
        });
        ToastAndroid.show("Error on upload image", ToastAndroid.SHORT);
      });
  };

  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error("Error on upload image"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  render() {
    return (
      <Container style={styles.screen}>
        <View style={{ alignSelf: "center", marginBottom: 15, marginTop: 60 }}>
          <TouchableOpacity
            style={styles.profileImg}
            onPress={this.changeImage}
          >
            {this.state.upload ? (
              <ActivityIndicator
                color="#000"
                style={{
                  height: 80,
                  width: 80,
                  flex: 1,
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              />
            ) : (
              <Image style={styles.logo} source={this.state.imageSource} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Mobile Number : {User.phone} </Text>
        <TextInput
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange("name")}
          placeholder="Change Name"
        />
        <Button success onPress={this.changeName} style={styles.btn}>
          <Text>Change Name</Text>
        </Button>
        <Button danger onPress={this._logOut} style={styles.btn}>
          <Text>LogOut</Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileImg: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  logo: {
    flex: 1,
    height: 150,
    width: 150,
    borderRadius: 150,
    borderColor: "#000",
    borderWidth: 3,
  },
  input: {
    backgroundColor: "#f8f4f4",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    width: "80%",
    alignSelf: "center",
  },
  text: {
    fontSize: 15,
    alignSelf: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  btn: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    width: "80%",
    marginBottom: 15,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation: 0,
  },
});
