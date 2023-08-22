import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import Reanimated, {
  useAnimatedProps,
  type SharedValue,
} from "react-native-reanimated";

const AnimText = Reanimated.createAnimatedComponent(TextInput);
Reanimated.addWhitelistedNativeProps({ text: true });

type AnimatedTextProps = Omit<TextInputProps, "editable" | "value"> & {
  text: SharedValue<string>;
};

export function AnimatedText({ text, ...rest }: AnimatedTextProps) {
  const animProps = useAnimatedProps(() => {
    return {
      text: text.value,
    };
  });

  return (
    <AnimText
      {...rest}
      value={text.value}
      // @ts-ignore
      animatedProps={animProps}
      editable={false}
    />
  );
}
