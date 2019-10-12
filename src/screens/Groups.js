import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Icon,
  Spinner,
  Picker
} from "native-base";
import styles from "../../constants/styles";
import * as f from "firebase";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import ModalDropdown from "react-native-modal-dropdown";

class Groups extends Component {
  state = {
    isLoading: true,
    users: [],
    PressLong: "",
    backgroundColor: ""
  };

  showStatus = id => {
    f.database()
      .ref("chats")
      .on("value", snapshot => {
        snapshot.forEach(item => {
          if (item.senderId == id) {
            console.log(item.status);
            return true;
          }
        });
      });
  };

  registerNotification = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
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

    f.database()
      .ref("users")
      .child(f.auth().currentUser.uid)
      .update({
        expoPushToken: token
      });
  };

  componentDidMount() {
    this.registerNotification();
    f.database()
      .ref("users")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(res => {
          this.showStatus(res.key);
          this.state.users.push({ ...res.val(), id: res.key, status: false });
        });
        this.setState({
          isLoading: false
        });
      });
  }

  render() {
    return (
      <SafeAreaView style={[styles.SafeArea, { width: "100%", flex: 1 }]}>
        {this.state.isLoading ? (
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner color="blue" size="large" />
          </View>
        ) : (
          <View style={{ width: "100%", flex: 1 }}>
            <View
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  onPress={() => this.props.navigation.toggleDrawer()}
                  name="ios-menu"
                  style={{ color: "black" }}
                />
              </View>
              <View
                style={{
                  width:
                    this.state.PressLong == ""
                      ? this.props.user.user.status == "admin"
                        ? "60%"
                        : "80%"
                      : this.props.user.user.status == "admin"
                      ? "40%"
                      : "60%"
                }}
              >
                <Text style={{ color: "black", fontSize: 22 }}>Groups</Text>
              </View>
              {console.log("this is group")}
              {console.log(this.props)}
              {this.state.PressLong !== "" ? (
                <TouchableOpacity
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => alert("this is user is blocked")}
                >
                  <Icon
                    name="block"
                    type="Entypo"
                    style={{ color: "red", fontSize: 18 }}
                  />
                  <Text style={{ fontSize: 10 }}>Delete</Text>
                </TouchableOpacity>
              ) : null}
              {this.props.user.user.status == "admin" ? (
                <TouchableOpacity
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  //   onPress={() => {
                  //     if (this.state.blocked) {
                  //       this.UnblockUser();
                  //     } else {
                  //       this.blockUser();
                  //     }
                  //   }}
                >
                  <Icon
                    name="plus"
                    type="AntDesign"
                    style={{
                      fontSize: 18,
                      color: "black"
                    }}
                  />
                  <Text style={{ fontSize: 10 }}>New Group</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <List style={{ marginTop: 10 }}>
                {this.state.users.map(item => {
                  if (item.id !== f.auth().currentUser.uid) {
                    return (
                      <ListItem
                        onLongPress={() => {
                          this.setState({
                            PressLong: item.id,
                            backgroundColor: "gray"
                          });
                          // alert(item.id)
                        }}
                        key={item.id}
                        onPress={() => {
                          if (this.state.PressLong == "") {
                            this.props.navigation.navigate("Chat", {
                              user: item
                            });
                          } else {
                            this.props.navigation.replace("Home");
                            this.setState({
                              PressLong: "",
                              backgroundColor: ""
                            });
                          }
                        }}
                        avatar
                      >
                        <Left>
                          <Thumbnail
                            source={{
                              uri: item.avatar
                            }}
                          />
                        </Left>
                        <Body
                          style={{
                            backgroundColor:
                              this.state.PressLong == item.id ? "grey" : ""
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{ fontWeight: this.showStatus(item.id) }}
                            note
                          >
                            {item.shortMessage}
                            {item.shortMessage.length < 35 ? "\n" : ""}
                          </Text>
                        </Body>
                        <Right
                          style={{
                            backgroundColor:
                              this.state.PressLong == item.id ? "grey" : ""
                          }}
                        >
                          <Text>3:43 pm</Text>
                        </Right>
                      </ListItem>
                    );
                  }
                })}
              </List>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Groups);
