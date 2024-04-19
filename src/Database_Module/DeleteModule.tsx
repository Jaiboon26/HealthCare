import axios from "axios";
import { getAccessToken } from "../connectDB";

interface DeleteOneParams {
    database: string;
    collection: string;
    filter: any;
}

export async function DeleteOne({
    database,
    collection,
    filter,
}: DeleteOneParams): Promise<void> {
    try {
        const accessToken = await getAccessToken();

        await axios.post(
            'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/deleteOne',
            {
                dataSource: 'HealthCareDemo',
                database,
                collection,
                filter,
            },
            {
                headers: {
                    'Content-Type': 'application/ejson',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        console.log('Deleted successfully');
    } catch (error) {
        console.error('Error deleting data from MongoDB:', error);
        // You might want to throw the error or handle it differently based on your needs
        throw error;
    }
}
