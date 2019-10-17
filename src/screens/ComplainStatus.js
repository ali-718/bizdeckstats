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
import approved from "../assets/approved.png";
import rejected from "../assets/rejected.png";
import progress from "../assets/progress.png";
import Lock from "../assets/locked.png";
import axios from "axios";
import * as f from "firebase";

export default class ComplainStatus extends Component {
  state = {
    isLoading: true,
    complaintsList: []
  };

  componentDidMount() {
    axios
      .get(
        `http://198.37.118.15:7040/api/Task/GetComplaint?FireBaseUserId=${
          f.auth().currentUser.uid
        }&UserType=0`
      )
      .then(res => {
        this.setState({
          complaintsList: res.data
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(() => {
        alert("some error occoured");
        this.setState({ isLoading: false });
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
            {this.state.complaintsList.length > 0 ? (
              <ScrollView style={{ width: "100%", flex: 1 }}>
                {this.state.complaintsList.map(item => (
                  <View
                    key={item.CmpId}
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
                          {item.CompTypeDsc}
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
                            width: "100%",
                            height: 40,
                            justifyContent: "center",
                            alignItems: "flex-end",
                            flexDirection: "row"
                          }}
                        >
                          <View
                            style={{ width: "40%", alignItems: "flex-end" }}
                          >
                            <Image
                              source={
                                item.Status == "Pending"
                                  ? Pending
                                  : item.Status == "Approved"
                                  ? approved
                                  : item.Status == "Rejected"
                                  ? rejected
                                  : item.Status == "In Process"
                                  ? progress
                                  : Lock
                              }
                              style={{ width: 15, height: 15 }}
                            />
                          </View>
                          <View
                            style={{ width: "60%", alignItems: "flex-start" }}
                          >
                            <Text style={{ marginLeft: 5 }}>{item.Status}</Text>
                          </View>
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
                      <Text>
                        {item.CmpDsc.length < 25
                          ? item.CmpDsc
                          : "very long long"}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text>You have no complaints register with us...!</Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}
