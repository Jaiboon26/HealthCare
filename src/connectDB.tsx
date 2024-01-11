// https://realm.mongodb.com/api/client/v2.0/app/data-gcfjf/auth/providers/api-key/login
import { useEffect, useState } from "react";
import axios from 'axios';

export function ConnectDB() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const fetchDataFromMongoDB = async () => {
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

                console.log(JSON.stringify(response.data));

                if (response.data) {
                    setAccessToken(response.data.access_token);
                }
            } catch (error) {
                console.error('Error fetching data from MongoDB:', error);
            }
        };

        fetchDataFromMongoDB();
    }, []);

    return (
        accessToken
    );
};