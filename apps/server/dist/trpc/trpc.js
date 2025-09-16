"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRouters = exports.procedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const trpc = server_1.initTRPC.create();
exports.router = trpc.router;
exports.procedure = trpc.procedure;
exports.mergeRouters = trpc.mergeRouters;
//# sourceMappingURL=trpc.js.map