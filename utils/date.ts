import dayjs from "dayjs";

export function formatDate(date) {
    return dayjs(date).format('DD MMM, YYYY [at] HH:mm A')
}