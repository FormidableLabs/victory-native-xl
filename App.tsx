import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Canvas, Circle } from "@shopify/react-native-skia";
import { CartesianChart } from "./charts/CartesianChart";
import { Line } from "./charts/Line";
import { Bar } from "./charts/Bar";

export default function App() {
  const [data, setdata] = React.useState(DATA);

  const addPoint = () => {
    setdata((oldData) => [
      ...oldData,
      { x: oldData.at(-1).x + 1, y: Math.round(-10 + 20 * Math.random()) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Hello</Text>
        <StatusBar style="auto" />
        <View style={{ flex: 1, width: "100%", backgroundColor: "pink" }}>
          <CartesianChart data={data}>
            <Line />
            <Bar />
          </CartesianChart>
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Add point" onPress={addPoint} />
          <Button title="Reset" onPress={() => setdata(DATA)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

const DATA = [
  { x: 0, y: 2 },
  { x: 1, y: -5 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
];
