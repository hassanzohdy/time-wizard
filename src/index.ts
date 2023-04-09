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

interface TimeWizardContract {
  date: (date?: Parameters<typeof dayjs>[0]) => Dayjs;
  now: () => Dayjs;
  today: () => Dayjs;
  yesterday: () => Dayjs;
  tomorrow: () => Dayjs;
  toUTC: (date: Date) => Date;
  fromUTC: (date: Date) => Date;
  getTimezone: () => string;
  setTimezone: (timezone: string) => void;
}

export class TimeWizard implements TimeWizardContract {
  constructor(private timezone: string = "UTC") {}

  /**
   * Returns a new `Dayjs` instance representing the specified date and time in the current timezone.
   * If no date is specified, returns a new `Dayjs` instance representing the current date and time in the current timezone.
   */
  public date(date?: Parameters<typeof dayjs>[0]): Dayjs {
    if (date) {
      const dateInTimezone = dayjs(date).tz(this.timezone);
      return dayjs(dateInTimezone.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
    }
    return dayjs().tz(this.timezone);
  }

  /**
   * Returns a new `Dayjs` instance representing the current date and time in the current timezone.
   */
  public now(): Dayjs {
    return dayjs().tz(this.timezone);
  }

  /**
   * Returns a new `Dayjs` instance representing the start of the current day in the current timezone.
   */
  public today(): Dayjs {
    return this.date().startOf("day");
  }

  /**
   * Returns a new `Dayjs` instance representing the start of the previous day in the current timezone.
   */
  public yesterday(): Dayjs {
    return this.date().subtract(1, "day").startOf("day");
  }

  /**
   * Returns a new `Dayjs` instance representing the start of the next day in the current timezone.
   */
  public tomorrow(): Dayjs {
    return this.date().add(1, "day").startOf("day");
  }

  /**
   * Converts a `Date` object to the equivalent date and time in the UTC timezone.
   */
  public toUTC(date: Date): Date {
    return dayjs(date).utc().toDate();
  }

  /**
   * Converts a `Date` object representing a UTC date and time to the equivalent date and time in the current timezone.
   */
  public fromUTC(date: Date): Date {
    return dayjs(date).tz(this.timezone).toDate();
  }

  /**
   * Returns the current timezone.
   */
  public getTimezone(): string {
    return this.timezone;
  }

  /**
   * Sets the current timezone to the specified timezone.
   */
  public setTimezone(timezone: string): void {
    this.timezone = timezone;
  }
}

export const now = () => {
  return new TimeWizard(config.get("app.timezone", "UTC")).now();
};

export const today = () => {
  return new TimeWizard(config.get("app.timezone", "UTC")).today();
};

export const yesterday = () => {
  return new TimeWizard(config.get("app.timezone", "UTC")).yesterday();
};

export const tomorrow = () => {
  return new TimeWizard(config.get("app.timezone", "UTC")).tomorrow();
};

export const toUTC = (date: Date) => {
  return new TimeWizard(config.get("app.timezone", "UTC")).toUTC(date);
};

export const fromUTC = (date: Date) => {
  return new TimeWizard(config.get("app.timezone", "UTC")).fromUTC(date);
};

export const timeWizard = (timezone = config.get("app.timezone", "UTC")) => {
  return new TimeWizard(timezone);
};
