import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Pagination, styled, tableCellClasses} from "@mui/material";
import {useState} from "react";

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number,
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

interface RowProps {
    row: any;
    bottomColumnHeaders: Array<string>;
    bottomTableKey: string;
}

function Row({row, bottomColumnHeaders, bottomTableKey}: RowProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <StyledTableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell align="center">{row?.benefitLimitId}</StyledTableCell>
                <StyledTableCell align="center">{row?.mainBenefitCode}</StyledTableCell>
                <StyledTableCell align="center">{row?.mainBenefitName}</StyledTableCell>
                <StyledTableCell align="center">{row?.maxAllowedLimit}</StyledTableCell>
            </StyledTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Sub Benefits
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        {bottomColumnHeaders?.map((header: string, index) => <TableCell key={index} align={"center"}>{header}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                {row?.[bottomTableKey]?.length?
                                    <TableBody>
                                        {row?.[bottomTableKey]?.map((data: any, index2: number) => <TableRow key={index2}>
                                            {Object.entries(data).map(([key, value], index) => <React.Fragment key={index}>
                                                <TableCell align={"center"}>{<>{value}</>}</TableCell>
                                            </React.Fragment>)}
                                        </TableRow>)}
                                    </TableBody> :
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align={"center"} colSpan={bottomColumnHeaders.length+1}>No Data to Display</TableCell>
                                        </TableRow>
                                    </TableBody>
                                }
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface CollapsibleTableProps{
    tableData: Array<any>;
    topColumnHeaders: Array<string>;
    bottomColumnHeaders: Array<string>;
    bottomTableKey: string;
}

const StyledTableCell = styled(TableCell)(({theme}: any) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CollapsibleTable({tableData, topColumnHeaders, bottomColumnHeaders, bottomTableKey}: CollapsibleTableProps) {

    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);

    const paginatedData = tableData.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell />
                        {topColumnHeaders?.map((header: string, index) => <StyledTableCell align={"center"} key={index}>{header}</StyledTableCell>)}
                    </StyledTableRow>
                </TableHead>
                {paginatedData?.length?
                    <TableBody>
                        {tableData?.map((data: any, index) => <Row row={data} key={index} bottomColumnHeaders={bottomColumnHeaders} bottomTableKey={bottomTableKey}/>)}
                    </TableBody> :
                    <TableBody>
                        <StyledTableRow>
                            <StyledTableCell align={"center"} colSpan={topColumnHeaders.length+1}>No Data to Display</StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                }
            </Table>
            {(
                <div style={{display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 15}}>
                    {tableData?.length ? <Pagination count={Math.ceil(tableData.length / rowsPerPage)} color="primary"
                                                     onChange={handleChangePage} page={page}/> : <></>}
                </div>
            )}
        </TableContainer>
    );
}