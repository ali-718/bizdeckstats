import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
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
import * as f from "firebase";
import { connect } from "react-redux";

class Home extends Component {
  state = {
    isLoading: true,
    users: []
  };

  componentDidMount() {
    f.database()
      .ref("users")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(res => {
          this.state.users.push({ ...res.val(), id: res.key });
        });
        this.setState({
          isLoading: false
        });
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
              {console.log(this.props)}
              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  onPress={() => this.props.navigation.toggleDrawer()}
                  name="bars"
                  type="FontAwesome5"
                  style={{ color: "black" }}
                />
              </View>
              <View style={{ width: "80%" }}>
                <Text style={{ color: "black", fontSize: 22 }}>BizIntel</Text>
              </View>
            </View>
            <ScrollView style={{ width: "100%", flex: 1 }}>
              <List style={{ marginTop: 10 }}>
                {this.state.users.map(item => {
                  if (item.id !== f.auth().currentUser.uid) {
                    return (
                      <ListItem
                        key={item.id}
                        onPress={() =>
                          this.props.navigation.navigate("Chat", {
                            user: item
                          })
                        }
                        avatar
                      >
                        <Left>
                          <Thumbnail
                            source={{
                              uri: item.avatar
                            }}
                          />
                        </Left>
                        <Body>
                          <Text style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Text>
                          <Text note>{item.shortMessage}</Text>
                        </Body>
                        <Right>
                          <Text>3:43 pm</Text>
                        </Right>
                      </ListItem>
                    );
                  }
                })}
              </List>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Home);
