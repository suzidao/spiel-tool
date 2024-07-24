/** @format */
"use client";

import { useRef } from "react";
import { addNewUser } from "../actions";

export default function NewUserForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await addNewUser(formData);
        ref.current?.reset();
      }}
    >
      <label>
        username:
        <input type="text" name="username" />
      </label>
      <label>
        password:
        <input type="password" name="password" />
      </label>
      <label>
        email:
        <input type="text" name="email" />
      </label>
      <button type="submit">Add New User</button>
    </form>
  );
}
