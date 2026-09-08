import MeetupList from "../components/meetups/MeetupList";
import connectDB from "../lib/mongodb";
import Meetup from "../modals/Meetup";

function HomePage(props) {
  if (props.error) {
    return (
      <p role="alert" style={{ color: "crimson", textAlign: "center" }}>
        {props.error}
      </p>
    );
  }

  return <MeetupList meetups={props.meetups} />;
}

export async function getStaticProps() {
  try {
    await connectDB();
    const meetups = await Meetup.find().lean();
    return {
      props: {
        meetups: meetups.map((meetup) => ({
          id: meetup._id.toString(),
          title: meetup.title,
          image: meetup.image,
          address: meetup.address,
          description: meetup.description,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching meetups:", error);
    return {
      props: {
        meetups: [],
        error: "Unable to load meetups. Please try again later.",
      },
    };
  }
}

export default HomePage;
