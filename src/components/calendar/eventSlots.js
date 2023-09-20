import React, { useEffect, useReducer, useState } from "react";
import { withUser } from "../../UI/warappers/withUser";
import { GenericForm } from "../../UI/index";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Done from "@material-ui/icons/Done";
import dateUtils from "../../utils/dateUtils";
import {
  saveRanges,
  selectAppointment
} from "../../redux/actions/eventsOperations";
import { listenForCalendarEvents } from "../../components/operationHub/operationUtils";
import LoadingCircular from "../../UI/loading/LoadingCircular";

export function EventSlots(props) {
  const CASE_DESCRIPTOR = {
    from: "dateTimePicker",
    to: "dateTimePicker",
    time: "selector"
  };
  const SELECTORS = {
    time: [
      { label: props.t("15 min"), value: "15MIN" },
      { label: props.t("30 min"), value: "30MIN" },
      { label: props.t("45 min"), value: "45MIN" },
      { label: props.t("1 hour"), value: "60MIN" }
    ]
  };
  let from = new Date();
  let to = new Date();
  from.setMinutes(0);
  from.setSeconds(0);
  to.setMinutes(0);
  to.setSeconds(0);
  to.setHours(to.getHours() + 1);
  const [dateRange, setDateRange] = useState({
    from,
    to,
    time: "15MIN"
  });
  const [globalState, setGlobalState] = useState({
    from,
    to,
    time: "15MIN"
  });
  const [filterDate, setFilterDate] = useState(new Date().getTime());
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  listenForCalendarEvents(setRanges, setLoading, props.userId, filterDate);

  function saveDates(props, entity) {
    console.log(JSON.stringify(entity));
    setDateRange({
      from: new Date(entity.from ? entity.from : globalState.from),
      to: new Date(entity.to ? entity.to : globalState.to),
      time: entity.time ? entity.time : globalState.time
    });
    setGlobalState({
      from: new Date(entity.from ? entity.from : globalState.from),
      to: new Date(entity.to ? entity.to : globalState.to),
      time: entity.time ? entity.time : globalState.time
    });
  }

  function timeToMinutes(timeSelect) {
    switch (timeSelect) {
      case "15MIN":
        return 15;
      case "30MIN":
        return 30;
      case "45MIN":
        return 45;
      case "60MIN":
        return 60;
      default:
        return 1;
    }
  }

  function dateMinutesDiff(from, to) {
    const delta = (to - from) / 1000 / 60;
    //console.log(`dateMinutesDiff: from=${from}, to=${to}, delta=${delta}`)
    return Math.round(delta);
  }

  function isLegal(dateRange) {
    if (dateRange.time === "none") return false;
    const minDiff = dateMinutesDiff(dateRange.from, dateRange.to);
    const minutes = timeToMinutes(dateRange.time);
    if (minDiff < minutes) return false; //'Minimal diff is insufficient'
    return true;
  }

  function isOverlap(intervals, interval) {
    intervals.sort((a, b) => a.start - b.start);
    for (let i = 1; i < interval; i++)
      if (intervals[i - 1].end > intervals[i].start) return true;
    return false;
  }

  function generateTimeSlots(dateRange) {
    let timeSlots = [];
    if (!isLegal(dateRange)) {
      return timeSlots;
    }
    let from = dateRange.from.getTime();
    const to = dateRange.to;
    const time = timeToMinutes(dateRange.time);
    while (dateMinutesDiff(from, to) >= time) {
      timeSlots.push({
        from,
        to: from + time * 60 * 1000,
        time: dateRange.time,
        id: `from ${from} to ${from + time * 60 * 1000}`
      });
      from = new Date(from + time * 60 * 1000).getTime();
    }
    return timeSlots;
  }

  function addDateRange(dateRange) {
    if (dateRange.time) {
      const timeSlots = generateTimeSlots(dateRange);
      // timeSlots.forEach(timeSlot => setRanges(ranges.concat(dateRange)))
      //setRanges(ranges.concat(dateRange))
      const uniqeRange = getUnique(ranges.concat(timeSlots));
      setRanges(uniqeRange);
    }
  }

  function getUnique(ranges) {
    let ids = [];
    let uniqueRanges = [];
    ranges.forEach(range => {
      if (!ids.includes(range.id)) {
        uniqueRanges.push(range);
        ids.push(range.id);
      }
    });
    return uniqueRanges;
  }

  function removeDateRange(range) {
    let newRanges = ranges.filter(currentRange => currentRange.id !== range.id);
    setRanges(newRanges);
  }

  function dateToString(ts) {
    return new Date(ts).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function dateDayToString(ts) {
    return new Date(ts).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function dateTimeToString(ts) {
    const date = new Date(ts);
    return `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") +
      date.getMinutes()}`;
  }

  function renderRange(range, select, isSelected, props) {
    if (isSelected && range.userId !== props.user.uid) {
      return <div></div>;
    }
    return (
      <div
        style={{
          width: "200px",
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderBottom: "1px solid",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="subtitle1">
          {dateDayToString(range.from)}
        </Typography>
        <Typography variant="subtitle1">
          {dateTimeToString(range.from)} - {dateTimeToString(range.to)}
        </Typography>
        {renderRangeAction(range, select, isSelected, props)}
      </div>
    );
  }

  function renderRangeAction(range, select, isSelected, props) {
    if (isSelected) {
      return range.userId === props.user.uid ? (
        <Button
          variant="outlined"
          style={{ marginBottom: 2 }}
          onClick={cancelAppointmentOperation.bind(this, range, props)}
        >
          {props.t("cancel")}
        </Button>
      ) : (
        <div></div>
      );
    }
    return range.selected ? (
      <div style={{ height: 36 }}>
        <Done style={{ color: "green" }} />
      </div>
    ) : select ? (
      <Button
        variant="outlined"
        style={{ marginBottom: 2 }}
        onClick={selectAppointmentOperation.bind(this, range, props)}
      >
        {props.t("select")}
      </Button>
    ) : (
      <Button
        variant="outlined"
        style={{ marginBottom: 2 }}
        onClick={removeDateRange.bind(this, range)}
      >
        {props.t("remove")}
      </Button>
    );
  }

  function chunkArray(myArray, chunk_size) {
    let arrayLength = myArray.length;
    let tempArray = [];
    for (let index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      tempArray.push(myChunk);
    }
    return tempArray;
  }

  function chunkArrayByDate(myArray) {
    let dateFilter = [];
    let dateSeparation = [
      ...new Set(myArray.map(range => getFormatDate(range.to)))
    ];
    dateSeparation.forEach(date => {
      dateFilter.push(
        myArray.filter(range => getFormatDate(range.to) === date)
      );
    });
    return dateFilter;
  }

  function getFormatDate(date) {
    return `${new Date(date).getDay()}/ ${new Date(date).getMonth()}/${new Date(
      date
    ).getYear()}`;
  }

  function saveDate() {
    props.saveRanges(props.user, ranges);
    props.operationDone();
    props.close();
  }

  let isSelected = isSelectedAppointment(ranges, props);
  let dateArray = chunkArrayByDate(ranges);
  return (
    <div
      style={{
        display: "flex",
        minHeight: 300,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginBottom: 20
      }}
    >
      {!props.select && (
        <GenericForm
          entity={dateRange}
          t={props.t}
          setState={saveDates.bind(this, dateRange)}
          selectorValues={SELECTORS}
          entityDescriptor={CASE_DESCRIPTOR}
          buttonTitle="Add Slot"
          save={addDateRange.bind(this)}
        />
      )}
      <div
        dir={props.direction}
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start"
        }}
      >
        {dateArray.map(dateRanges => (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "column"
            }}
          >
            {!isSelected && (
              <Typography variant="subtitle1">
                {dateUtils.dateFormater(dateRanges[0].to)}
              </Typography>
            )}
            <div style={{ height: 2 }}></div>
            {chunkArray(dateRanges, 5).map(rangeArray => (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                {rangeArray.map(range =>
                  renderRange(range, props.select, isSelected, props)
                )}
              </div>
            ))}
          </div>
        ))}

        {dateArray && dateArray.length > 0 && !props.select && (
          <div style={{ marginTop: 5 }}>
            <Button
              fullWidth
              variant="outlined"
              className={props.classes.button}
              onClick={saveDate.bind(this)}
            >
              {props.t("Save")}
            </Button>
          </div>
        )}
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {loading && <LoadingCircular open />}
          </div>
        </div>
      </div>
    </div>
  );
}

function isSelectedAppointment(ranges, props) {
  let selectedRange = ranges.filter(range => range.userId === props.user.uid);
  return selectedRange.length > 0;
}

function selectAppointmentOperation(range, props) {
  props.selectAppointment(props.user, range, props.userId, true);
  props.operationDone();
  props.close();
}

function cancelAppointmentOperation(range, props) {
  props.selectAppointment(props.user, range, props.userId, false);
  props.close();
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  saveRanges,
  selectAppointment
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(EventSlots)
);
