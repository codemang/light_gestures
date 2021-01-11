import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import { spawn } from 'child_process';
import http from 'http';

const child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1280', '-h', '1024', '-t', '999999999', '-fps', '20', '-b', '5000000', '-o', '-']);
const server = http.createServer((request, response) => {
  console.log(response);
});

server.listen(8080);
