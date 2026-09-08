import classes from "./MeetupDetail.module.css";

function MeetupDetail(props) {
  return (
    <div className={classes.item}>
      <div className={classes.image}>
        <img src={props.image} alt={props.title} />
      </div>
      <h1>{props.title}</h1>
      <address>{props.address}</address>
      <p>{props.description}</p>
    </div>
  );
}

export default MeetupDetail;
