import { type ComponentProps } from "react";

import { AppButton } from "@/components/ui/app-button";

export type AuthButtonProps = ComponentProps<typeof AppButton>;

export function AuthButton(props: AuthButtonProps) {
  return <AppButton {...props} />;
}
