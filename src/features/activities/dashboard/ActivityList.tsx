import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import useActivities from "../useActivities";
import ActivityListItem from "./ActivityListItem";

const ActivityList = () => {
  const { groupedActivities } = useActivities();

  return (
    <>
      {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default ActivityList;