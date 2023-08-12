import { type OptionsNavigationProp } from "example/components/OptionsProvider";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Button } from "react-native";

export const useChartOptions = () => {
  const navigation = useNavigation<OptionsNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Options"
          onPress={() =>
            navigation.navigate("chart-options-modal", { type: "fill" })
          }
        />
      ),
    });
  }, [navigation]);
};
