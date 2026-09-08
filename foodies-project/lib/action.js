"use server"; // server action for handling form submission
import { saveMeal } from "./meals";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendVerificationCode } from "./email-verification";
import { createOtp, verifyOtp, isEmailVerified, clearOtp } from "./otp-store";

function validateMealData(mealData) {
  const { title, summary, instructions, image, creator, creator_email } =
    mealData;
  let error = {
    title: "",
    summary: "",
    instructions: "",
    image: "",
    creator: "",
    creator_email: "",
  };
  if (!title || title.trim() === "") {
    error.title = "Title is required.";
  }
  if (!summary || summary.trim() === "") {
    error.summary = "Summary is required.";
  }
  if (!instructions || instructions.trim() === "") {
    error.instructions = "Instructions are required.";
  }
  if (!creator || creator.trim() === "") {
    error.creator = "Creator name is required.";
  }
  if (!creator_email || creator_email.trim() === "") {
    error.creator_email = "Creator email is required.";
  }
  if (!image || image.size === 0) {
    error.image = "Image file is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creator_email)) {
    error.creator_email = "Invalid email format.";
  }
  if (Object.values(error).every((msg) => msg === "")) {
    return null; // No errors
  }
  return error;
}

export async function requestMealVerificationCode(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
    return { success: false, message: "A valid email is required." };
  }

  const code = createOtp(email);

  try {
    await sendVerificationCode(email, code);
  } catch (error) {
    return {
      success: false,
      message: "Could not send the verification code. Please try again.",
    };
  }
  return { success: true, message: "Verification code sent." };
}

export async function confirmMealVerificationCode(email, code) {
  return verifyOtp(email, code);
}

export async function shareMeal(_, formData) {
  const mealData = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  const validationError = validateMealData(mealData);
  if (validationError) return { error: validationError, fields: mealData };

  if (!isEmailVerified(mealData.creator_email)) {
    return {
      error: { form: "Please verify your email before sharing the meal." },
      fields: mealData,
    };
  }

  try {
    const result = await saveMeal(mealData);
    return {
      error: null,
      fields: mealData,
      message: result.message,
    };
  } catch (error) {
    return {
      error: {
        form: error.message || "Unable to save your meal. Please try again.",
      },
      fields: mealData,
    };
  }

  clearOtp(mealData.creator_email);
  revalidatePath("/meals");
  redirect("/meals");
}

// note: you can't to use server actions in client components,
// so we need to create a server component for the form and pass the action to it.
