"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get_request_ip(req) {
    return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress);
}
exports.get_request_ip = get_request_ip;
//# sourceMappingURL=ip.js.map