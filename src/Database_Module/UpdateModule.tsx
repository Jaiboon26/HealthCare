import axios from "axios";
import { getAccessToken } from "../connectDB";

interface UpdateModuleParams {
    collection: string;
    database: string;
    filter: any;
    data: string;
}

interface UpdateModuleRespond {
    data: any; // Adjust the type according to your response structure
}

export async function UpdateModule({
    collection,
    database,
    filter,
    data,
    
}: UpdateModuleParams): Promise<UpdateModuleRespond> {
    try {
        const accessToken = await getAccessToken();

        const responseFind = await axios.post(
            'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne',
            {
                collection,
                database,
                dataSource: 'HealthCareDemo',
                filter,
                update: {
                    $push: {
                      'User': data
                    }
                  },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        const responseData: UpdateModuleRespond = {
            data: responseFind.data,
        };

        return responseData;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        // You might want to throw the error or handle it differently based on your needs
        throw error;
    }
}
