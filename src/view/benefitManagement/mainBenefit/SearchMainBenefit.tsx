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
  faSquarePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CustomerCategoryForm from "../../customerCategory/CustomerCategoryForm";
import MainBenefitForm from "./MainBenefitForm";
import AlertDialogSlide from "../../../components/modal/AlertDialog";
import AddIcon from "@mui/icons-material/Add";

const SearchMainBenefit = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [modalTitle, setModalTitle] = useState<string>("");

  const [modalBody, setModalBody] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [tableData, setTableData] = useState<Array<any>>([]);

  const tableHeaders = ["Benefit Code", "Benefit Name", "Status"];

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const notify = useNotification();

  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const formatTableData = (data: any) => {
    return data?.map((c: any) => ({
      mainBenefitId: c.mainBenefitId,
      mainBenefitCode: c.mainBenefitCode,
      mainBenefitName: c.mainBenefitName,
      status: c.status ? (
        <Chip label="Active" color="success" size={"small"} />
      ) : (
        <Chip label="Inactive" color="warning" size={"small"} />
      ),
    }));
  };

  const getAllMainBenefits = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/main-benefits/get-all-main-benefits`,
      );
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data ?? [];
        if (data.length > 0) {
          setTableData(formatTableData(data));
        }
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!openModal) {
      getAllMainBenefits();
    }
  }, [openModal]);

  const handleNavigateCreate = () => {
    setModalBody(
      <MainBenefitForm
        categoryId={""}
        isEdit={false}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("Create Main Benefit");
    setOpenModal(true);
  };

  const handleNavigateView = (id: any) => {
    setModalBody(
      <MainBenefitForm
        categoryId={id}
        isEdit={false}
        isView={true}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("View Main Benefit");
    setOpenModal(true);
  };

  const handleNavigateEdit = (id: any) => {
    setModalBody(
      <MainBenefitForm
        categoryId={id}
        isEdit={true}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("Edit Main Benefit");
    setOpenModal(true);
  };

  const handleNavigateSubBenefits = (id: any) => {
    const benefit = {
      mainBenefitId: id,
      mainBenefitCode: tableData?.find((d: any) => d.mainBenefitId === id)
        ?.mainBenefitCode,
    };
    searchParams.set("benefit", JSON.stringify(benefit));
    navigate(`/benefit-management/sub-benefits?${searchParams}`);
  };

  const [delId, setDelId] = useState<any>("");

  const inactivateItem = (id: any) => {
    setDelId(id);
    setShowAlert(true);
  };

  const handleDelete = async () => {
    setShowAlert(false);
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/main-benefits/delete-main-benefit/${delId}`,
      );
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        getAllMainBenefits();
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const actionButtons = [
    { tooltip: "View", icon: faEye, handleClick: handleNavigateView },
    { tooltip: "Edit", icon: faPenToSquare, handleClick: handleNavigateEdit },
    {
      tooltip: "Sub Benefits",
      icon: faSquarePlus,
      handleClick: handleNavigateSubBenefits,
    },
    { tooltip: "Delete", icon: faTrash, handleClick: inactivateItem },
  ];

  return (
    <>
      <AlertDialogSlide
        message={"Do you want to delete this main benefit?"}
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
      <h2 className={"landing-heading"}>Benefit Management</h2>
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
        id={"mainBenefitId"}
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

export default SearchMainBenefit;
