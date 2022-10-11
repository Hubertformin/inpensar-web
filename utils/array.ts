export function sortArrayOfObjects(arr: any[], property: string) {
  return arr.sort((a, b) =>
    a.property > b.property ? 1 : b.property > a.property ? -1 : 0
  );
}

export function getSelectOption(
  arr: any,
  labelProp: string,
  valueProp: string
): { value: string; label: string } {
  if (arr) {
    return { label: arr[labelProp], value: arr[valueProp] };
  } else {
    return { label: "", value: "" };
  }
}

export function getSelectOptions(
  arr: any,
  labelProp: string,
  valueProp: string
): Array<{ value: string; label: string }> {
  return arr.map((w) => ({ label: w[labelProp], value: w[valueProp] }));
}
