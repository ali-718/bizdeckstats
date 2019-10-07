import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image
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
import Pending from "../assets/alarm-clock.png";

export default class ComplainStatus extends Component {
  state = {
    isLoading: false
  };

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
                  name="ios-menu"
                  style={{ color: "black" }}
                />
              </View>
              <View style={{ width: "80%" }}>
                <Text style={{ color: "black", fontSize: 22 }}>
                  Complain Status
                </Text>
              </View>
            </View>
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <View
                style={{
                  width: "90%",
                  height: 80,
                  marginTop: 10,
                  alignSelf: "center",
                  paddingLeft: 10,
                  borderColor: "gainsboro",
                  borderStyle: "solid",
                  borderWidth: 0.3,
                  paddingRight: 10,
                  paddingBottom: 10
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      height: 40
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Options
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      height: 40,
                      flexDirection: "row"
                    }}
                  >
                    <View
                      style={{
                        width: "60%",
                        height: 40,
                        justifyContent: "center",
                        alignItems: "flex-end"
                      }}
                    >
                      <Image
                        source={Pending}
                        style={{ width: 15, height: 15 }}
                      />
                    </View>
                    <View
                      style={{
                        width: "40%",
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text>Pending</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 40,
                    justifyContent: "center"
                  }}
                >
                  <Text>hello this is my remarks on complain...</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
