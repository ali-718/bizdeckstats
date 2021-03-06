import React, { Component } from "react";
import { Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import Login from "./src/screens/Login";
import "./config/config";
import Edit from "./src/screens/Edit";
import Home from "./src/screens/Home";
import NavigationOptions from "./src/components/Drawer";
import Messages from "./src/screens/Messages";
import { Provider } from "react-redux";
import store from "./store";
import Splashscreen from "./src/screens/Splashscreen";
import Settings from "./src/screens/Settings";
import Complain from "./src/screens/Complain";
import ComplainStatus from "./src/screens/ComplainStatus";
import AllUsers from "./src/screens/AllUsers";
import Groups from "./src/screens/Groups";
import Register from "./src/screens/Register";
import HomeChart from "./src/screens/HomeChart";

export default class App extends Component {
  render() {
    return <HomeChart />;
  }
}

const Stack = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Edit: {
      screen: Edit
    },
    Home: {
      screen: Home
    },
    Chat: {
      screen: Messages
    },
    Splashscreen: {
      screen: Splashscreen
    },
    Settings: {
      screen: Settings
    },
    Complain: {
      screen: Complain
    },
    ComplainStatus: {
      screen: ComplainStatus
    },
    AllUser: {
      screen: AllUsers
    },
    Groups: {
      screen: Groups
    },
    Register: {
      screen: Register
    }
  },
  {
    headerMode: "none",
    initialRouteName: "Splashscreen"
  }
);

const Drawer = createDrawerNavigator(
  {
    Stack: {
      screen: Stack
    }
  },
  {
    contentComponent: NavigationOptions,
    contentOptions: {
      activeTintColor: "#232667",
      inactiveTintColor: "black",
      activeBackgroundColor: "rgba(0,0,0,0)",
      inactiveBackgroundColor: "rgba(0,0,0,0)"
    }
  }
);

const MainNav = createAppContainer(Drawer);
