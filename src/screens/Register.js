import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import Logo from "../assets/logo.png";
import { Icon, Spinner } from "native-base";
import { connect } from "react-redux";
import axios from "axios";
import styles from "../../constants/styles";
import * as firebase from "firebase";
import { LoginAction } from "../actions/userAction";

class Register extends Component {
  state = {
    Email: "",
    Password: "",
    isLoading: false,
    Name: "",
    UserName: "",
    Phone: "",
    CNIC: "",
    ConfirmPassword: "",
    CompanyPin: ""
  };

  componentWillUnmount() {
    this.setState({
      Email: "",
      Password: ""
    });
  }

  Login = () => {
    if (
      this.state.Name != "" &&
      this.state.UserName != "" &&
      this.state.Email != "" &&
      this.state.Phone != "" &&
      this.state.CNIC != "" &&
      this.state.Password != "" &&
      this.state.ConfirmPassword != ""
    ) {
      if (this.state.Password === this.state.ConfirmPassword) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
          .then(user => {
            console.log(user);
            firebase
              .database()
              .ref("users")
              .child(user.user.uid)
              .set({
                name: this.state.Name,
                username: this.state.UserName,
                email: this.state.Email,
                phone: this.state.Phone,
                cnic: this.state.CNIC,
                avatar:
                  "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
              })
              .then(() => {
                axios
                  .post(
                    `http://198.37.118.15:7040/api/Task/AddUser?Name=${this.state.Name}&UserName=${this.state.UserName}&Description=&email=${this.state.Email}&expoPushToken=&ShortMsg=&cnic=${this.state.CNIC}&MobileNo=${this.state.Phone}`
                  )
                  .then(() => {
                    this.props.LoginAction({
                      name: this.state.Name,
                      username: this.state.UserName,
                      email: this.state.Email,
                      phone: this.state.Phone,
                      cnic: this.state.CNIC,
                      avatar:
                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                    });
                  });
              })
              .then(() => {
                this.props.navigation.navigate("Edit", { fromLogin: true });
              });
            alert("user added succesfully");
          })
          .catch(e => {
            alert(e);
          });
      } else {
        alert("password did'nt match");
      }
    } else {
      this.setState({
        isLoading: false
      });
      alert("Please fill all fields");
    }
  };

  render() {
    return (
      <SafeAreaView
        style={[
          {
            width: "100%",
            flex: 1,
            backgroundColor: "white"
          },
          styles.safeArea
        ]}
      >
        <View
          style={{
            width: "100%",
            height: 50,
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
              onPress={() => this.props.navigation.goBack()}
              name="ios-arrow-back"
              style={{ color: "black" }}
            />
            {/* {console.log(this.props.company)} */}
          </View>
          <View style={{ width: "80%" }}>
            <Text style={{ color: "white", fontSize: 22 }}>Reset Password</Text>
          </View>
        </View>
        {this.state.isLoading ? (
          <Spinner size="large" color="blue" />
        ) : (
          <ScrollView
            style={{
              width: "100%",
              flex: 1
            }}
          >
            <KeyboardAvoidingView
              enabled={true}
              behavior="padding"
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 50,
                marginBottom: 50
              }}
            >
              <Image source={Logo} style={{ width: 100, height: 120 }} />
              <View
                style={{ width: "100%", marginTop: 50, alignItems: "center" }}
              >
                <TextInput
                  value={this.state.Name}
                  onChangeText={val => {
                    this.setState({
                      Name: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="Name"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.UserName}
                  onChangeText={val => {
                    this.setState({
                      UserName: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="User Name"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.Email}
                  onChangeText={val => {
                    this.setState({
                      Email: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="Email"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.Phone}
                  onChangeText={val => {
                    this.setState({
                      Phone: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="Phone"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.CNIC}
                  onChangeText={val => {
                    this.setState({
                      CNIC: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="CNIC"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.Password}
                  onChangeText={val => {
                    this.setState({
                      Password: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="Password"
                  placeholderTextColor="#A9A9A9"
                />
                <TextInput
                  value={this.state.ConfirmPassword}
                  onChangeText={val => {
                    this.setState({
                      ConfirmPassword: val
                    });
                  }}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    width: "80%",
                    borderRadius: 5,
                    backgroundColor: "rgba(220,220,220,0.3)",
                    marginTop: 20,
                    height: 50,
                    fontSize: 20,
                    paddingLeft: 10
                  }}
                  placeholder="Confirm Password"
                  placeholderTextColor="#A9A9A9"
                />
              </View>
              <View
                style={{ marginTop: 20, width: "100%", alignItems: "center" }}
              >
                <TouchableOpacity
                  onPress={() => this.Login()}
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
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { LoginAction }
)(Register);
