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
  Spinner,
  Button
} from "native-base";
import styles from "../../constants/styles";
import Pending from "../assets/alarm-clock.png";
import approved from "../assets/approved.png";
import rejected from "../assets/rejected.png";
import progress from "../assets/progress.png";
import Lock from "../assets/locked.png";
import axios from "axios";
import * as f from "firebase";
import Modal from "react-native-modal";

export default class ComplainStatus extends Component {
  state = {
    isLoading: true,
    complaintsList: [],
    visibleModal: false,
    complainDetails: {},
    complainDetailsLoading: false
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

  complainDetails = id => {
    this.setState({
      complainDetailsLoading: true,
      visibleModal: true
    });
    console.log(id);
    console.log(f.auth().currentUser.uid);
    axios
      .get(
        `http://198.37.118.15:7040/api/Task/GetUserFullComplaintStatus?FireBaseUserId=${
          f.auth().currentUser.uid
        }&ComplaintId=${id}`
      )
      .then(res => {
        this.setState({
          complainDetails: res.data[0],
          complainDetailsLoading: false
        });
      })
      .catch(e => {
        alert("error occoured");
        this.setState({
          complainDetailsLoading: false,
          visibleModal: false
        });
      });
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
            {/* Complain modal starts */}
            <Modal
              isVisible={this.state.visibleModal}
              animationIn="slideInLeft"
              animationOut="slideOutRight"
              style={{ paddingTop: 30, paddingBottom: 30 }}
            >
              {this.state.complainDetailsLoading ? (
                <View
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    padding: 20
                  }}
                >
                  <Spinner color="blue" size="large" />
                </View>
              ) : (
                <View
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    backgroundColor: "white",
                    padding: 20
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {this.state.complainDetails.CompTypeDsc}
                  </Text>
                  <Text style={{ marginTop: 20 }}>
                    {this.state.complainDetails.CmpDsc}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      marginTop: 20
                    }}
                  >
                    <Image
                      source={
                        this.state.complainDetails.FinalStatus == "Pending"
                          ? Pending
                          : this.state.complainDetails.FinalStatus == "Approved"
                          ? approved
                          : this.state.complainDetails.FinalStatus == "Rejected"
                          ? rejected
                          : this.state.complainDetails.FinalStatus ==
                            "In Process"
                          ? progress
                          : Lock
                      }
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ marginLeft: 10 }}>
                      {this.state.complainDetails.FinalStatus}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 50,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBottom: 10
                    }}
                  >
                    <Button
                      onPress={() => this.setState({ visibleModal: false })}
                      style={{
                        width: "30%",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      rounded
                      danger
                    >
                      <Text style={{ color: "white" }}>close</Text>
                    </Button>
                  </View>
                </View>
              )}
            </Modal>
            {/* Complain Modal Ends */}

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
                  <TouchableOpacity
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
                    onPress={() => this.complainDetails(item.CmpId)}
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
                  </TouchableOpacity>
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
