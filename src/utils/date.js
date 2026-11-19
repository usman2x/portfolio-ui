// Dates are formatted in UTC so the static build (UTC on the VM) and every visitor's browser render
// the same text; formatting in local time made hydration fail across timezones.
const formatters = {
  short: new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }),
  long: new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" }),
}

export const formatDate = (date, style = "short") => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime()) ? "" : formatters[style].format(parsedDate)
}
