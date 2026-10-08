import { useAnimatedStyle } from "react-native-reanimated";

export const useGestureHandlerStyle = (debug: boolean) => {
  return useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: debug ? "rgba(100, 200, 255, 0.4)" : "transparent",
    };
  });
};
