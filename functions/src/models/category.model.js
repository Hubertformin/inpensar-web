"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    color: String,
    scope: String
}, { timestamps: true });
var Category = (0, mongoose_1.model)('categories', categorySchema);
exports["default"] = Category;
