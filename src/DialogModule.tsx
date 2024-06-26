// CustomizedDialogs.tsx

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getAccessToken } from './connectDB';
import axios from 'axios';

interface CustomizedDialogsProps {
    open: boolean;
    onClose: () => void;
    time: string;
    hoursprev: string;
    minsprev: string;
    LineID: string;
    refreshData: () => void;
    //   onSave: (hours: string, mins: string) => void; // Callback function to send data to another file
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const CustomizedDialogs: React.FC<CustomizedDialogsProps> = ({ open, onClose, time, hoursprev, minsprev, LineID, refreshData }) => {
    const [hours, setHours] = useState(hoursprev);
    const [mins, setMins] = useState(minsprev);
    const [timeday, setTimeday] = useState('');

    const handleTime = () => {
        if (time === "เช้า") {
            setTimeday("Morning");
        }
        else if (time === "กลางวัน") {
            setTimeday("Noon");
        }
        else if (time === "เย็น") {
            setTimeday("Evening");
        }
        else if (time === "ก่อนนอน") {
            setTimeday("Night");
        }
    }


    const handleClose = () => {
        onClose();
    };

    const handleSaveClick = () => {
        // onSave(hours, mins);
        handleClose();
    };

    const updateTime = async () => {
        try {
            const accessToken = await getAccessToken();
            const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne', {
                collection: 'NotifyTime',
                database: 'HealthCare',
                dataSource: 'HealthCareDemo',
                filter: {
                    LineID: LineID
                },
                update: {
                    $set: {
                        [timeday]: [hours ? hours : hoursprev, mins ? mins : minsprev]
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = responseFind.data;
            console.log(data);
            refreshData();

        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);

        }
    };

    useEffect(() => {
        handleTime();
        // Set initial state when the dialog opens
        setHours(hoursprev);
        setMins(minsprev);
    }, [time, hoursprev, minsprev]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleClose();
                    },
                }}
            >
                <DialogTitle>ตั้งค่าเวลา {time}</DialogTitle>
                <DialogContent sx={{ display: 'flex', gap: '10px' }}>
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel htmlFor="Time">ชั่วโมง</InputLabel>
                        <Select
                            autoFocus
                            label="Time"
                            value={hours}
                            onChange={(e) => {
                                setHours(e.target.value as string);
                            }}
                        >
                            {timeday === "Morning" && (
                                Array.from({ length: 4 }, (_, index) => (index + 6).toString().padStart(2, '0')).map((valueHours) => (
                                    <MenuItem key={valueHours} value={valueHours}>
                                        {valueHours}
                                    </MenuItem>
                                ))
                            )}
                            {timeday === "Noon" && (
                                Array.from({ length: 6 }, (_, index) => (index + 10).toString().padStart(2, '0')).map((valueHours) => (
                                    <MenuItem key={valueHours} value={valueHours}>
                                        {valueHours}
                                    </MenuItem>
                                ))
                            )}
                            {timeday === "Evening" && (
                                Array.from({ length: 4 }, (_, index) => (index + 16).toString().padStart(2, '0')).map((valueHours) => (
                                    <MenuItem key={valueHours} value={valueHours}>
                                        {valueHours}
                                    </MenuItem>
                                ))
                            )}
                            {timeday === "Night" && (
                                Array.from({ length: 4 }, (_, index) => (index + 20).toString().padStart(2, '0')).map((valueHours) => (
                                    <MenuItem key={valueHours} value={valueHours}>
                                        {valueHours}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel htmlFor="Mins">นาที</InputLabel>
                        <Select
                            label="Mins"
                            value={mins}
                            onChange={(e) => {
                                setMins(e.target.value as string);
                            }}
                        >
                            {Array.from({ length: 60 }, (_, index) => (index).toString().padStart(2, '0')).map((valueMins) => (
                                <MenuItem key={valueMins} value={valueMins}>
                                    {valueMins}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={updateTime}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default CustomizedDialogs;
