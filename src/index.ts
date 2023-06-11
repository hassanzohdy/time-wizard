import config from "@mongez/config";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import dailyUtc from "dayjs/plugin/utc";

export function initializeDayjs() {
  dayjs.extend(dailyUtc);
  dayjs.extend(timezone);
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);
}

export const now = (): Date => {
  return new Date();
};

export const today = (): Date => {
  // get today's date in UTC timezone
  return dayjs().startOf("day").toDate();
};

export const yesterday = (): Date => {
  // get yesterday's date in UTC timezone
  return dayjs().subtract(1, "day").startOf("day").toDate();
};

export const tomorrow = (): Date => {
  // get tomorrow's date in UTC timezone
  return dayjs().add(1, "day").startOf("day").toDate();
};

export const thisMonth = (): Date => {
  // get this month's date in UTC timezone
  return dayjs().startOf("month").toDate();
};

export const thisYear = (): Date => {
  // get this year's date in UTC timezone
  return dayjs().startOf("year").toDate();
};

export function tz(
  date: Date,
  timezone: string = config.get("app.timezone", "UTC")
) {
  // convert the given date object to the given timezone
  return new Date(
    date
      .toLocaleString("en-US", {
        timeZone: timezone,
      })
      // @see https://stackoverflow.com/a/75226791
      .replace(/[\u202f]/, " ")
  );
}

export const toUTC = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
};

export const utc = toUTC;

export const fromUTC = (
  date: Date,
  timezone: string = config.get("app.timezone", "UTC")
) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: false,
  };
  const targetTime: string = date.toLocaleString("en-US", options);

  // now split the string to get the date and time
  const [datePart, timePart] = targetTime.split(", ");

  // split the time to get the hour
  const [hour, minute, second] = timePart.split(":").map(Number);

  // split the date to get the month and day
  const [month, day, year] = datePart.split("/").map(Number);

  // return the date with the date
  return new Date(year, month - 1, day, hour, minute, second);
};
