import React, { Component } from "react";
import { Text, View, SafeAreaView } from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch
} from "native-base";
import { connect } from "react-redux";
import styles from "../../constants/styles";
import { LoginAction } from "../actions/userAction";

class Settings extends Component {
  state = {
    isDialogVisible: false
  };

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
            <Text style={{ color: "black", fontSize: 22 }}>Settings</Text>
          </View>
        </View>
        <View style={{ width: "100%", flex: 1, paddingTop: 20 }}>
          <ListItem onPress={() => this.props.navigation.navigate("Edit")} icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active name="person" type="MaterialIcons" />
              </Button>
            </Left>
            <Body>
              <Text>Edit Profile</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </View>
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
)(Settings);
