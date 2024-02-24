import axios from "axios";
import { getAccessToken } from "../connectDB";

interface InsertModuleParams {
    collection: string;
    database: string;
    document: any;
}

interface InsertModuleRespond {
    data: any; // Adjust the type according to your response structure
}

export async function InsertModule({
    collection,
    database,
    document,
}: InsertModuleParams): Promise<InsertModuleRespond> {
    try {
        const accessToken = await getAccessToken();

        const responseFind = await axios.post(
            'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne',
            {
                collection,
                database,
                dataSource: 'HealthCareDemo',
                document,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        const responseData: InsertModuleRespond = {
            data: responseFind.data,
        };

        return responseData;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        // You might want to throw the error or handle it differently based on your needs
        throw error;
    }
}
