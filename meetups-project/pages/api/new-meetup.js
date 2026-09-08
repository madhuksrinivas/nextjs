import connectDB from "../../lib/mongodb";
import Meetup from "../../modals/Meetup";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const meetup = await Meetup.create({
      title: req.body.title,
      image: req.body.image,
      address: req.body.address,
      description: req.body.description,
    });

    return res
      .status(201)
      .json({ message: "Meetup inserted successfully", meetup });
  } catch (error) {
    console.error("Error inserting meetup:", error);
    return res.status(500).json({
      message: "Failed to insert meetup",
    });
  }
}

export default handler;
