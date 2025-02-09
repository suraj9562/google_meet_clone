import axios from 'axios';
import {BASE_URL} from '../config';

export const createSession = async () => {
  try {
    const apiRes = await axios.post(`${BASE_URL}/create-session`);
    return apiRes?.data?.sessionId;
  } catch (error) {
    console.error(error.stack);
    return null;
  }
};

export const checkSession = async sessionId => {
  try {
    const apiRes = await axios.post(
      `${BASE_URL}/is-alive?sessionId=${sessionId}`,
    );
    return apiRes?.data?.isAlive;
  } catch (error) {
    console.error(error.stack);
    return false;
  }
};


