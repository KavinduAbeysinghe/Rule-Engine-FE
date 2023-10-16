import { Box, Button, Grid } from "@mui/material";
import FormTextField from "../../components/inputs/FormTextField";
import FormSwitchField from "../../components/inputs/FormSwitchField";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "../../api/store";
import { useEffect } from "react";

interface CustomerCategoryFormProps {
  categoryId: any;
  isView: boolean;
  isEdit: boolean;
  notify: any;
  setLoading: any;
  setOpenModal: any;
}

const CustomerCategoryForm = ({
  categoryId,
  isView,
  isEdit,
  notify,
  setLoading,
  setOpenModal,
}: CustomerCategoryFormProps) => {
  const defaultValues = {
    categoryCode: "",
    categoryName: "",
    status: false,
    isSpecializedCustomer: false,
    isAgeGreaterThan18: false,
    creditScore: 0,
    income: 0,
  };

  const commonError = "Field is required";

  const validationSchema = Yup.object().shape({
    categoryCode: Yup.string().required(commonError),
    categoryName: Yup.string().required(commonError),
    creditScore: Yup.number()
      .required(commonError)
      .min(1, "Min should be 1")
      .max(10, "Max should be 10")
      .integer("Invalid input")
      .typeError(commonError),
    income: Yup.number()
      .required(commonError)
      .min(0, "Invalid input")
      .typeError(commonError),
    status: Yup.boolean(),
    isSpecializedCustomer: Yup.boolean(),
    isAgeGreaterThan18: Yup.boolean(),
  });

  const getCategoryById = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/customer-category/get-customer-category-by-id/${categoryId}?isForRule=${false}`,
      );
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        const values = {
          categoryCode: data?.categoryCode,
          categoryName: data?.categoryName,
          status: data?.status,
          isSpecializedCustomer: data?.isSpecializedCustomer,
          isAgeGreaterThan18: data?.isAgeGreaterThan18,
          creditScore: data?.creditScore,
          income: data?.income,
        };
        reset(values);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const onSubmit = (data: any) => {
    const payload = {
      categoryId: categoryId ? categoryId : 0,
      categoryCode: data?.categoryCode,
      categoryName: data?.categoryName,
      status: !!data?.status,
      isSpecializedCustomer: !!data?.isSpecializedCustomer,
      isAgeGreaterThan18: !!data?.isAgeGreaterThan18,
      creditScore: data?.creditScore,
      income: data?.income,
      isDeleted: false,
    };
    if (isEdit) {
      updateCategory(payload);
    } else {
      createCategory(payload);
    }
  };

  const createCategory = async (payload: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/customer-category/create-customer-category`,
        payload,
      );
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        setOpenModal(false);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const updateCategory = async (payload: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/customer-category/update-category/${categoryId}`,
        payload,
      );
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        setOpenModal(false);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isView || isEdit) {
      getCategoryById();
    }
  }, [categoryId, isView, isEdit]);

  const {
    register,
    formState: { errors },
    setValue,
    control,
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const clearForm = () => {
    if (isEdit) {
      getCategoryById();
    } else {
      reset({});
      setValue("categoryCode", "");
      setValue("categoryName", "");
      setValue("status", false);
      setValue("isSpecializedCustomer", false);
      setValue("isAgeGreaterThan18", false);
      setValue("creditScore", 0);
      setValue("income", 0);
    }
  };

  return (
    <form>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <FormTextField
          required={true}
          label={"Category Code"}
          register={register("categoryCode")}
          id={"categoryCode"}
          error={!!errors?.categoryCode?.message}
          helperText={errors?.categoryCode?.message?.toString()}
          type={"text"}
          disabled={isEdit || isView}
        />
        <FormTextField
          required={true}
          label={"Category Name"}
          register={register("categoryName")}
          id={"categoryName"}
          error={!!errors?.categoryName?.message}
          helperText={errors?.categoryName?.message?.toString()}
          type={"text"}
          disabled={isView}
        />
        <FormTextField
          required={true}
          label={"Credit Score"}
          register={register("creditScore")}
          id={"creditScore"}
          error={!!errors?.creditScore?.message}
          helperText={errors?.creditScore?.message?.toString()}
          type={"number"}
          inputProps={{ min: 0 }}
          disabled={isView}
        />
        <FormTextField
          required={true}
          label={"Income"}
          register={register("income")}
          id={"income"}
          error={!!errors?.income?.message}
          helperText={errors?.income?.message?.toString()}
          type={"number"}
          inputProps={{ min: 0 }}
          InputProps={{
            startAdornment: "Rs. ",
          }}
          disabled={isView}
        />
        <FormSwitchField
          name={"isSpecializedCustomer"}
          label={"Specialized Customer"}
          helperText={""}
          disabled={isView}
          error={false}
          control={control}
          setValue={() => setValue}
        />
        <FormSwitchField
          name={"isAgeGreaterThan18"}
          label={"Age Greater Than 18"}
          helperText={""}
          disabled={isView}
          error={false}
          control={control}
          setValue={() => setValue}
        />
        <FormSwitchField
          name={"status"}
          label={"Status"}
          helperText={""}
          disabled={isView}
          error={false}
          control={control}
          setValue={() => setValue}
        />
        {!isView && (
          <Box display={"flex"} justifyContent={"center"} mt={3} gap={2}>
            <Button variant={"outlined"} size={"small"} onClick={clearForm}>
              Clear
            </Button>
            <Button
              variant={"contained"}
              size={"small"}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </form>
  );
};

export default CustomerCategoryForm;
