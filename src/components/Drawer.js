import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { DrawerNavigatorItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import OutStyles from "../../constants/styles";
import { connect } from "react-redux";
import { LogoutUser } from "../actions/userAction";

const LogoutButton = props => {
  props.navigation.navigate("Login");
  props.LogoutUser();
};

const NavigationOptions = props => (
  <SafeAreaView style={[OutStyles.SafeArea, { flex: 1, width: "100%" }]}>
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2,
          borderColor: "white",
          marginBottom: 20,
          backgroundColor: "white"
        }}
      >
        <Avatar
          size="large"
          rounded
          source={{
            uri: props.user.user.avatar
          }}
        />
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 20
          }}
        >
          {props.user.user.name}
        </Text>
        <Text style={{ color: "black" }}>{props.user.user.email}</Text>
        <TouchableOpacity
          onPress={() => {
            props.LogoutUser(props.navigation);
          }}
          style={{
            width: 100,
            height: 40,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          <Text style={{ color: "white" }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          //   onPress={() => props.navigation.navigate("Settings")}
          style={{
            width: 100,
            height: 40,
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          <Text style={{ color: "white" }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView style={{ flex: 1 }}>
      <DrawerNavigatorItems {...props} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  DrawerView: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderColor: "white",
    marginBottom: 20
  },
  DrawerIcon: {
    width: 24,
    height: 24,
    color: "white"
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { LogoutUser }
)(NavigationOptions);
