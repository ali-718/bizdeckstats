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

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainNav />
      </Provider>
    );
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
