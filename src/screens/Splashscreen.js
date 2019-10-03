import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import Logo from "../assets/logo.png";
import * as f from "firebase";
import { connect } from "react-redux";
import { LoginAction } from "../actions/userAction";
import { Icon, Spinner } from "native-base";

class Splashscreen extends Component {
  state = {
    isLoading: true
  };

  componentDidMount() {
    f.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.props.LoginAction({
          name: user.providerData[0].displayName,
          avatar: user.providerData[0].photoURL,
          email: user.providerData[0].email
        });
        f.database()
          .ref("users")
          .child(user.uid)
          .once("value")
          .then(item => {
            console.log("res.val() is availaible");
            this.props.LoginAction(item.val());
            this.props.navigation.navigate("Home");
          });
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }

  render() {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={Logo} style={{ width: 80, height: 100 }} />
        {this.state.isLoading ? (
          <Spinner style={{ marginTop: 20 }} color="blue" size="large" />
        ) : null}
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
)(Splashscreen);
