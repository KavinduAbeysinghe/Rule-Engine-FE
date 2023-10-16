import { Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import SearchTable from "../../../components/table/SearchTable";
import CustomModal from "../../../components/modal/CustomModal";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNotification } from "../../../context/NotificationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/store";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import SubBenefitForm from "./SubBenefitForm";
import AlertDialogSlide from "../../../components/modal/AlertDialog";
import AddIcon from "@mui/icons-material/Add";

const SearchSubBenefit = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [modalTitle, setModalTitle] = useState<string>("");

  const [modalBody, setModalBody] = useState<any>("");

  const [tableData, setTableData] = useState<Array<any>>([]);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const tableHeaders = [
    "Sub Benefit Code",
    "Sub Benefit Name",
    "Status",
    "Main Benefit Code",
  ];

  const notify = useNotification();

  const [mainBenefitId, setMainBenefitId] = useState<any>("");

  const [mainBenefitCode, setMainBenefitCode] = useState<any>("");

  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  useLayoutEffect(() => {
    const obj = searchParams.get("benefit");
    if (obj) {
      const state = JSON.parse(obj);
      console.log(state);
      setMainBenefitId(state?.mainBenefitId ?? "");
      setMainBenefitCode(state?.mainBenefitCode ?? "");
    }
  }, [location]);

  const formatTableData = (data: Array<any>) => {
    return data.map((d) => ({
      subBenefitId: d?.subBenefitId,
      subBenefitCode: d?.subBenefitCode,
      subBenefitName: d?.subBenefitName,
      status: d?.status ? (
        <Chip label="Active" color="success" size={"small"} />
      ) : (
        <Chip label="Inactive" color="warning" size={"small"} />
      ),
      mainBenefitId: mainBenefitCode,
    }));
  };

  const getAllSubBenefits = async () => {
    if (!!mainBenefitId && !!mainBenefitCode) {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/sub-benefits/get-sub-benefits-by-main-benefit/${mainBenefitId}`,
        );
        if (res?.data?.statusCode === 200) {
          setTableData(formatTableData(res?.data?.data));
        }
      } catch (error: any) {
        notify.error(error?.response?.data?.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!mainBenefitId) {
      if (!openModal) {
        getAllSubBenefits();
      }
    }
  }, [openModal, mainBenefitId]);

  const [delId, setDelId] = useState<any>("");

  const inactivate = (id: any) => {
    setDelId(id);
    setShowAlert(true);
  };

  const handleDelete = async () => {
    setShowAlert(false);
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/sub-benefits/delete-sub-benefit/${delId}`,
      );
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        getAllSubBenefits();
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleNavigateCreate = () => {
    setModalBody(
      <SubBenefitForm
        subBenefitId={""}
        isEdit={false}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
        mainBenefitId={mainBenefitId}
      />,
    );
    setModalTitle("Create Sub Benefit");
    setOpenModal(true);
  };

  const handleNavigateView = (id: any) => {
    setModalBody(
      <SubBenefitForm
        subBenefitId={id}
        isEdit={false}
        isView={true}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
        mainBenefitId={mainBenefitId}
      />,
    );
    setModalTitle("View Sub Benefit");
    setOpenModal(true);
  };

  const handleNavigateEdit = (id: any) => {
    setModalBody(
      <SubBenefitForm
        subBenefitId={id}
        isEdit={true}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
        mainBenefitId={mainBenefitId}
      />,
    );
    setModalTitle("Edit Sub Benefit");
    setOpenModal(true);
  };

  const actionButtons = [
    { tooltip: "View", icon: faEye, handleClick: handleNavigateView },
    { tooltip: "Edit", icon: faPenToSquare, handleClick: handleNavigateEdit },
    { tooltip: "Delete", icon: faTrash, handleClick: inactivate },
  ];

  return (
    <>
      <AlertDialogSlide
        message={"Do you want to delete this sub benefit?"}
        handleYesClick={handleDelete}
        handleNoClick={() => setShowAlert(false)}
        openAlert={showAlert}
        setOpenAlert={setShowAlert}
      />
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme: { zIndex: { drawer: number } }) =>
            theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h2 className={"landing-heading"}>Sub Benefit</h2>
      <hr />
      <Button
        variant={"outlined"}
        size={"small"}
        onClick={handleNavigateCreate}
        sx={{ mt: 2, mb: 3 }}
        endIcon={<AddIcon />}
      >
        Create
      </Button>
      <SearchTable
        tableData={tableData}
        tableHeaders={tableHeaders}
        id={"subBenefitId"}
        actionButtons={actionButtons}
        paginate={true}
      />
      <CustomModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        title={modalTitle}
        body={modalBody}
      />
    </>
  );
};

export default SearchSubBenefit;
