
export function sortArrayOfObjects(arr: any[], property: string) {
    return arr.sort((a,b) => (a.property > b.property) ? 1 : ((b.property > a.property) ? -1 : 0))
}