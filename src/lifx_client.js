import axios from 'axios';

const lifxClient = axios.create({
  baseURL: 'https://api.lifx.com/v1/',
  timeout: 10000,
  headers: {'Authorization': 'Bearer c664667a0a59538c44f138d7a70ed485b71f970d2c49b1a6796e9623029aed47'}
});

export default lifxClient;
