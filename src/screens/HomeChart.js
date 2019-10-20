import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default class HomeChart extends Component {
  render() {
    return (
      <ScrollView>
        <ScrollView
          style={{ padding: 10, marginTop: 40 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <LineChart
            data={{
              labels: ["Asif", "Ali", "Adeel", "Mansoor", "Rizwan", "Usama"],
              datasets: [
                {
                  data: [2000, 1200, 800, 1600, 2300, 1500],
                  strokeWidth: 2 // optional
                }
              ]
            }}
            width={Dimensions.get("window").width * 1.5} // from react-native
            height={300}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </ScrollView>
        <View style={{ width: "100%", flex: 1, padding: 10 }}>
          <TouchableOpacity
            // key={item.CmpId}
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
            // onPress={() => this.complainDetails(item.CmpId)}
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
                  {/* {item.CompTypeDsc} */}
                  Asif
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
                  <View style={{ width: "40%", alignItems: "flex-end" }}>
                    {/* <Image
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
                            /> */}
                  </View>
                  <View style={{ width: "60%", alignItems: "flex-start" }}>
                    <Text style={{ marginLeft: 5 }}>1500</Text>
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
                {/* {item.CmpDsc.length < 25
                          ? item.CmpDsc
                          : "very long long"} */}
                Excelent Sale ratio
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
