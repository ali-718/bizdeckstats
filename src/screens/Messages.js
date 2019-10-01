import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Text,
  SafeAreaView,
  BackHandler
} from "react-native";
import { Icon, Spinner } from "native-base";
import styles from "../../constants/styles";
import * as f from "firebase";

const auth = f.auth();

export default class Messages extends React.Component {
  state = {
    messages: [],
    user: {},
    isLoading: true
  };

  componentDidMount() {
    // BackHandler.addEventListener("hardwareBackPress", () => {
    //   this.props.navigation.replace("Home");
    // });

    f.database()
      .ref("users")
      .child(auth.currentUser.uid)
      .once("value")
      .then(res => {
        this.setState({
          user: {
            _id: auth.currentUser.uid,
            name: res.val().username,
            avatar: res.val().avatar
          }
        });
      })
      .then(() => {
        this.fetchMessage();
      });

    // database.ref("chats").once("value", snapshot => {
    //   snapshot.forEach(childSnapshot => {
    //     if (
    //       (childSnapshot.val().senderId === auth.currentUser.uid &&
    //         childSnapshot.val().recieverId ===
    //           this.props.navigation.getParam("user").userId) ||
    //       (childSnapshot.val().senderId ===
    //         this.props.navigation.getParam("user").userId &&
    //         childSnapshot.val().recieverId === auth.currentUser.uid)
    //     ) {
    //       this.setState({
    //         messages: GiftedChat.append(this.state.messages, {
    //           _id: childSnapshot.key,
    //           text: childSnapshot.val().message.text,
    //           createdAt: new Date(),
    //           user: childSnapshot.val().user
    //         })
    //       });
    //     }
    //   });
    // });

    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: "Hello developer",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: "React Native",
    //         avatar: "https://placeimg.com/140/140/any"
    //       }
    //     }
    //   ]
    // });
  }

  fetchMessage = () => {
    f.database()
      .ref("chats")
      .once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          console.log(childSnapshot.val());
          if (
            (childSnapshot.val().senderId === auth.currentUser.uid &&
              childSnapshot.val().recieverId ===
                this.props.navigation.getParam("user").id) ||
            (childSnapshot.val().senderId ===
              this.props.navigation.getParam("user").id &&
              childSnapshot.val().recieverId === auth.currentUser.uid)
          ) {
            this.setState({
              messages: GiftedChat.append(this.state.messages, {
                _id: childSnapshot.key,
                text: childSnapshot.val().message.text,
                createdAt: childSnapshot.val().timeStamp,
                user: childSnapshot.val().user
              })
            });
          }
        });
        this.setState({
          isLoading: false
        });
      });
  };

  onSend(messages) {
    const OriginalMessage = Object.assign({}, messages[0]);
    const message = {
      id: OriginalMessage._id,
      text: OriginalMessage.text
    };
    f.database()
      .ref("chats")
      .push({
        message,
        senderId: auth.currentUser.uid,
        recieverId: this.props.navigation.getParam("user").id,
        user: OriginalMessage.user,
        timeStamp: new Date().getTime()
      })
      .then(() => {
        f.database()
          .ref("users")
          .child(this.props.navigation.getParam("user").id)
          .update({
            shortMessage: message.text
          });
      })
      .then(() => {
        f.database()
          .ref("chats")
          .on("child_added", snapshot => {
            snapshot.forEach(childSnapshot => {
              console.log(childSnapshot.val());
              if (
                (childSnapshot.val().senderId === auth.currentUser.uid &&
                  childSnapshot.val().recieverId ===
                    this.props.navigation.getParam("user").id) ||
                (childSnapshot.val().senderId ===
                  this.props.navigation.getParam("user").id &&
                  childSnapshot.val().recieverId === auth.currentUser.uid)
              ) {
                this.setState({
                  messages: GiftedChat.append(this.state.messages, {
                    _id: childSnapshot.key,
                    text: childSnapshot.val().message.text,
                    createdAt: childSnapshot.val().timeStamp,
                    user: childSnapshot.val().user
                  })
                });
              }
            });
          });
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.SafeArea}>
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
          <KeyboardAvoidingView
            behavior="padding"
            enabled={true}
            style={{ width: "100%", flex: 1 }}
          >
            <View
              style={{
                width: "100%",
                height: 50,
                justifyContent: "center",
                elevation: 3,
                borderBottomWidth: Platform.OS == "ios" ? 0.2 : 0,
                borderBottomColor: "gainsboro",
                borderStyle: "solid"
              }}
            >
              <View
                style={{
                  width: "90%",
                  height: 50,
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: 20
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: "20%",
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row"
                    }}
                    onPress={() => this.props.navigation.replace("Home")}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 20,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon
                        name="arrowleft"
                        type="AntDesign"
                        style={{ fontSize: 20 }}
                      />
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: "70%",
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {this.props.navigation.getParam("user").name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <GiftedChat
              messages={this.state.messages}
              showUserAvatar={true}
              onSend={messages => this.onSend(messages)}
              user={this.state.user}
            />
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }
}
