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
    LineID: string;
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

const CustomizedDialogs: React.FC<CustomizedDialogsProps> = ({ open, onClose, time, LineID }) => {
    const [hours, setHours] = useState('');
    const [mins, setMins] = useState('');
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
                        timeday: [hours , mins]
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
        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);

        }
    };

    useEffect(() => {
        handleTime();
        console.log(timeday);
    })

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
                            {Array.from({ length: 25 }, (_, index) => index.toString().padStart(2, '0')).map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel htmlFor="Mins">นาที</InputLabel>
                        <Select
                            label="Mins"
                            onChange={(e) => {
                                setMins(e.target.value as string);
                            }}
                        >
                            {Array.from({ length: 12 }, (_, index) => (index * 5).toString().padStart(2, '0')).map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
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
