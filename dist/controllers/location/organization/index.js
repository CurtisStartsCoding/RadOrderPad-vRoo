"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLocation = exports.updateLocation = exports.getLocation = exports.createLocation = exports.listLocations = void 0;
const list_locations_1 = __importDefault(require("./list-locations"));
exports.listLocations = list_locations_1.default;
const create_location_1 = __importDefault(require("./create-location"));
exports.createLocation = create_location_1.default;
const get_location_1 = __importDefault(require("./get-location"));
exports.getLocation = get_location_1.default;
const update_location_1 = __importDefault(require("./update-location"));
exports.updateLocation = update_location_1.default;
const deactivate_location_1 = __importDefault(require("./deactivate-location"));
exports.deactivateLocation = deactivate_location_1.default;
//# sourceMappingURL=index.js.map