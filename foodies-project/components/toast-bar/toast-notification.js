import { useEffect, useRef, useState } from "react";
import classes from "./toast-notification.module.css";

function ToastNotification({ open, close, message, type }) {
  const toastRef = useRef();
  useEffect(() => {
    const toast = toastRef.current;
    if (!toast) return;
    if (open && !toast.open) {
      toast.showModal();
    } else if (!open && toast.open) {
      toast.close();
    }
  }, [open]);
  return (
    <dialog className={classes.toastContainer} ref={toastRef}>
      {open && (
        <div className={`${classes.toastNotification} ${classes[type]}`}>
          <p>{message}</p>
          <button onClick={close}>
            <b>X</b>
          </button>
        </div>
      )}
    </dialog>
  );
}

export default ToastNotification;
