import React, { useEffect, useState } from 'react';
import { FindModuleMultiple } from './Database_Module/FindModuleMultiple';
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Avatar, Box, Toolbar, Typography, Tab, Tabs, Card, CardContent, Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';

interface Medicine {
    MatchedTime: string;
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
    stock: Int32Array
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const MedicineLogsByDate: React.FC = () => {
    const { userID } = useParams<{ userID: any }>();
    const { date } = useParams<{ date: any }>();

    const [value, setValue] = React.useState(0);

    const [medicinesByMonth, setMedicinesByMonth] = useState<{
        Morning?: Medicine[];
        Noon?: Medicine[];
        Evening?: Medicine[];
    }>({});


    const [openMonths, setOpenMonths] = useState<{ [month: string]: boolean }>({});

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



    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getMedic = async () => {
        try {
            const response = await FindModuleMultiple({
                collection: "MedicineLogs",
                database: "HealthCare",
                filter: {
                    LineID: userID,
                    datestamp: date
                },
            });

            // Access the data property from the response
            const responseData = response.data;

            if (responseData && responseData.documents) {
                console.log(responseData.documents)

                const morningMedicines = responseData.documents.filter((medicine: Medicine) => medicine.MatchedTime === 'Morning');
                const noonMedicines = responseData.documents.filter((medicine: Medicine) => medicine.MatchedTime === 'Noon');
                const eveningMedicines = responseData.documents.filter((medicine: Medicine) => medicine.MatchedTime === 'Evening');

                // Update state with filtered medicines
                setMedicinesByMonth({
                    'Morning': morningMedicines,
                    'Noon': noonMedicines,
                    'Evening': eveningMedicines
                });

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

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                        <Tab label="เข้า" {...a11yProps(0)} />
                        <Tab label="กลางวัน" {...a11yProps(1)} sx={{ marginLeft: '30px', marginRight: '30px' }} />
                        <Tab label="เย็น" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                {medicinesByMonth['Morning']?.length ? (
                    medicinesByMonth['Morning']?.map((medicine: Medicine) => (
                        <CustomTabPanel key={medicine._id} value={value} index={0}>
                            {medicine.MedicName}
                        </CustomTabPanel>
                    ))
                ) : (
                    <CustomTabPanel value={value} index={0}>
                        <h1 style={{ textAlign: 'center' }}>ไม่มีประวัติการกินยา</h1>
                    </CustomTabPanel>
                )}
                {medicinesByMonth['Noon']?.map((medicine: Medicine) => (
                    <CustomTabPanel key={medicine._id} value={value} index={1}>
                        <div key={medicine.MedicID} style={{ overflow: 'hidden', border: '2px dashed #a8e3f0' }}>

                            <Card sx={{
                                display: 'grid',
                                gridTemplateRows: 'auto auto', // Two rows of auto height
                                gridTemplateColumns: 'auto auto',
                                height: "auto",
                                alignItems: 'center',
                                justifyContent: 'center',
                                // bgcolor: '#A8E3F0',
                                boxShadow: '0px 0px 4px 2px #A8E3F0, 0px 1px 1px 0px #A8E3F0, 0px 1px 3px 0px #A8E3F0',
                                minWidth: '310px',
                                position: 'relative',
                            }}>
                                <button
                                    onClick={() => {
                                        // setModalOpen(true); // Open the modal
                                        // setSelectedImage(medicine.MedicPicture); // Set the selected image URL
                                    }}
                                    style={{ background: 'none', border: 'none', padding: '0', margin: '0', cursor: 'pointer' }}
                                >
                                    <Avatar
                                        alt={medicine.MedicName}
                                        src={medicine.MedicPicture}
                                        sx={{ width: '75px', height: '75px', marginLeft: '10px', marginTop: '10px', borderRadius: '0px' }}
                                    />
                                </button>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <Typography component="div" variant="h5">
                                            {medicine.MedicName}
                                        </Typography>
                                        <Typography variant="subtitle2">รับประทานเมื่อ {medicine.timestamp}</Typography>
                                    </CardContent>
                                </Box>
                            </Card>

                        </div>
                    </CustomTabPanel>
                ))}
                {medicinesByMonth['Evening']?.map((medicine: Medicine) => (
                    <CustomTabPanel key={medicine._id} value={value} index={2}>
                        {medicine.MedicName}
                    </CustomTabPanel>
                ))}
            </Box>
        </div >
    );
};

export default MedicineLogsByDate;
