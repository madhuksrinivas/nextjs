"use client";
import { useRef, useState } from "react";
import classes from "../../app/meals/share/page.module.css";
import ImagePicker from "../image-picker/image-picker";
import VerifyMealForm from "../meal-verification/verify-meal-form";
import { shareMeal } from "../../lib/action";
import { useActionState } from "react";
import { useToast } from "../toast-bar/toast-context";

export default function ShareMealForm() {
  const [state, formAction, isPending] = useActionState(shareMeal, {
    error: null,
    fields: null,
    message: null,
  });
  const emailInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const showToast = useToast();

  if (state?.message) {
    showToast(state.message, "success");
  }

  function handleVerifyClick() {
    setEmail(emailInputRef.current.value);
    setIsVerified(false);
    setIsVerifying(true);
  }

  function handleVerified() {
    setIsVerifying(false);
    setIsVerified(true);
  }

  function handleVerifyClose() {
    setIsVerifying(false);
  }

  return (
    <main className={classes.main}>
      <form className={classes.form} action={formAction}>
        {state?.error?.form && (
          <p role="alert" style={{ color: "red" }}>
            {state.error.form}
          </p>
        )}

        <div className={classes.row}>
          <p>
            <label htmlFor="name">Your name</label>
            {state?.error?.creator && (
              <span style={{ color: "red" }}>{state.error.creator}</span>
            )}
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={state?.fields?.creator}
            />
          </p>

          <p>
            <label htmlFor="email">Your email</label>
            {state?.error?.creator_email && (
              <span style={{ color: "red" }}>{state.error.creator_email}</span>
            )}
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={state?.fields?.creator_email}
              ref={emailInputRef}
            />
          </p>
        </div>

        <p>
          <label htmlFor="title">Title</label>
          {state?.error?.title && (
            <span style={{ color: "red" }}>{state.error.title}</span>
          )}
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={state?.fields?.title}
          />
        </p>

        <p>
          <label htmlFor="summary">Short Summary</label>
          {state?.error?.summary && (
            <span style={{ color: "red" }}>{state.error.summary}</span>
          )}
          <input
            type="text"
            id="summary"
            name="summary"
            defaultValue={state?.fields?.summary}
          />
        </p>

        <p>
          <label htmlFor="instructions">Instructions</label>
          {state?.error?.instructions && (
            <span style={{ color: "red" }}>{state.error.instructions}</span>
          )}
          <textarea
            id="instructions"
            name="instructions"
            rows="10"
            defaultValue={state?.fields?.instructions}
          ></textarea>
        </p>

        <ImagePicker label="Your Image" name="image" />
        {state?.error?.image && (
          <p style={{ color: "red" }}>{state.error.image}</p>
        )}

        {isVerified ? (
          <p className={classes.actions}>
            <button type="submit" disabled={isPending}>
              {isPending ? "Sharing meal..." : "Share Meal"}
            </button>
          </p>
        ) : (
          <p className={classes.actions}>
            <button type="button" onClick={handleVerifyClick}>
              Verify using email OTP
            </button>
          </p>
        )}
      </form>

      <VerifyMealForm
        email={email}
        open={isVerifying}
        onVerified={handleVerified}
        onClose={handleVerifyClose}
      />
    </main>
  );
}
