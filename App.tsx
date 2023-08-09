import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Bar } from "./charts/cartesian/Bar";
import { CartesianChart } from "./charts/cartesian/CartesianChart";
import { Line } from "./charts/cartesian/Line";

export default function App() {
  const [data, setdata] = React.useState(DATA);

  const addPoint = () => {
    setdata((oldData) => [
      ...oldData,
      { x: oldData.at(-1).x + 1, y: Math.round(10 * Math.random()) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Hello</Text>
        <StatusBar style="auto" />
        <View style={{ flex: 1, width: "100%", backgroundColor: "pink" }}>
          <CartesianChart data={data}>
            <Bar />
            <Line />
          </CartesianChart>
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Add point" onPress={addPoint} />
          <Button title="Reset" onPress={() => setdata(DATA)} />
          <Button
            title="Shuffle y values"
            onPress={() =>
              setdata((old) =>
                old.map(({ x }) => ({ x, y: Math.round(10 * Math.random()) })),
              )
            }
          />
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

const DATA = Array.from({ length: 10 })
  .fill(null)
  .map((_, i) => ({ x: i, y: Math.round(10 * Math.random()) }));
