import moment from "moment"

export const getNthWeekday = (month: number, weekday: number, n: number) => {
  let firstWeekday = moment()
    .set("year", moment().year())
    .set("month", month)
    .set("date", 1)
    .isoWeekday(weekday + 7)
  if (firstWeekday.date() > 7) {
    //
    firstWeekday = firstWeekday.isoWeekday(-6)
  }
  return firstWeekday.add(n * 7, "days")
}
