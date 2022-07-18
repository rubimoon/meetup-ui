import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import {
  cancelActivityToggleAsync,
  updateAttendanceAsync,
} from "../activitySlice";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

const ActivityDetailedHeader = ({ activity }: Props) => {
  const { loading, selectedActivity } = useAppSelector(
    (state) => state.activities
  );
  const currentUser = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  const handleUpdateAttendanceAsync = () => {
    if (currentUser) dispatch(updateAttendanceAsync({ currentUser }));
  };

  const handleDeleteActivity = () => {
    if (!selectedActivity) return;
    dispatch(cancelActivityToggleAsync(selectedActivity));
  };

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(new Date(activity.date!), "dd MMM yyyy")}</p>
                <p>
                  Hosted by{activity.hostUsername}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? "green" : "red"}
              floated="left"
              basic
              content={
                activity.isCancelled
                  ? "Re-activate Activity"
                  : "Cancel Activity"
              }
              onClick={handleDeleteActivity}
              loading={loading}
            />
            <Button
              as={Link}
              disabled={activity.isCancelled}
              to={`/manage/${activity.id}`}
              color="orange"
              floated="right"
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={handleUpdateAttendanceAsync}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            disabled={activity.isCancelled}
            loading={loading}
            onClick={handleUpdateAttendanceAsync}
            color="teal"
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default ActivityDetailedHeader;
