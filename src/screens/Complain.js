import React, { Component } from "react";
import { Text, View, SafeAreaView, ScrollView, Platform } from "react-native";
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
import styles from "../../constants/styles";

export default class Complain extends Component {
  state = {
    selected2: undefined,
    complain: {}
  };

  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }

  render() {
    return (
      <SafeAreaView style={[styles.SafeArea, { flex: 1 }]}>
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
            <Text style={{ color: "black", fontSize: 22 }}>Complain Form</Text>
          </View>
        </View>
        <ScrollView style={{ width: "100%", flex: 1 }}>
          <View style={{ marginTop: 50, width: "80%", alignSelf: "center" }}>
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
                mode="dropdown"
                placeholder="Select your Options"
                placeholderStyle={{ color: "black" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
              </Picker>

              {Platform.OS == "android" ? null : (
                <Right>
                  <Icon
                    name="arrow-dropdown-circle"
                    style={{ color: "#007aff", fontSize: 25, marginRight: 20 }}
                  />
                </Right>
              )}
            </Item>
          </View>
          <View style={{ width: "80%", marginTop: 50, alignSelf: "center" }}>
            <Textarea
              maxLength={450}
              onChangeText={val =>
                this.setState({
                  complain: { ...this.state.complain, remarks: val }
                })
              }
              style={{ paddingTop: 10, borderColor: "gray" }}
              value={this.state.complain.remarks}
              rowSpan={5}
              bordered
              placeholder="Write Your Remarks..."
            />
          </View>
          <View style={{ marginTop: 50, width: "80%", alignSelf: "center" }}>
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
                mode="dropdown"
                placeholder="Select your Department"
                placeholderStyle={{ color: "black" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
              </Picker>
              {Platform.OS == "android" ? null : (
                <Right>
                  <Icon
                    name="arrow-dropdown-circle"
                    style={{ color: "#007aff", fontSize: 25, marginRight: 20 }}
                  />
                </Right>
              )}
            </Item>
          </View>
          <View
            style={{
              marginTop: 50,
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 30,
              alignSelf: "center"
            }}
          >
            <Button
              disabled={this.state.uploading == true ? true : false}
              // onPress={() => this.submitUserInfo()}
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
              rounded
              primary
            >
              <Text style={{ color: "white" }}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
