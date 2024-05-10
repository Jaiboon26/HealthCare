import React, { useEffect, useState } from 'react';
import { FindModuleMultiple } from './Database_Module/FindModuleMultiple';
import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Avatar, Box, Toolbar, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import liff from "@line/liff";
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { FindModule } from './Database_Module/FindModule';

interface Column {
    id: 'name' | 'code' | 'population' | 'size' | 'density';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: { id: keyof MedicineReport; label: string; minWidth?: number; align?: 'center'; format?: (value: any) => string; }[] = [
    { id: 'MedicPicture', label: 'รูปยา', minWidth: 100, align: 'center' },
    { id: 'MedicName', label: 'ชื่อยา', minWidth: 100, align: 'center' },
    { id: 'stock', label: 'ได้รับ', minWidth: 40, align: 'center' },
    // Add more columns as needed
];



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

interface MedicineReport {
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
    stock: Int32Array;
    AcceptType: string;
}

interface MedicLeft {
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
    stock: Int32Array;
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
    const { userID } = useParams<{ userID: any }>();

    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const [medicList, setMedicList] = useState<MedicineReport[]>([]);
    const [medicLeft, setMedicLeft] = useState<MedicLeft[]>([]);
    const [medicIDList, setMedicIDList] = useState<[]>([]);


    let navigate = useNavigate();

    const handleSelect = (userID: string, date: string) => {
        navigate(`/MedicineLogs/${userID}/${date}`);
    };

    const getStartDate = async () => {

        try {

            if (!startDate) {
                console.error("Start date is null");
                return;
            }


            const response = await FindModuleMultiple({
                collection: "MedicineLogs",
                database: "HealthCare",
                filter: {
                    LineID: userID,
                    datestamp: startDate.format('YYYY-MM-DD'),
                    MatchedTime: 'Morning'  // Matches documents where datestamp is equal to startDate or endDate
                },
            });

            // Access the data property from the response
            const responseData = response.data;
            setMedicList(responseData.documents);
        } catch (error) {
            // Handle errors
            console.error('Error in findProfile:', error);
        }
    }

    const getLastDate = async () => {

        try {

            if (!endDate) {
                console.error("End date is null");
                return;
            }

            const medicIDArray = medicList.map((medicine: MedicineReport) => medicine.MedicID);

            const response = await FindModuleMultiple({
                collection: "MedicineLogs",
                database: "HealthCare",
                filter: {
                    LineID: userID,
                    MedicID: { $in: medicIDArray },
                    datestamp: endDate.format('YYYY-MM-DD'),
                    MatchedTime: 'Evening'  // Matches documents where datestamp is equal to startDate or endDate
                },
            });

            // Access the data property from the response
            const responseData = response.data;

            if (responseData && responseData.documents) {
                setMedicLeft(responseData.documents)
            } else {
                console.log("Not found");
            }
        } catch (error) {
            // Handle errors
            console.error('Error in findProfile:', error);
        }
    }

    useEffect(() => {
        getLastDate();
    }, [endDate])

    useEffect(() => {
        getStartDate();
    }, [startDate])

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

    const findProfile = async () => {
        try {
            const response = await FindModule({
                collection: "User",
                database: "HealthCare",
                filter: { LineID: userID }, //Change to liff
            });

            // Access the data property from the response
            const responseData = response.data;
            // console.log(responseData);

            if (responseData && responseData.document) {
                setPictureUrl(responseData.document.Picture);
                setDisplayName(responseData.document.Name);
                console.log(responseData.document.Picture);
                // updateMedic();
                // console.log(Object.keys(data.document.User).length);
            } else {
                console.log("Not found");
                // insertMedic();
                // initialUser();
            }

            // Continue with your logic here
        } catch (error) {
            // Handle errors
            console.error('Error in findProfile:', error);
        }
    }

    useEffect(() => {
        getMedic();
        findProfile();
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
                        // onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab icon={<CalendarMonthIcon />} label="ดูรายละเอียดตามวันที่" {...a11yProps(0)} />
                        <Tab icon={<SummarizeIcon />} label="ดูสรุปโดยเลือกวันที่" {...a11yProps(1)} />
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
                    <div className="index2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' }}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="เริ่มวันที่"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="สิ้นสุดวันที่"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                            />
                        </LocalizationProvider>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align || 'left'}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                            <TableCell align="center" sx={{ minWidth: '50px' }}>คงเหลือ</TableCell> {/* Add the last column header */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicList.map((medicine: MedicineReport) => {
                                            // Find the corresponding MedicLeft object based on MedicID
                                            const medicLeftItem = medicLeft.find((medicLeft: MedicLeft) => medicLeft.MedicID === medicine.MedicID);
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={medicine.MedicID}>
                                                    {columns.map((column, columnIndex) => {
                                                        const value = medicine[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align || 'left'}>
                                                                {/* Conditional rendering based on column */}
                                                                {columnIndex === 0 ? (
                                                                    <img src={medicine.MedicPicture} alt="Medicine" style={{ width: '100px' }} />
                                                                ) : (
                                                                    // Render text content for other columns
                                                                    column.format ? column.format(value) : value
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center">{medicLeftItem ? medicLeftItem.stock : 'ยาถูกลบไปแล้ว'}</TableCell> {/* Render the stock value */}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>

                </TabPanel>

            </Box>
        </div>
    );
};

export default MedicineLogs;