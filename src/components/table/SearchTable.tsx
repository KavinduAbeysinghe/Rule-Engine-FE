import {
  Pagination,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import ActionButton from "../buttons/ActionButton";

interface TableData {
  tableData: Array<any>;
  tableHeaders: Array<string>;
  id: string;
  actionButtons?: Array<any>;
  paginate: boolean;
}

const SearchTable = ({
  tableData,
  tableHeaders,
  id,
  actionButtons,
  paginate,
}: TableData) => {
  const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const paginatedData = tableData.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableHeaders?.map((header) => (
              <StyledTableCell key={header} align="center">
                {header}
              </StyledTableCell>
            ))}
            {actionButtons?.length ? (
              <StyledTableCell></StyledTableCell>
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        {tableData.length ? (
          <TableBody>
            {paginatedData?.map((row, index) => (
              <StyledTableRow key={index}>
                {Object.entries(row).map(([key, value], index2) => (
                  <React.Fragment key={index2}>
                    {key !== id && (
                      <StyledTableCell align="center">
                        {<>{value}</>}
                      </StyledTableCell>
                    )}
                  </React.Fragment>
                ))}
                {actionButtons?.length ? (
                  <StyledTableCell align="right">
                    {actionButtons?.map((b, index) => (
                      <ActionButton
                        key={index}
                        tooltip={b.tooltip}
                        icon={b.icon}
                        handleClick={() => {
                          return b.handleClick(row[id ? id : ""]);
                        }}
                      />
                    ))}
                  </StyledTableCell>
                ) : (
                  <></>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <StyledTableRow>
              <StyledTableCell
                align={"center"}
                colSpan={tableHeaders.length + 1}
              >
                No Data to Display
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        )}
      </Table>
      {paginate && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 15,
            marginBottom: 15,
          }}
        >
          {tableData?.length ? (
            <Pagination
              count={Math.ceil(tableData.length / rowsPerPage)}
              color="primary"
              onChange={handleChangePage}
              page={page}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </TableContainer>
  );
};

export default SearchTable;
