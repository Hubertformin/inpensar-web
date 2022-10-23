import dayjs from "dayjs";

export function formatDate(date, format = 'DD MMM, YYYY [at] hh:mm A') {
    return dayjs(date).format(format)
}