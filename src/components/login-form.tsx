"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { FormState, loginUser } from "@/actions/users";

const initialState: FormState = {
  errors: {},
  success: false,
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  required
                  defaultValue={state.data?.username || ""}
                  aria-describedby={
                    state.errors?.username ? "username-error" : undefined
                  }
                  disabled={isPending}
                />
                {state.errors?.username && (
                  <div
                    id="username-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {state.errors.username[0]}
                  </div>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="•••••••••••"
                  required
                  aria-describedby={
                    state.errors?.password ? "password-error" : undefined
                  }
                  disabled={isPending}
                />
                {state.errors?.password && (
                  <div
                    id="password-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {state.errors.password[0]}
                  </div>
                )}
              </Field>
              <Field>
                {/* <Button type="submit">Login</Button> */}
                <SubmitButton isPending={isPending} />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? "Logging in..." : "Login"}
    </Button>
  );
}
