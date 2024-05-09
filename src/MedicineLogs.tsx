import React, { useEffect, useState } from 'react';
import { FindModuleMultiple } from './Database_Module/FindModuleMultiple';
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import liff from "@line/liff";

interface Medicine {
    _id: string;
    LineID: string;
    MedicID: string;
    MedicName: string;
    Morning: boolean;
    Noon: boolean;
    Evening: boolean;
    afbf: string;
    MedicPicture: string;
    status: string;
    datestamp: string;
    timestamp: string;
}


const MedicineLogs: React.FC = () => {
    const [medicinesByMonth, setMedicinesByMonth] = useState<{ [month: string]: { [date: string]: Medicine[] } }>({});

    const [openMonths, setOpenMonths] = useState<{ [month: string]: boolean }>({});

    const [pictureUrl, setPictureUrl] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [userID, setUserID] = useState("");

    let navigate = useNavigate();

    const handleSelect = (userID: string, date: string) => {
        navigate(`/MedicineLogs/${userID}/${date}`);
    };

    const initializeLiff = async () => {
        try {
            await liff.init({
                liffId: "2004903683-9qWnKnlZ"
            });

            //setMessage("LIFF init succeeded.");

            // login
            if (!liff.isLoggedIn()) {
                try {
                    await liff.login();
                } catch (error) {
                    console.error(error);
                }
            } else {
                const accessToken = liff.getIDToken();
                console.log(accessToken);
            }


            // Fetch user profile
            fetchUserProfile();
        } catch (e) {
            // setMessage("LIFF init failed.");
            // setError(`${e}`);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const profile = await liff.getProfile();
            const userProfile = profile.userId;
            const userDisplayName = profile.displayName;
            const statusMessage = profile.statusMessage;
            const userPictureUrl = profile.pictureUrl;


            setDisplayName(userDisplayName);
            setUserID(userProfile);
            setPictureUrl(userPictureUrl ?? "");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        initializeLiff();
    }, []);


    const handleClick = (month: string) => {
        setOpenMonths((prevOpenMonths) => ({
            ...prevOpenMonths,
            [month]: !prevOpenMonths[month]
        }));
    };

    const getMedic = async () => {
        try {
            const response = await FindModuleMultiple({
                collection: "MedicineLogs",
                database: "HealthCare",
                filter: {
                    LineID: userID
                },
            });

            // Access the data property from the response
            const responseData = response.data;

            if (responseData && responseData.documents) {
                // Group medicines by month and unique dates
                const groupedMedicines = responseData.documents.reduce((acc: { [month: string]: { [date: string]: Medicine[] } }, medicine: Medicine) => {
                    const [year, month, date] = medicine.datestamp.split('-');
                    const monthKey = `${year}-${month}`;
                    if (!acc[monthKey]) {
                        acc[monthKey] = {};
                    }
                    if (!acc[monthKey][date]) {
                        acc[monthKey][date] = [];
                    }
                    acc[monthKey][date].push(medicine);
                    return acc;
                }, {});

                setMedicinesByMonth(groupedMedicines);

                // Initialize open status for each month
                const months = Object.keys(groupedMedicines).reduce((acc: { [month: string]: boolean }, month: string) => {
                    acc[month] = false;
                    return acc;
                }, {});

                setOpenMonths(months);
            } else {
                console.log("Not found");
            }
        } catch (error) {
            // Handle errors
            console.error('Error in findProfile:', error);
        }
    }

    useEffect(() => {
        getMedic();
    }, [userID])

    return (
        <div>
            <div className="header" style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>

                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" sx={{
                        bgcolor: '#A8E3F0', borderRadius: '15px', marginBottom: '15px'
                    }}>
                        <Toolbar sx={{ justifyContent: 'center' }}> {/* Center content horizontally */}
                            <Avatar
                                alt={userID}
                                src={pictureUrl}
                                sx={{ width: '36px', height: '36px', marginRight: '10px' }} /> {/* Adjust margin if necessary */}
                            <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
                                ประวัติการกินยา
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>


            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {Object.entries(medicinesByMonth).map(([monthKey, medicinesByDate]) => {
                    const [year, month] = monthKey.split('-');

                    return (
                        <div className="main" style={{ display: 'flex', width: '100%', gap: '5px', marginBottom: '20px', flexDirection: 'column' }}>
                            <React.Fragment key={monthKey} >
                                <ListItemButton onClick={() => handleClick(monthKey)} sx={{ bgcolor: '#A8E3F0', borderRadius: '15px', marginLeft: '20px', marginRight: '20px', }}>
                                    <ListItemIcon>
                                        <CalendarMonthIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`เดือน ${month.toUpperCase()} ปี ${year}`} />
                                    {openMonths[monthKey] ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openMonths[monthKey]} timeout="auto" unmountOnExit>

                                    <List component="div" disablePadding sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                        {Object.entries(medicinesByDate).map(([date]) => (
                                            <div className="taskList" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '5px', marginLeft: '30px', marginRight: '30px', }}>
                                                <ListItemButton key={date} sx={{ pl: 4, bgcolor: '#A8E3F0', borderRadius: '15px' }} onClick={() => handleSelect(userID, monthKey + '-' + date)}>
                                                    <ListItemIcon>
                                                        <CalendarTodayIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={`วันที่ ${date} เดือน ${month.toUpperCase()} ปี ${year}`} />
                                                </ListItemButton>
                                            </div>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        </div>
                    );
                })}
            </List>
        </div>
    );
};

export default MedicineLogs;