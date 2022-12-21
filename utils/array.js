"use strict";
exports.__esModule = true;
exports.getRandomItemFromList = exports.getSelectOptions = exports.getSelectOption = exports.sortArrayOfObjects = void 0;
function sortArrayOfObjects(arr, property) {
    return arr.sort(function (a, b) {
        return a.property > b.property ? 1 : b.property > a.property ? -1 : 0;
    });
}
exports.sortArrayOfObjects = sortArrayOfObjects;
function getSelectOption(arr, labelProp, valueProp) {
    if (arr) {
        return { label: arr[labelProp], value: arr[valueProp] };
    }
    else {
        return { label: "", value: "" };
    }
}
exports.getSelectOption = getSelectOption;
function getSelectOptions(arr, labelProp, valueProp) {
    return arr.map(function (w) { return ({ label: w[labelProp], value: w[valueProp] }); });
}
exports.getSelectOptions = getSelectOptions;
function getRandomItemFromList(list) {
    var randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}
exports.getRandomItemFromList = getRandomItemFromList;
