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
  Spinner
} from "native-base";
import styles from "../../constants/styles";
import * as f from "firebase";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

class Home extends Component {
  state = {
    isLoading: true,
    users: []
  };

  showStatus = id => {
    f.database()
      .ref("chats")
      .on("value", snapshot => {
        snapshot.forEach(item => {
          if (item.senderId == id) {
            console.log(item.status);
            return true;
          } else {
            console.log("nothing found");
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
                  name="bars"
                  type="FontAwesome5"
                  style={{ color: "black" }}
                />
              </View>
              <View style={{ width: "80%" }}>
                <Text style={{ color: "black", fontSize: 22 }}>BizIntel</Text>
              </View>
            </View>
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <List style={{ marginTop: 10 }}>
                {this.state.users.map(item => {
                  if (item.id !== f.auth().currentUser.uid) {
                    return (
                      <ListItem
                        key={item.id}
                        onPress={() =>
                          this.props.navigation.navigate("Chat", {
                            user: item
                          })
                        }
                        avatar
                      >
                        <Left>
                          <Thumbnail
                            source={{
                              uri: item.avatar
                            }}
                          />
                        </Left>
                        <Body>
                          <Text style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{ fontWeight: this.showStatus(item.id) }}
                            note
                          >
                            {item.shortMessage}
                          </Text>
                        </Body>
                        <Right>
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
