import dayjs from "dayjs";

/**
 * The formatDate function formats a date object into a string.
 *
 *
 * @param date Format the date in a specific format
 * @param format Format the date in a particular way
 *
 * @return The date in the format dd mmm, yyyy [at] hh:mm a
 *
 * @docauthor Trelent
 */
export function formatDate(date, format = "DD MMM, YYYY [at] hh:mm A") {
    return dayjs(date).format(format)
}