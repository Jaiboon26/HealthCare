import { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "./connectDB";
import { DeleteOne } from "./Database_Module/DeleteModule";
import axios from "axios";

function DeleteConfirmPage() {
    const { medicID } = useParams<{ medicID: string }>();
    const { medicName } = useParams<{ medicName: string }>();
    const { lineID } = useParams<{ lineID: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Medic ID:", medicName);
    }, [medicName]);

    const handleDelete = async () => {
        try {
            const accessToken = await getAccessToken();
            // First, perform the deletion using Axios
            await axios.post(
                'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne',
                {
                    collection: 'MedicDetail',
                    database: 'HealthCare',
                    dataSource: 'HealthCareDemo',
                    filter: { "LineID": lineID }, // Filter by LineID
                    update: {
                        $pull: { "Medicine": medicID } // Remove medicID from Medicine array
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Request-Headers': '*',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            // Second, perform the deletion using DeleteOne
            await DeleteOne({
                collection: "MedicineList",
                database: "HealthCare",
                filter: { "MedicID": medicID },
            });

            // Both deletions were successful
            console.log("Deleted:", medicID);
            // Redirect or navigate to another page after deletion
            navigate("/MedicDetailPage"); // Redirect to the home page, change the path as needed

        } catch (error) {
            // Handle deletion failure
            console.error('Error deleting:', error);
            // You can display an error message or handle the failure in any other way here
        }
    };
    const handleCancel = () => {
        // Cancel logic here, e.g., navigate back or to another page
        navigate("/MedicDetailPage"); // Navigate back to the home page, change the path as needed
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Typography variant="h5" gutterBottom>
                ต้องการลบ {medicName} ใช่หรือไม่
            </Typography>
            {/* <Typography variant="h4" gutterBottom>
                {medicName}
            </Typography>
            <Typography variant="h4" gutterBottom>
                ใช่หรือไม่
            </Typography> */}
            <div className="buttonGroup">

                <Button variant="contained" onClick={handleDelete} color="primary" style={{ marginRight: "10px" }}>
                    ใช่
                </Button>
                <Button variant="contained" onClick={handleCancel} color="error">
                    ไม่
                </Button>
            </div>
        </div>
    );
}

export default DeleteConfirmPage;
