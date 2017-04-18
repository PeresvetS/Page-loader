import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

axios.defaults.adatper = httpAdapter;

export default axios;
