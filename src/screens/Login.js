import React, { Component } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { Icon, Spinner } from "native-base";
import * as Facebook from "expo-facebook";
import Logo from "../assets/logo.png";
import * as f from "firebase";
import { connect } from "react-redux";
import { LoginAction } from "../actions/userAction";

class Login extends Component {
  state = {
    Email: "",
    Password: "",
    isLoading: false
  };

  SimpleLogin = () => {
    this.setState({
      isLoading: true
    });
    f.auth()
      .signInWithEmailAndPassword(this.state.Email, this.state.Password)
      .then(user => {
        console.log(user);
        f.database()
          .ref("users")
          .child(user.user.uid)
          .once("value")
          .then(item => {
            if (item.val()) {
              console.log("res.val() is availaible");
              this.props.LoginAction(item.val());
              this.props.navigation.navigate("Edit", { fromLogin: true });
              this.setState({
                isLoading: false
              });
            } else {
              f.database()
                .ref("users")
                .child(user.user.uid)
                .set({
                  name: user.user.providerData[0].displayName,
                  email: user.user.providerData[0].email
                })
                .then(() => {
                  this.props.LoginAction(item.val());
                  console.log("res.val() not working");
                  console.log("user added succcessfully");
                  this.props.navigation.navigate("Edit");
                  this.setState({
                    isLoading: false
                  });
                });
            }
          });
      })
      .catch(e => console.log(e));
  };

  FacebookLogin = async () => {
    this.setState({
      isLoading: true
    });
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      "2262185377406886",
      { permissions: ["public_profile", "email"] }
    );

    console.log("here we go");
    if (type === "success") {
      const credentials = f.auth.FacebookAuthProvider.credential(token);

      f.auth()
        .signInWithCredential(credentials)
        .then(res => {
          console.log(res.additionalUserInfo.profile.picture.data.url);
          f.database()
            .ref("users")
            .child(res.user.uid)
            .once("value")
            .then(item => {
              if (item.val()) {
                console.log("res.val() is availaible");
                this.props.LoginAction(item.val());
                this.props.navigation.navigate("Edit", { fromLogin: true });
                this.setState({
                  isLoading: false
                });
              } else {
                f.database()
                  .ref("users")
                  .child(res.user.uid)
                  .set({
                    name: res.user.providerData[0].displayName,
                    email: res.user.providerData[0].email,
                    avatar: res.additionalUserInfo.profile.picture.data.url,
                    status: "user"
                  })
                  .then(() => {
                    this.props.LoginAction(item.val());
                    console.log("res.val() not working");
                    console.log("user added succcessfully");
                    this.props.navigation.navigate("Edit");
                    this.setState({
                      isLoading: false
                    });
                  });
              }
            });
        })
        .catch(e => console.log(e));
    }
  };

  render() {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={Logo} style={{ width: 80, height: 100 }} />
        <View style={{ width: "100%", marginTop: 50, alignItems: "center" }}>
          <TextInput
            onChangeText={val => {
              this.setState({ Email: val });
            }}
            value={this.state.Email}
            style={{
              borderWidth: 1,
              width: "80%",
              borderRadius: 5,
              backgroundColor: "rgba(220,220,220,0.3)",
              marginTop: 10,
              height: 50,
              fontSize: 20,
              paddingLeft: 10
            }}
            autoCapitalize={false}
            placeholder="Username or Email"
            placeholderTextColor="#A9A9A9"
          />
          <TextInput
            onChangeText={val => {
              this.setState({ Password: val });
            }}
            autoCapitalize={false}
            value={this.state.Password}
            style={{
              borderWidth: 1,
              width: "80%",
              borderRadius: 5,
              backgroundColor: "rgba(220,220,220,0.3)",
              marginTop: 10,
              height: 50,
              fontSize: 20,
              paddingLeft: 10
            }}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
          />
        </View>
        <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => this.SimpleLogin()}
            style={{
              backgroundColor: "#3498F1",
              width: "80%",
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
          <Text>OR</Text>
          <TouchableOpacity
            onPress={() => this.FacebookLogin()}
            style={{
              backgroundColor: "#3498F1",
              width: "80%",
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              marginTop: 10,
              flexDirection: "row"
            }}
          >
            <Icon
              name="facebook-square"
              type="FontAwesome"
              style={{ color: "white" }}
            />
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20
              }}
            >
              Continue with Facebook
            </Text>
          </TouchableOpacity>
          {this.state.isLoading ? (
            <Spinner color="blue" style={{ marginTop: 20 }} />
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { LoginAction }
)(Login);
