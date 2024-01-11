// https://realm.mongodb.com/api/client/v2.0/app/data-gcfjf/auth/providers/api-key/login
import { useEffect, useState } from "react";
import axios from 'axios';

export function getAccessToken() {
  return new Promise(async (resolve, reject) => {
    try {
      const datakey = JSON.stringify({
        "key": "42Mj5aTcsC0gDjJtE818IKNasjZreviaQUuui8pPMEzcYauqAxmL3ohRnTrcIKge"
      });

      const config = {
        method: 'post',
        url: 'https://realm.mongodb.com/api/client/v2.0/app/data-gcfjf/auth/providers/api-key/login',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
        },
        data: datakey,
      };

      const response = await axios(config);

      if (response.data && response.data.access_token) {
        resolve(response.data.access_token);
      } else {
        reject(new Error('Access token not found.'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
