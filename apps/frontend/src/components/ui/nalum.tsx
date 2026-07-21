import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { Button as ReusableButton } from "@/components/ui/button";
import { Card as ReusableCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
export function Button({
  children,
  onPress,
  variant = "primary",
  disabled,
}: PropsWithChildren<{
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}>) {
  const reusableVariant =
    variant === "primary"
      ? "default"
      : variant === "secondary"
        ? "outline"
        : "ghost";

  return (
    <ReusableButton
      className={variant === "primary" ? "bg-maroon" : undefined}
      disabled={disabled}
      onPress={onPress}
      variant={reusableVariant}
    >
      <Text>{children}</Text>
    </ReusableButton>
  );
}
export function Field({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
}) {
  return (
    <Input
      className="h-12 rounded-lg bg-card px-4 text-base"
      placeholderTextColor="#79747e"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
}
export function Card({ children }: PropsWithChildren) {
  return <ReusableCard className="gap-0 p-5">{children}</ReusableCard>;
}
export function Screen({ children }: PropsWithChildren) {
  return <View className="flex-1 bg-background px-5 pt-14">{children}</View>;
}
