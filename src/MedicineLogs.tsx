import React, { useEffect, useState } from 'react';
import { FindModuleMultiple } from './Database_Module/FindModuleMultiple';
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

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
    const [userID, setUserID] = useState("Uc1e97d3b9701a31fba1f9911852eeb8f");

    let navigate = useNavigate();

    const handleSelect = (userID: string, date: string) => {
        navigate(`/MedicineLogs/${userID}/${date}`);
    };


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
                    LineID: 'Uc1e97d3b9701a31fba1f9911852eeb8f'
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
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{
                    bgcolor: '#A8E3F0', borderRadius: '15px', marginBottom: '15px'
                }}>
                    <Toolbar sx={{ justifyContent: 'center' }}> {/* Center content horizontally */}
                        <Avatar
                            // alt={userID}
                            // src={userPIC}
                            sx={{ width: '36px', height: '36px', marginRight: '10px' }} /> {/* Adjust margin if necessary */}
                        <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
                            ประวัติการกินยา
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {Object.entries(medicinesByMonth).map(([monthKey, medicinesByDate]) => {
                    const [year, month] = monthKey.split('-');

                    return (
                        <React.Fragment key={monthKey} >
                            <ListItemButton onClick={() => handleClick(monthKey)} sx={{ bgcolor: '#A8E3F0', borderRadius: '15px' }}>
                                <ListItemIcon>
                                    <CalendarMonthIcon />
                                </ListItemIcon>
                                <ListItemText primary={`เดือน ${month.toUpperCase()} ปี ${year}`} />
                                {openMonths[monthKey] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openMonths[monthKey]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    {Object.entries(medicinesByDate).map(([date]) => (
                                        <ListItemButton key={date} sx={{ pl: 4, bgcolor: '#A8E3F0', borderRadius: '15px' }} onClick={() => handleSelect(userID, monthKey + '-' + date)}>
                                            <ListItemIcon>
                                                <CalendarTodayIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={`วันที่ ${date}`} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    );
                })}
            </List>
        </div>
    );
};

export default MedicineLogs;
