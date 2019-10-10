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

class Home extends Component {
  state = {
    isLoading: true,
    users: [],
    PressLong: "",
    backgroundColor: "",
    blocked: false
  };

  DeleteUser = () => {
    f.database()
      .ref("users")
      .child(f.auth().currentUser.uid)
      .child("deletedUsers")
      .push(this.state.PressLong);
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

  PressLong = () => {
    // console.log(this.state.PressLong);
    f.database()
      .ref("users")
      .child(this.state.PressLong)
      .once("value")
      .then(res => {
        if (res.val().authority == "block") {
          this.setState({ blocked: true });
        }
      });
  };

  blockUser = () => {
    f.database()
      .ref("users")
      .child(this.state.PressLong)
      .update({ authority: "block" })
      .then(() => {
        alert("user blocked");
        this.props.navigation.replace("Home");
      });
  };

  UnblockUser = () => {
    f.database()
      .ref("users")
      .child(this.state.PressLong)
      .update({ authority: "unblock" })
      .then(() => {
        alert("user unblocked");
        this.props.navigation.replace("Home");
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
    let filterArray = [];
    f.database()
      .ref("chats")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(res => {
          if (
            res.val().senderId == f.auth().currentUser.uid ||
            res.val().recieverId == f.auth().currentUser.uid
          ) {
            // console.log(res.val().recieverId);
            filterArray.push(res.val().recieverId);
          }
        });
      })
      .finally(() => {
        let uniqueSet = new Set(filterArray);

        let UniqueArray = [...uniqueSet];
        let DletedUserAvailable = false;

        let AllUsers = UniqueArray.filter(item => {
          return item !== f.auth().currentUser.uid;
        });

        AllUsers.map(item => {
          f.database()
            .ref("users")
            .child(item)
            .once("value")
            .then(res => {
              this.state.users.push({
                ...res.val(),
                id: res.key,
                status: false
              });
            })
            .then(() => {
              this.setState({
                isLoading: false
              });
            });
        });

        // console.log(filterArray);
      })
      .then(() => {
        this.setState({ isLoading: false });
      });

    // f.database()
    //   .ref("users")
    //   .once("value")
    //   .then(snapshot => {
    //     snapshot.forEach(res => {
    //       this.showStatus(res.key);
    //       this.state.users.push({ ...res.val(), id: res.key, status: false });
    //     });
    //     this.setState({
    //       isLoading: false
    //     });
    //   });
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
            {console.log(this.state)}
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
                    this.state.PressLong !== "" &&
                    this.props.user.user.status == "admin"
                      ? "40%"
                      : "60%"
                }}
              >
                <Text style={{ color: "black", fontSize: 22 }}>BizIntel</Text>
              </View>
              {this.state.PressLong !== "" &&
              this.props.user.user.status == "admin" ? (
                <TouchableOpacity
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    if (this.state.blocked) {
                      this.UnblockUser();
                    } else {
                      this.blockUser();
                    }
                  }}
                >
                  <Icon
                    name="block"
                    type="Entypo"
                    style={{
                      color: this.state.blocked ? "blue" : "red",
                      fontSize: 18
                    }}
                  />
                  {this.state.blocked ? (
                    <Text style={{ fontSize: 10 }}>Unblock</Text>
                  ) : (
                    <Text style={{ fontSize: 10 }}>Block</Text>
                  )}
                </TouchableOpacity>
              ) : null}
              {this.state.PressLong !== "" ? (
                <TouchableOpacity
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => this.DeleteUser()}
                >
                  <Icon
                    name="delete"
                    type="AntDesign"
                    style={{
                      color: "red",
                      fontSize: 18
                    }}
                  />
                  <Text style={{ fontSize: 10 }}>Delete</Text>
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
                          if (this.state.PressLong == "") {
                            this.setState({
                              PressLong: item.id,
                              backgroundColor: "gray"
                            });
                            this.PressLong();
                          } else {
                            this.props.navigation.replace("Home");
                          }
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

export default connect(mapStateToProps)(Home);
