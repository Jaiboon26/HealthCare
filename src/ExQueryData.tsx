import { useEffect, useState } from "react";
import axios from 'axios';


const ExQueryData = () => {
    const [queriedid, setQueriedId] = useState('');
    const [queriedstatus, setQueriedStatus] = useState('');
    const [queriedText, setQueriedText] = useState('');

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
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjU5NjE4ODhkNjA0ZjZkNjEwNTRiZGI5IiwiZXhwIjoxNzA0MzQxNjkxLCJpYXQiOjE3MDQzMzk4OTEsImlzcyI6IjY1OTYyOWIzOGFlMTU4ZDUxZjljODU4OSIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY1OTYxODg4ZDYwNGY2ZDYxMDU0YmRiOSIsInN1YiI6IjY1OTYxYjQwOGFlMTU4ZDUxZjkxYzExMiIsInR5cCI6ImFjY2VzcyJ9.lfsXzm-xBvJNoR_EXxNv1f8CTw5TjM07AQYoBuSZR5Q',
                    },
                });

                const data = response.data;

                if (data && data.document && data.document.text) {
                    setQueriedId(`ID: ${data.document._id}`);
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
    }, []);

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