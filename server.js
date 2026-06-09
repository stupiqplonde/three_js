import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({logger: true});
const port = 8000;

fastify.register(fastifyStatic, {root: __dirname})
fastify.get('/', (_, reply) => {
    reply.sendFile('index.html');
});

fastify.listen({port: port, host: '0.0.0.0'}, () => {
    console.log("server set")
})
