import { type ComponentProps } from "react";

import { FormTextInput } from "@/components/ui/form-text-input";

export type AuthInputProps = ComponentProps<typeof FormTextInput>;

export function AuthInput(props: AuthInputProps) {
  return <FormTextInput {...props} />;
}
