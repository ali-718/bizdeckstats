import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Input,
  Item,
  Icon,
  Button,
  Label,
  Textarea,
  Spinner,
  Picker,
  Right
} from "native-base";
import { Avatar } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import styles from "../../constants/styles";
import { ScrollView } from "react-native-gesture-handler";
import * as f from "firebase";
import AwesomeAlert from "react-native-awesome-alerts";
import { connect } from "react-redux";
import { LoginAction } from "../actions/userAction";
import axios from "axios";

class Edit extends Component {
  state = {
    user: {},
    ImageSelected: false,
    ImageUri: "",
    uploading: false,
    showAlert2: false,
    internetError: false,
    areaid: "",
    houseid: "",
    areaList: [],
    houseList: [],
    isLoading: true,
    showSuccess: false
  };

  showSuccess = () => {
    this.setState({
      showSuccess: true
    });
  };

  showAlert2 = () => {
    this.setState({
      showAlert2: true
    });
  };

  showInternetError = () => {
    this.setState({
      internetError: true
    });
  };

  hideAlert2 = () => {
    this.setState({
      showAlert2: false
    });
  };

  checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      Camera: status
    });
    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      CameraRoll: statusRoll
    });
  };

  fetchImage = async () => {
    this.checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 4]
    });

    if (!result.cancelled) {
      this.setState({
        ImageSelected: true,
        ImageUri: result.uri
      });

      this.uploadImage(this.state.ImageUri);
    } else {
      this.setState({
        ImageSelected: false
      });
    }
  };

  uploadImage = async uri => {
    const userId = f.auth().currentUser.uid;
    const type = uri.split(".").pop();

    this.setState({
      uploading: true
    });

    const response = await fetch(uri);
    const Blob = await response.blob();

    let FilePath = f.auth().currentUser.uid + "." + type;

    let uploadRef = f
      .storage()
      .ref(`/users/${userId}/profileImages`)
      .child(FilePath)
      .put(Blob);

    uploadRef.on(
      "state_changed",
      snapshot => {
        let progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);

        this.setState({ progress });
      },
      () => console.log(e),
      final => {
        uploadRef.snapshot.ref.getDownloadURL().then(download => {
          this.setState({
            uploading: false,
            user: { ...this.state.user, avatar: download }
          });
        });
      }
    );
  };

  logout = () => {
    f.auth()
      .signOut()
      .then(() => {
        this.props.navigation.replace("Splashscreen");
      });
  };

  componentDidMount() {
    this.checkPermissions();
    f.database()
      .ref("users")
      .child(f.auth().currentUser.uid)
      .once("value")
      .then(res => {
        this.setState({
          user: {
            ...res.val(),
            id: res.key
          },
          areaid: res.val().areaid,
          houseid: res.val().houseid
        });
      })
      .then(() => {
        axios
          .get(
            `http://198.37.118.15:7040/api/Task/GetHouseNos?AreaId=${this.state.areaid}`
          )
          .then(res => {
            this.setState({
              houseList: res.data
            });
            console.log("ok it is set");
          });
        axios
          .get(`http://198.37.118.15:7040/api/Task/GetArea`)
          .then(res => {
            this.setState({
              areaList: res.data
            });
          })
          .then(() => {
            this.setState({ isLoading: false });
          });
      });
  }

  onValueChange1 = value => {
    this.setState({
      houseid: value
    });
  };

  onValueChange2 = value => {
    this.setState({
      areaid: value,
      isLoading: true
    });

    setTimeout(() => {
      axios
        .get(
          `http://198.37.118.15:7040/api/Task/GetHouseNos?AreaId=${this.state.areaid}`
        )
        .then(res => {
          this.setState({
            houseList: res.data
          });
          console.log("ok it is set");
        })
        .then(() => {
          console.log("error in loading");
          this.setState({
            isLoading: false
          });
        });
    }, 800);
  };

  submitUserInfo = () => {
    this.setState({
      uploading: false
    });
    let avatar = this.state.user.avatar ? this.state.user.avatar.trim() : "";
    let name = this.state.user.name ? this.state.user.name.trim() : "";
    let username = this.state.user.username
      ? this.state.user.username.trim()
      : "";
    let description = this.state.user.description
      ? this.state.user.description.trim()
      : "";
    let phone = this.state.user.phone ? this.state.user.phone.trim() : "";
    let cnic = this.state.user.cnic ? this.state.user.cnic.trim() : "";
    let address = this.state.user.address ? this.state.user.address.trim() : "";
    let House = this.state.houseid;
    let Area = this.state.areaid;

    if (
      avatar != "" &&
      name != "" &&
      username != "" &&
      description &&
      phone !== "" &&
      cnic !== "" &&
      address !== "" &&
      House !== "" &&
      Area !== ""
    ) {
      this.setState({
        isLoading: true
      });
      console.log("yes we are here");
      f.database()
        .ref("users")
        .child(f.auth().currentUser.uid)
        .update({ ...this.state.user, areaid: Area, houseid: House })
        .then(() => {
          if (this.props.navigation.getParam("fromFacebook")) {
            axios
              .post(
                `http://198.37.118.15:7040/api/Task/AddUser?Name=${name}&UserName=${username}&Description=${description}&email=${this.state.user.email}&expoPushToken=&ShortMsg=&cnic=${cnic}&MobileNo=${phone}&FirBaseId=${this.state.user.id}`
              )
              .then(() => {
                f.database()
                  .ref("users")
                  .child(f.auth().currentUser.uid)
                  .once("value")
                  .then(item => {
                    if (item.val()) {
                      this.props.LoginAction(item.val());
                      this.props.navigation.replace("Home");
                      console.log("user details edited");
                      this.setState({
                        uploading: false,
                        isLoading: false
                      });
                    }
                  })
                  .catch(e => {
                    this.setState({
                      uploading: false,
                      isLoading: false
                    });
                    this.showInternetError();
                    console.log(
                      "error while sending data to mansoor bhai server 2"
                    );
                  });
              })
              .catch(e => {
                this.setState({
                  uploading: false,
                  isLoading: false
                });
                this.showInternetError();
                console.log("error while sending data to mansoor bhai server");
              });
          } else {
            axios
              .post(
                `http://198.37.118.15:7040/api/Task/UpdateUserInfo?AreaId=${Area}&HouseId=${House}&Addr=${address}&userIdFireBase=${
                  f.auth().currentUser.uid
                }&cnic=${cnic}&name=${name}&username=${username}&Description=${description}&email=${
                  this.state.user.email
                }&mobile=${phone}&ShortMsg=short message`
              )
              .then(() => {
                f.database()
                  .ref("users")
                  .child(f.auth().currentUser.uid)
                  .once("value")
                  .then(item => {
                    if (item.val()) {
                      this.showSuccess();
                      this.props.LoginAction(item.val());
                      console.log("user details edited");
                      this.setState({
                        uploading: false,
                        isLoading: false
                      });
                    }
                  })
                  .catch(e => {
                    this.setState({
                      uploading: false,
                      isLoading: false
                    });
                    this.showInternetError();
                    console.log("error while fetching data");
                  });
              })
              .catch(e => {
                this.setState({
                  uploading: false,
                  isLoading: false
                });
                this.showInternetError();
                console.log(
                  "error while sending data to mansoor bhai server 3"
                );
              });
          }
        })
        .catch(e => {
          this.setState({
            uploading: false,
            isLoading: false
          });
          this.showInternetError();
          console.log("error while updating data in firebase");
        });
    } else {
      this.setState({
        uploading: false,
        isLoading: false
      });
      this.showAlert2();
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled={true}
        style={styles.SafeArea}
      >
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
            {console.log(this.state)}
            <SafeAreaView style={{ width: "100%", flex: 1 }}>
              <ScrollView style={{ width: "100%", flex: 1 }}>
                {this.props.navigation.getParam("fromLogin") ? null : (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 50
                    }}
                  >
                    <View
                      style={{
                        width: "90%",
                        height: 50,
                        justifyContent: "center"
                      }}
                    >
                      <Icon
                        onPress={() => this.props.navigation.goBack()}
                        name="ios-arrow-back"
                      />
                    </View>
                  </View>
                )}

                <View
                  style={{
                    width: "100%",
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {this.state.uploading ? (
                    <Spinner color="blue" />
                  ) : (
                    <Avatar
                      showEditButton
                      size="xlarge"
                      rounded
                      source={{
                        uri:
                          this.state.user.avatar !== null
                            ? this.state.user.avatar
                            : "https://via.placeholder.com/300"
                      }}
                      onPress={() => this.fetchImage()}
                    />
                  )}
                </View>
                <View
                  style={{
                    width: "100%",
                    flex: 1,
                    alignItems: "center"
                  }}
                >
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Item floatingLabel>
                      <Label>Username</Label>
                      <Input
                        onChangeText={val =>
                          this.setState({
                            user: { ...this.state.user, username: val }
                          })
                        }
                        value={this.state.user.username}
                        placeholder="Name...!"
                      />
                    </Item>
                  </View>
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Item floatingLabel>
                      <Label>Name</Label>
                      <Input
                        onChangeText={val =>
                          this.setState({
                            user: { ...this.state.user, name: val }
                          })
                        }
                        value={this.state.user.name}
                        placeholder="Name...!"
                      />
                    </Item>
                  </View>
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Textarea
                      maxLength={150}
                      onChangeText={val =>
                        this.setState({
                          user: { ...this.state.user, description: val }
                        })
                      }
                      style={{ paddingTop: 10 }}
                      value={this.state.user.description}
                      rowSpan={5}
                      bordered
                      placeholder="Description..."
                    />
                  </View>
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Textarea
                      maxLength={150}
                      onChangeText={val =>
                        this.setState({
                          user: { ...this.state.user, address: val }
                        })
                      }
                      style={{ paddingTop: 10 }}
                      value={this.state.user.address}
                      rowSpan={5}
                      bordered
                      placeholder="Address..."
                    />
                  </View>
                  <View
                    style={{ marginTop: 50, width: "80%", alignSelf: "center" }}
                  >
                    <Item
                      style={{
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1
                      }}
                      picker
                    >
                      <Picker
                        iosIcon={
                          <View
                            style={{ width: "50%", alignItems: "flex-end" }}
                          >
                            <Icon
                              name="arrow-dropdown-circle"
                              style={{
                                color: "#007aff",
                                fontSize: 25,
                                marginRight: 20
                              }}
                            />
                          </View>
                        }
                        mode="dropdown"
                        placeholder="Select your Area"
                        placeholderStyle={{ color: "black" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.areaid}
                        onValueChange={this.onValueChange2}
                      >
                        {this.state.areaList.map(item => (
                          <Picker.Item
                            key={item.AreaId}
                            label={item.AreaDesc}
                            value={item.AreaId}
                          />
                        ))}
                      </Picker>
                    </Item>
                  </View>
                  {this.state.areaid ? (
                    <View
                      style={{
                        marginTop: 50,
                        width: "80%",
                        alignSelf: "center"
                      }}
                    >
                      <Item
                        style={{
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: "gray",
                          borderTopWidth: 1,
                          borderLeftWidth: 1,
                          borderRightWidth: 1
                        }}
                        picker
                      >
                        <Picker
                          iosIcon={
                            <View
                              style={{ width: "50%", alignItems: "flex-end" }}
                            >
                              <Icon
                                name="arrow-dropdown-circle"
                                style={{
                                  color: "#007aff",
                                  fontSize: 25,
                                  marginRight: 20
                                }}
                              />
                            </View>
                          }
                          mode="dropdown"
                          placeholder="Select your Area"
                          placeholderStyle={{ color: "black" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.houseid}
                          onValueChange={this.onValueChange1}
                        >
                          {this.state.houseList.map(item => (
                            <Picker.Item
                              key={item.HouseId}
                              label={item.HouseDesc}
                              value={item.HouseId}
                            />
                          ))}
                        </Picker>
                      </Item>
                    </View>
                  ) : null}
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Item floatingLabel>
                      <Label>CNIC</Label>
                      <Input
                        onChangeText={val =>
                          this.setState({
                            user: { ...this.state.user, cnic: val }
                          })
                        }
                        value={this.state.user.cnic}
                        placeholder="Name...!"
                        keyboardType="number-pad"
                      />
                    </Item>
                  </View>
                  <View style={{ width: "80%", marginTop: 50 }}>
                    <Item floatingLabel>
                      <Label>Phone</Label>
                      <Input
                        onChangeText={val =>
                          this.setState({
                            user: { ...this.state.user, phone: val }
                          })
                        }
                        value={this.state.user.phone}
                        placeholder="Phone...!"
                        keyboardType="number-pad"
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      marginTop: 50,
                      width: "80%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBottom: 30
                    }}
                  >
                    <Button
                      disabled={this.state.uploading == true ? true : false}
                      onPress={() => this.submitUserInfo()}
                      style={{
                        width: "30%",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                      rounded
                      primary
                      activeOpacity={0.5}
                    >
                      <Text style={{ color: "white" }}>Save</Text>
                    </Button>
                  </View>
                  {this.props.navigation.getParam("fromLogin") ? (
                    <View
                      style={{
                        width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 30
                      }}
                    >
                      <Button
                        disabled={this.state.uploading == true ? true : false}
                        onPress={() => this.logout()}
                        style={{
                          width: "30%",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        rounded
                        danger
                      >
                        <Text style={{ color: "white" }}>Logout</Text>
                      </Button>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </SafeAreaView>
            {/* Error fill all fields starts */}
            <AwesomeAlert
              show={this.state.showAlert2}
              showProgress={false}
              title="Error"
              message="Please fill all fields...!"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={false}
              cancelText="Ok"
              cancelButtonColor="red"
              cancelButtonStyle={{ width: 50, alignItems: "center" }}
              onCancelPressed={() => {
                this.hideAlert2();
              }}
            />
            {/* Error fill all fields ends */}

            {/* Internet Error starts */}
            <AwesomeAlert
              show={this.state.internetError}
              showProgress={false}
              title="Error"
              message="Some error occoured you might check your internet connection...!"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={false}
              cancelText="Ok"
              cancelButtonColor="red"
              cancelButtonStyle={{ width: 50, alignItems: "center" }}
              onCancelPressed={() => {
                this.setState({
                  internetError: false
                });
              }}
            />
            {/* Internet error  ends */}

            {/* Changes saved starts */}
            <AwesomeAlert
              show={this.state.showSuccess}
              showProgress={false}
              title="Success"
              message="Your changes are saved...!"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={false}
              cancelText="Ok"
              cancelButtonColor="red"
              cancelButtonStyle={{ width: 50, alignItems: "center" }}
              onCancelPressed={() => {
                this.setState({
                  showSuccess: false
                });
              }}
            />
            {/* changes saved  ends */}
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { LoginAction }
)(Edit);
