import http from 'http';
import express from 'express';

export function createServer(app: express.Application): http.Server {
    const port = 8080;
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(`SERVER : Running on port : ${port}`);
    });
    return server;
}
