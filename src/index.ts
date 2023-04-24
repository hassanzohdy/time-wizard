import config from "@mongez/config";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export function initializeDayjs() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);
}

export const now = (): Date => {
  return toUTC(new Date());
};

export const today = () => {
  // get today's date in UTC timezone
  return dayjs(now()).startOf("day").toDate();
};

export const yesterday = () => {
  // get yesterday's date in UTC timezone
  return dayjs(now()).subtract(1, "day").startOf("day").toDate();
};

export const tomorrow = () => {
  // get tomorrow's date in UTC timezone
  return dayjs(now()).add(1, "day").startOf("day").toDate();
};

export const thisMonth = () => {
  // get this month's date in UTC timezone
  return dayjs(now()).startOf("month").toDate();
};

export const thisYear = () => {
  // get this year's date in UTC timezone
  return dayjs(now()).startOf("year").toDate();
};

export const toUTC = (date: Date) => {
  // convert the given date object to UTC timezone
  return new Date(
    date
      .toLocaleString("en-US", {
        timeZone: "UTC",
      })
      // @see https://stackoverflow.com/a/75226791
      .replace(/[\u202f]/, " ")
  );
};

export const fromUTC = (
  date: Date,
  timezone: string = config.get("app.timezone", "UTC")
) => {
  // convert the given UTC date object to the given timezone
  return new Date(
    date
      .toLocaleString("en-US", {
        timeZone: timezone,
      })
      .replace(/[\u202f]/, " ")
  );
};
