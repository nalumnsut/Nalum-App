import { TextInput as ExpoTextInput, useNativeState } from "@expo/ui";
import { useState } from "react";
import {
  Pressable,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type TextInputProps as RNTextInputProps,
} from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Colors, Radius, Spacing } from "@/constants/theme";

export type FormTextInputProps = {
  label: string;
  value?: string;
  error?: string;
  id?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoComplete?: RNTextInputProps["autoComplete"];
  textContentType?: RNTextInputProps["textContentType"];
  maxLength?: number;
  autoFocus?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (text: string) => void;
};

export function FormTextInput({
  label,
  value = "",
  error,
  secureTextEntry,
  onChangeText,
  id,
  textContentType: _textContentType,
  ...props
}: FormTextInputProps) {
  const textState = useNativeState(value);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={{ gap: Spacing.two }}>
      <AppText variant="label" color="textSecondary">
        {label}
      </AppText>
      <View
        style={{
          alignItems: "center",
          backgroundColor: Colors.dark.input,
          borderColor: error ? Colors.dark.error : Colors.dark.border,
          borderCurve: "continuous",
          borderRadius: Radius.md,
          borderWidth: 1,
          flexDirection: "row",
          minHeight: 52,
          paddingHorizontal: Spacing.four,
        }}
      >
        <ExpoTextInput
          {...props}
          value={textState}
          secureTextEntry={hidden}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.dark.textSubtle}
          cursorColor={Colors.dark.primary}
          selectionColor={Colors.dark.primary}
          testID={id}
          style={
            {
              color: Colors.dark.text,
              flex: 1,
              fontFamily: "Roboto",
              fontSize: 15,
              height: 50,
              outlineStyle: "none",
            } as object
          }
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setHidden((current) => !current)}
            style={{ paddingLeft: Spacing.three }}
          >
            <AppText variant="label" color="primary">
              {hidden ? "Show" : "Hide"}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText selectable variant="small" color="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
