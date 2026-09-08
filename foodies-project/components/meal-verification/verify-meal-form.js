"use client";
import { useEffect, useRef, useState } from "react";
import {
  requestMealVerificationCode,
  confirmMealVerificationCode,
} from "../../lib/action";
import classes from "./verify-meal-form.module.css";
import { useToast } from "../toast-bar/toast-context";

export default function VerifyMealForm({ email, open, onVerified, onClose }) {
  const dialogRef = useRef();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      sendCode();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function sendCode() {
    setSending(true);
    setError(null);
    const result = await requestMealVerificationCode(email);
    setSending(false);
    if (!result.success) setError(result.message);
    showToast(result.message, result.success ? "success" : "error");
  }

  function handleChange(event, index) {
    const value = event.target.value.replace(/\D/g, "");
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value ? value[value.length - 1] : "";
      return next;
    });
    if (value && index < otp.length - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(event, index) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    const result = await confirmMealVerificationCode(email, code);
    if (!result.success) {
      setError(result.message);
      showToast(result.message, "error");
      return;
    }
    setOtp(Array(6).fill(""));
    showToast("Successfully verified your email!", "success");
    onVerified?.();
  }

  function handleCancel() {
    setOtp(Array(6).fill(""));
    setError(null);
    onClose?.();
  }

  return (
    <dialog ref={dialogRef} onClose={handleCancel} className={classes.dialog}>
      <form onSubmit={handleSubmit}>
        <h2>Verify your email</h2>
        <p>Enter the 6-digit code sent to {email}.</p>

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className={classes.otpRow}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </div>

        <div className={classes.actions}>
          <button type="button" onClick={sendCode} disabled={sending}>
            {sending ? "Sending..." : "Resend code"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Verify</button>
        </div>
      </form>
    </dialog>
  );
}
