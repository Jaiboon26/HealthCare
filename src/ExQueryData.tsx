// ConnectDB.tsx
import { useEffect, useState } from "react";
import axios from 'axios';
import { ConnectDB } from "./connectDB";

// export function ConnectDB() {
//     const [accessToken, setAccessToken] = useState('');

//     useEffect(() => {
//         const fetchDataFromMongoDB = async () => {
//             try {
//                 const datakey = JSON.stringify({
//                     "key": "42Mj5aTcsC0gDjJtE818IKNasjZreviaQUuui8pPMEzcYauqAxmL3ohRnTrcIKge"
//                 });

//                 const config = {
//                     method: 'post',
//                     url: 'https://realm.mongodb.com/api/client/v2.0/app/data-gcfjf/auth/providers/api-key/login',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Access-Control-Request-Headers': '*',
//                     },
//                     data: datakey,
//                 };

//                 const response = await axios(config);

//                 console.log(JSON.stringify(response.data));

//                 if (response.data) {
//                     setAccessToken(response.data.access_token);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data from MongoDB:', error);
//             }
//         };

//         fetchDataFromMongoDB();
//     }, []);

//     return accessToken;
// }

const ExQueryData = () => {
    const [queriedid, setQueriedId] = useState('');
    const [queriedstatus, setQueriedStatus] = useState('');
    const [queriedText, setQueriedText] = useState('');
    const accessToken = ConnectDB();

    useEffect(() => {
        const fetchDataFromMongoDB = async () => {
            try {
                const response = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/findOne', {
                    collection: 'User',
                    database: 'HealthCare',
                    dataSource: 'HealthCareDemo',
                    filter: {
                        status: 'open',
                    },
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Request-Headers': '*',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const data = response.data;
                console.log(accessToken);

                if (data && data.document && data.document.text) {
                    setQueriedId(`ID: ${data.document.text}`);
                    setQueriedStatus(`Status: ${data.document.status}`);
                    setQueriedText(`Text: ${data.document.text}`);
                } else {
                    setQueriedText('No text found for the specified filter.');
                }
            } catch (error) {
                console.error('Error fetching data from MongoDB:', error);
                setQueriedText('Error fetching data from MongoDB.');
            }
        };

        fetchDataFromMongoDB();
    }, [accessToken]);

    return (
        <div>
            <p>{queriedid}</p>
            <br />
            <p>{queriedstatus}</p>
            <br />
            <p>{queriedText}</p>
            {/* Your component JSX */}
        </div>
    );
};

export default ExQueryData;
