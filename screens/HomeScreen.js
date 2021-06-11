import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  TextSection,
} from "../styles/MessageStyle";
import User from "../User";
import * as firebase from "firebase";
import { Constants } from "react-native-unimodules";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Chats",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: User.image }}
            style={{
              height: 35,
              width: 35,
              marginLeft: 15,
              borderRadius: 50,
              borderColor: "#000",
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    users: [],
    isLoading: true,
  };

  UNSAFE_componentWillMount() {
    let dbRef = firebase.database().ref("users");
    dbRef.on("child_added", (val) => {
      let person = val.val();
      person.phone = val.key;

      //Don't show logged in user in list
      if (person.phone === User.phone) {
        User.name = person.name;
        User.image = person.image ? person.image : null;
      } else {
        this.setState((prevState) => {
          return {
            users: [...prevState.users, person],
            isLoading: false,
          };
        });
      }
    });
    this.registerForPushNotificationsAsync();
  }

  renderRow = ({ item }) => {
    return (
      <Container>
        <Card onPress={() => this.props.navigation.navigate("Chat", item)}>
          <UserInfo>
            <UserImgWrapper>
              <UserImg
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../images/student.png")
                }
              />
            </UserImgWrapper>
            <TextSection>
              <UserInfoText>
                <UserName>{item.name}</UserName>
              </UserInfoText>
            </TextSection>
          </UserInfo>
        </Card>
      </Container>
    );
  };

  registerForPushNotificationsAsync = async (currentUser) => {
    const { existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to our backend so we can use it to send pushes from there
    var updates = {};
    updates["/expoToken"] = token;
    await firebase
      .database()
      .ref("/users/" + User.phone)
      .update(updates);
    //call the push notification
  };

  render() {
    return (
      <SafeAreaView style={styles.screen}>
        {this.state.isLoading ? (
          <ActivityIndicator
            color="#000"
            style={{
              height: 80,
              width: 80,
              alignItems: "center",
              alignSelf: "center",
            }}
          />
        ) : (
          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={(item) => item.phone}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
