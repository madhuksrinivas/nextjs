import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { useRouter } from "next/router";
import { useState } from "react";

function NewMeetupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  async function onAddMeetupHandler(meetupData) {
    setErrorMessage("");

    try {
      const response = await fetch("/api/new-meetup", {
        method: "POST",
        body: JSON.stringify(meetupData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add meetup");
      }

      console.log("Response Data:", data);
      alert("Meetup added successfully!");
      router.push("/");
    } catch (error) {
      console.error("Add meetup error:", error);
      setErrorMessage(error.message || "Something went wrong");
    }
  }

  return (
    <>
      {errorMessage && (
        <p role="alert" style={{ color: "crimson", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}
      <NewMeetupForm onAddMeetup={onAddMeetupHandler} />
    </>
  );
}

export default NewMeetupPage;
