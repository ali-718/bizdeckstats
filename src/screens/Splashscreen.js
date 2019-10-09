import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import Logo from "../assets/logo.png";
import * as f from "firebase";
import { connect } from "react-redux";
import { LoginAction } from "../actions/userAction";
import { Icon, Spinner } from "native-base";

class Splashscreen extends Component {
  state = {
    isLoading: true,
    connection: ""
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        connection: "You might check your internet connection"
      });
    }, 6000);
    f.auth().onAuthStateChanged(user => {
      if (user) {
        f.database()
          .ref("users")
          .child(user.uid)
          .once("value")
          .then(item => {
            console.log(item.val());
            this.props.LoginAction(item.val());
            this.props.navigation.navigate("Home");
            clearTimeout(this.timer);
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
          <View>
            <Spinner style={{ marginTop: 20 }} color="blue" size="large" />
            <Text style={{ marginTop: 20 }}>{this.state.connection}</Text>
          </View>
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
