"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const trail_routes_1 = __importDefault(require("./trail.routes"));
exports.default = [auth_routes_1.default, user_routes_1.default, trail_routes_1.default];
//# sourceMappingURL=index.js.map