import React, { useEffect, useState } from 'react';
import { FindModuleMultiple } from './Database_Module/FindModuleMultiple';
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import liff from "@line/liff";
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

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

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
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
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}



const MedicineLogs: React.FC = () => {
    const [medicinesByMonth, setMedicinesByMonth] = useState<{ [month: string]: { [date: string]: Medicine[] } }>({});

    const [openMonths, setOpenMonths] = useState<{ [month: string]: boolean }>({});

    const [pictureUrl, setPictureUrl] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [userID, setUserID] = useState("Uc1e97d3b9701a31fba1f9911852eeb8f");

    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    let navigate = useNavigate();

    const handleSelect = (userID: string, date: string) => {
        navigate(`/MedicineLogs/${userID}/${date}`);
    };

    // const initializeLiff = async () => {
    //     try {
    //         await liff.init({
    //             liffId: "2004903683-9qWnKnlZ"
    //         });

    //         //setMessage("LIFF init succeeded.");

    //         // login
    //         if (!liff.isLoggedIn()) {
    //             try {
    //                 await liff.login();
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         } else {
    //             const accessToken = liff.getIDToken();
    //             console.log(accessToken);
    //         }


    //         // Fetch user profile
    //         fetchUserProfile();
    //     } catch (e) {
    //         // setMessage("LIFF init failed.");
    //         // setError(`${e}`);
    //     }
    // };

    // const fetchUserProfile = async () => {
    //     try {
    //         const profile = await liff.getProfile();
    //         const userProfile = profile.userId;
    //         const userDisplayName = profile.displayName;
    //         const statusMessage = profile.statusMessage;
    //         const userPictureUrl = profile.pictureUrl;


    //         setDisplayName(userDisplayName);
    //         setUserID(userProfile);
    //         setPictureUrl(userPictureUrl ?? "");
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // useEffect(() => {
    //     initializeLiff();
    // }, []);


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
        // <div>
        //     <Tabs
        //         value={value}
        //         onChange={handleChange}
        //         variant="scrollable"
        //         scrollButtons="auto"
        //         aria-label="scrollable auto tabs example"
        //     >
        //         <Tab label="Item One" />
        //         <Tab label="Item Two" />
        //     </Tabs>
        //     <SwipeableDrawer
        //         anchor="bottom"
        //         open={open}
        //         onClose={toggleDrawer(false)}
        //         onOpen={toggleDrawer(true)}
        //         disableBackdropTransition
        //         disableDiscovery
        //     >
        //         <Box
        //             sx={{ width: 250, height: 'auto', bgcolor: 'background.paper', p: 2 }}
        //             role="presentation"
        //             onClick={toggleDrawer(false)}
        //             onKeyDown={toggleDrawer(false)}
        //         >
        //             <Typography variant="h6" gutterBottom>
        //                 Swipeable Tabs Content
        //             </Typography>
        //             <Typography variant="body1">
        //                 Tab {value + 1} Content
        //             </Typography>
        //         </Box>
        //     </SwipeableDrawer>

        //     {value === 0 && (
        //         <div className="firstTab">

        // <div className="header" style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>

        //     <Box sx={{ flexGrow: 1 }}>
        //         <AppBar position="static" sx={{
        //             bgcolor: '#A8E3F0', borderRadius: '15px', marginBottom: '15px'
        //         }}>
        //             <Toolbar sx={{ justifyContent: 'center' }}> {/* Center content horizontally */}
        //                 <Avatar
        //                     alt={userID}
        //                     src={pictureUrl}
        //                     sx={{ width: '36px', height: '36px', marginRight: '10px' }} /> {/* Adjust margin if necessary */}
        //                 <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
        //                     ประวัติการกินยาของ <br /> {displayName}
        //                 </Typography>
        //             </Toolbar>
        //         </AppBar>
        //     </Box>
        // </div>


        // <List
        //     sx={{ width: '100%', bgcolor: 'background.paper' }}
        //     component="nav"
        //     aria-labelledby="nested-list-subheader"
        // >
        //     {Object.entries(medicinesByMonth).map(([monthKey, medicinesByDate]) => {
        //         const [year, month] = monthKey.split('-');

        //         return (
        //             <div className="main" style={{ display: 'flex', width: '100%', gap: '5px', marginBottom: '20px', flexDirection: 'column' }}>
        //                 <React.Fragment key={monthKey} >
        //                     <ListItemButton onClick={() => handleClick(monthKey)} sx={{ bgcolor: '#A8E3F0', borderRadius: '15px', marginLeft: '20px', marginRight: '20px', }}>
        //                         <ListItemIcon>
        //                             <CalendarMonthIcon />
        //                         </ListItemIcon>
        //                         <ListItemText primary={`เดือน ${month.toUpperCase()} ปี ${year}`} />
        //                         {openMonths[monthKey] ? <ExpandLess /> : <ExpandMore />}
        //                     </ListItemButton>
        //                     <Collapse in={openMonths[monthKey]} timeout="auto" unmountOnExit>

        //                         <List component="div" disablePadding sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
        //                             {Object.entries(medicinesByDate).map(([date]) => (
        //                                 <div className="taskList" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '5px', marginLeft: '30px', marginRight: '30px', }}>
        //                                     <ListItemButton key={date} sx={{ pl: 4, bgcolor: '#A8E3F0', borderRadius: '15px' }} onClick={() => handleSelect(userID, monthKey + '-' + date)}>
        //                                         <ListItemIcon>
        //                                             <CalendarTodayIcon />
        //                                         </ListItemIcon>
        //                                         <ListItemText primary={`วันที่ ${date} เดือน ${month.toUpperCase()} ปี ${year}`} />
        //                                     </ListItemButton>
        //                                 </div>
        //                             ))}
        //                         </List>
        //                     </Collapse>
        //                 </React.Fragment>
        //             </div>
        //         );
        //     })}
        // </List>
        //         </div>
        //     )}
        // </div>
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
                            <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
                                ประวัติการกินยาของ <br /> {displayName}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>

            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab icon={<CalendarMonthIcon />} label="ดูรายละเอียดตามวันที่" {...a11yProps(0)} />
                        <Tab icon={<SummarizeIcon />} label="ดูสรุปตามรอบที่หมอนัด" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0} dir={theme.direction}>
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper', padding: 0 }}
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
                                                {/* Extract and sort the dates */}
                                                {Object.keys(medicinesByDate)
                                                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                                                    .map((date) => (
                                                        <div className="taskList" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '5px', marginLeft: '30px', marginRight: '30px' }} key={date}>
                                                            <ListItemButton sx={{ pl: 4, bgcolor: '#A8E3F0', borderRadius: '15px' }} onClick={() => handleSelect(userID, monthKey + '-' + date)}>
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
                </TabPanel>

                <TabPanel value={value} index={1} dir={theme.direction}>
                    <div>
                        <Accordion sx={{ bgcolor: '#A8E3F0' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                รอบวันที่ 29/4/2024 - 25/5/2024
                            </AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'white', paddingLeft: '0', paddingRight: '0', paddingTop: '10px' }}>

                                <div className="StackList" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                                    <Stack
                                        direction="row"
                                        divider={<Divider orientation="vertical" flexItem />}
                                        spacing={1}
                                        width="100%" // Set width to 100%
                                    >
                                        <Item>
                                            <img src="https://placehold.co/600x400" alt="" style={{ width: '100px' }} />
                                        </Item>
                                        <Item>พาราเซตตามอล</Item>
                                        <Item>ได้รับ 30</Item>
                                        <Item>คงเหลือ 5</Item>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        divider={<Divider orientation="vertical" flexItem />}
                                        spacing={1}
                                        width="100%" // Set width to 100%
                                    >
                                        <Item>
                                            <img src="https://placehold.co/600x400" alt="" style={{ width: '100px' }} />
                                        </Item>
                                        <Item>พาราเซตตามอล</Item>
                                        <Item>ได้รับ 30</Item>
                                        <Item>คงเหลือ 5</Item>
                                    </Stack>

                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                Accordion 2
                            </AccordionSummary>
                            <AccordionDetails>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </TabPanel>

            </Box>
        </div>
    );
};

export default MedicineLogs;
