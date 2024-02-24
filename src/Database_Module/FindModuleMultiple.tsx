import axios from "axios";
import { getAccessToken } from "../connectDB";

interface FindModuleParams {
  collection: string;
  database: string;
  filter: any;
}

interface FindModuleResponse {
  data: any; // Adjust the type according to your response structure
}

export async function FindModuleMultiple({
  collection,
  database,
  filter,
}: FindModuleParams): Promise<FindModuleResponse> {
  try {
    const accessToken = await getAccessToken();

    const responseFind = await axios.post(
      'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/find',
      {
        collection,
        database,
        dataSource: 'HealthCareDemo',
        filter,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const responseData: FindModuleResponse = {
      data: responseFind.data,
    };

    return responseData;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    // You might want to throw the error or handle it differently based on your needs
    throw error;
  }
}
