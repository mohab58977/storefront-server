"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUID = void 0;
const generateUID = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
exports.generateUID = generateUID;
