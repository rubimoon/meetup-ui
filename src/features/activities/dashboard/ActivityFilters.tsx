import { useState } from "react";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { convertDateISOString } from "../../../app/common/utils/date";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import {
  resetActivityRegistry,
  setFilter,
  setStartDate,
} from "../activitySlice";
import { ActivityFilter } from "../activityState";

const ActivityFilters = () => {
  const { filter, startDate } = useAppSelector((state) => state.activities);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const dispatch = useAppDispatch();

  const handleStartDate = (date: any) => {
    if (convertDateISOString(date) === startDate) return;
    setDateValue(new Date(date));
    dispatch(resetActivityRegistry());
    dispatch(setStartDate(convertDateISOString(dateValue)));
  };

  const handleFilter = (opt: ActivityFilter) => {
    if (opt === filter) return;
    dispatch(resetActivityRegistry());
    dispatch(setFilter(opt));
  };

  return (
    <>
      <Menu vertical size="large" style={{ width: "100%", marginTop: 25 }}>
        <Header icon="filter" attached color="teal" content="Filters" />
        <Menu.Item
          content="All Activites"
          active={filter === "all"}
          onClick={() => {
            handleFilter("all");
          }}
        />
        <Menu.Item
          content="I'm going"
          active={filter === "isGoing"}
          onClick={() => {
            handleFilter("isGoing");
          }}
        />
        <Menu.Item
          content="I'm hosting"
          active={filter === "isHost"}
          onClick={() => {
            handleFilter("isHost");
          }}
        />
      </Menu>
      <Header />
      <Calendar
        onChange={(date: any) => handleStartDate(date)}
        value={dateValue || new Date()}
      />
    </>
  );
};

export default ActivityFilters;
