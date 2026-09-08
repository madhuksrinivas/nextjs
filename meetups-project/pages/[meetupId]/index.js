import MeetupDetail from "../../components/meetups/MeetupDetail";
import connectDB from "../../lib/mongodb";
import Meetup from "../../modals/Meetup";

function MeetupDetailsPage(props) {
  if (props.error) {
    return (
      <p role="alert" style={{ color: "crimson", textAlign: "center" }}>
        {props.error}
      </p>
    );
  }

  return <MeetupDetail {...props.meetupData} />;
}

export async function getStaticPaths() {
  try {
    await connectDB();
    const meetups = await Meetup.find().lean();
    return {
      fallback: false,
      paths: meetups.map((meetup) => ({
        params: { meetupId: meetup._id.toString() },
      })),
    };
  } catch (error) {
    console.error("Error fetching meetups:", error);
    throw new Error("Failed to fetch meetups");
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  try {
    await connectDB();
    const meetup = await Meetup.findById(meetupId).lean();

    if (!meetup) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        meetupData: {
          id: meetup._id.toString(),
          title: meetup.title,
          image: meetup.image,
          address: meetup.address,
          description: meetup.description,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching meetup:", error);
    return {
      props: {
        error: "Unable to load this meetup. Please try again later.",
      },
    };
  }
}

export default MeetupDetailsPage;
