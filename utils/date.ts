import dayjs from "dayjs";

export function formatDate(date, format = 'DD MMM, YYYY [at] HH:mm A') {
    return dayjs(date).format(format)
}