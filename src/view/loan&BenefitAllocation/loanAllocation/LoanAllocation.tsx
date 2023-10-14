import {Box, Button, Chip} from "@mui/material";
import SearchTable from "../../components/table/SearchTable";
import {axiosInstance} from "../../api/store";
import {useEffect, useState} from "react";
import {faEye, faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import CustomModal from "../../components/modal/CustomModal";
import LoanAllocationForm from "./LoanAllocationForm";
import AlertDialogSlide from "../../components/modal/AlertDialog";

interface LoanAllocationProps {
    notify: any;
    setLoading: (loading: boolean) => void;
    categoryId: any;
    categoryData: Array<any>;
}

const LoanAllocation = ({notify, setLoading, categoryId, categoryData}: LoanAllocationProps) => {

    const [showModal, setShowModal] = useState<boolean>(false);

    const [modalTitle, setModalTitle] = useState<string>("");

    const [modalBody, setModalBody] = useState<any>(null);

    const [loanTableData, setLoanTableData] = useState<Array<any>>([]);

    const [loanTableHeaders, setLoanTableHeaders] = useState<Array<any>>([
        "Loan Code", "Loan Description", "Status"
    ]);

    const [showAlert, setShowAlert] = useState<boolean>(false);

    const formatTableData = (data: Array<any>) => {
        return data?.map((d: any) => ({
            loanId: d?.loanId,
            loanCode: d?.loanCode,
            loanDescription: d?.loanDescription,
            status: d?.isActive? <Chip label="Active" color="success" size={"small"} /> : <Chip label="Inactive" color="warning" size={"small"}/>
        }));
    }

    const handleNavigateView = (id: any) => {
        setModalBody(<LoanAllocationForm loanId={id} isEdit={false} isView={true} notify={notify} setLoading={setLoading} setOpenModal={setShowModal} categoryId={categoryId}/>);
        setModalTitle("View Loan Allocation");
        setShowModal(true);
    }

    const handleNavigateEdit = (id: any) => {
        setModalBody(<LoanAllocationForm loanId={id} isEdit={true} isView={false} notify={notify} setLoading={setLoading} setOpenModal={setShowModal} categoryId={categoryId}/>);
        setModalTitle("Edit Loan Allocation");
        setShowModal(true);
    }

    const [delId, setDelId] = useState<boolean>(false);

    const inactivate = (id: any) => {
        setDelId(id);
        setShowAlert(true);
    }

    const handleDelete = async () => {
        setShowAlert(false);
        setLoading(true);
        try {
            const res = await axiosInstance.put(`/delete-loan/${delId}`);
            if (res?.data?.statusCode === 200) {
                notify.success(res?.data?.message);
                getLoans();
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    const handleNavigateCreate = () => {
        setModalBody(<LoanAllocationForm loanId={""} isEdit={false} isView={false} notify={notify} setLoading={setLoading} setOpenModal={setShowModal} categoryId={categoryId}/>);
        setModalTitle("Create Loan Allocation");
        setShowModal(true);
    }

    const actionButtons = [
        {tooltip: "View", icon: faEye, handleClick: handleNavigateView},
        {tooltip: "Edit", icon: faPenToSquare, handleClick: handleNavigateEdit},
        {tooltip: "Delete", icon: faTrash, handleClick: inactivate},
    ];

    const getLoans  = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/get-loans-by-cat-id/${categoryId}`);
            if (res?.data?.statusCode === 200) {
                setLoanTableData(formatTableData(res?.data?.data));
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!showModal) {
            if (!!categoryId) {
                getLoans();
            } else {
                setLoanTableData([]);
            }
        }
    }, [categoryId, showModal]);

    return (
        <Box sx={{p: 5}}>
            <AlertDialogSlide message={"Do you want to delete this loan?"} handleYesClick={handleDelete} handleNoClick={() => setShowAlert(false)} openAlert={showAlert} setOpenAlert={setShowAlert}/>
            <Button disabled={!categoryId} variant={"outlined"} size={"small"} onClick={handleNavigateCreate} sx={{mt:2, mb: 3}}>Create Loan</Button>
            <SearchTable tableData={loanTableData} tableHeaders={loanTableHeaders} id={"loanId"} paginate={true} actionButtons={actionButtons}/>
            <CustomModal show={showModal} handleClose={() => setShowModal(false)} title={modalTitle} body={modalBody} size={"lg"}/>
        </Box>
    );
}

export default LoanAllocation;