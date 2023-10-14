import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import WarningIcon from '@mui/icons-material/Warning';
import { Box } from '@mui/material';

interface AlertDialogProps {
    message: string;
    handleYesClick: () => void;
    handleNoClick: () => void;
    openAlert: boolean;
    setOpenAlert: any;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({message, handleYesClick, handleNoClick, openAlert, setOpenAlert}: AlertDialogProps) {

    return (
            <Dialog
                open={openAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenAlert(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle sx={{color: "red", fontWeight: 600, textAlign: "center"}}>Warning!</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} justifyContent={"center"}>
                        <WarningIcon sx={{fontSize: "80px", textAlign: "center"}} color={"warning"}/>
                    </Box>
                    <DialogContentText id="alert-dialog-slide-description" sx={{textAlign: "center"}}>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleYesClick}>Yes</Button>
                    <Button onClick={handleNoClick}>No</Button>
                </DialogActions>
            </Dialog>

    );
}