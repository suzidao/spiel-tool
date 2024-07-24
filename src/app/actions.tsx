/** @format */

"use server";

export async function addNewUser(formData: FormData) {
  await fetch("http://localhost:3000/api/users/add", {
    method: "POST",
    body: formData,
  }).then((response) => {
    return response.json();
  });
}
