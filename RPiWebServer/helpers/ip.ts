import express = require('express');

export function get_request_ip(req: express.Request) : string
{
    return (req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress);
}