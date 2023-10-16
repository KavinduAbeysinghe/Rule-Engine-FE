import SearchTable from "../../components/table/SearchTable";
import { axiosInstance } from "../../api/store";
import { useLayoutEffect, useState } from "react";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../context/NotificationContext";
import { CircularProgress, Backdrop, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/modal/CustomModal";
import CustomerCategoryForm from "./CustomerCategoryForm";
import AlertDialogSlide from "../../components/modal/AlertDialog";
import AddIcon from "@mui/icons-material/Add";

const SearchCustomerCategory = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [modalTitle, setModalTitle] = useState<string>("");

  const [modalBody, setModalBody] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [tableData, setTableData] = useState<Array<any>>([]);

  const tableHeaders = [
    "Category Code",
    "Category Name",
    "Specialized Customer",
    "Age > 18",
    "Status",
  ];

  const notify = useNotification();

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const formatTableData = (data: Array<any>) => {
    return data.map((d) => ({
      categoryId: d.categoryId,
      categoryCode: d.categoryCode,
      categoryName: d.categoryName,
      isSpecializedCustomer: d.isSpecializedCustomer ? "Yes" : "No",
      isAgeGreaterThan18: d.isAgeGreaterThan18 ? "Yes" : "No",
      status: d.status ? (
        <Chip label="Active" color="success" size={"small"} />
      ) : (
        <Chip label="Inactive" color="warning" size={"small"} />
      ),
    }));
  };

  const getAllCustomerCats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/customer-category/get-all-customer-categories`,
      );
      if (res?.data?.statusCode === 200) {
        setTableData(formatTableData(res?.data?.data));
      }
    } catch (error: any) {
      notify.error(
        error?.response?.data?.message ?? "Get all customer categories failed",
      );
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    if (!openModal) {
      getAllCustomerCats();
    }
  }, [openModal]);

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
        `/customer-category/delete-category-by-id/${delId}`,
      );
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        getAllCustomerCats();
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleNavigateCreate = () => {
    setModalBody(
      <CustomerCategoryForm
        categoryId={""}
        isEdit={false}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("Create Customer Category");
    setOpenModal(true);
  };

  const handleNavigateView = (id: any) => {
    setModalBody(
      <CustomerCategoryForm
        categoryId={id}
        isEdit={false}
        isView={true}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("View Customer Category");
    setOpenModal(true);
  };

  const handleNavigateEdit = (id: any) => {
    setModalBody(
      <CustomerCategoryForm
        categoryId={id}
        isEdit={true}
        isView={false}
        notify={notify}
        setLoading={setLoading}
        setOpenModal={setOpenModal}
      />,
    );
    setModalTitle("Edit Customer Category");
    setOpenModal(true);
  };

  const actionButtons = [
    { tooltip: "View", icon: faEye, handleClick: handleNavigateView },
    { tooltip: "Edit", icon: faPenToSquare, handleClick: handleNavigateEdit },
    { tooltip: "Delete", icon: faTrash, handleClick: inactivateItem },
  ];

  return (
    <>
      <AlertDialogSlide
        message={"Do you want to delete customer category?"}
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
      <h2 className={"landing-heading"}>Customer Category</h2>
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
        id={"categoryId"}
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

export default SearchCustomerCategory;
