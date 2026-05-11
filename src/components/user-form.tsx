"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createUser, FormState } from "@/actions/users";

const initialState: FormState = {
  errors: {},
  success: false,
};

export function UserForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 w-full">
      <FieldSet className="w-full max-w-xs">
        <FieldGroup className="gap-4">
          <Field className="gap-1">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              required
              placeholder="johndoe"
              defaultValue={state.data?.username || ""}
              aria-describedby={
                state.errors?.username ? "username-error" : undefined
              }
              disabled={isPending}
            />
            {state.errors?.username && (
              <div id="username-error" className="text-red-500 text-sm mt-1">
                {state.errors.username[0]}
              </div>
            )}
            <FieldDescription>
              Choose a unique username for the account.
            </FieldDescription>
          </Field>
          <Field className="gap-1">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              aria-describedby={
                state.errors?.password ? "password-error" : undefined
              }
              disabled={isPending}
            />
            {state.errors?.password && (
              <div id="password-error" className="text-red-500 text-sm mt-1">
                {state.errors.password[0]}
              </div>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
      {state.errors?._form && (
        <div className="text-red-500 text-sm mt-2 mb-2">
          {state.errors._form[0]}
        </div>
      )}
      <Field orientation="horizontal" className="mt-4 ml-auto w-max">
        <Button variant="outline" type="button" disabled={isPending}>
          Cancel
        </Button>
        <SubmitButton isPending={isPending} />
      </Field>
    </form>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? "Creating..." : "Submit"}
    </Button>
  );
}
