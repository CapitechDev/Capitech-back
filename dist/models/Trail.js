"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trail = void 0;
const mongoose_1 = require("mongoose");
exports.Trail = (0, mongoose_1.model)("Trail", new mongoose_1.Schema({
    description: {
        type: String,
        required: false,
        default: null,
    },
    video_description: {
        type: String,
        required: false,
        default: null,
    },
    name: {
        type: String,
        required: false,
        default: null,
    },
    references: {
        type: String,
        required: false,
        default: null,
    },
    iframe_references: {
        type: String,
        required: false,
        default: null,
    },
    subtitle: {
        type: String,
        required: false,
        default: null,
        unique: true,
    },
    video_title: {
        type: String,
        required: false,
        default: null,
    },
}));
//# sourceMappingURL=Trail.js.map