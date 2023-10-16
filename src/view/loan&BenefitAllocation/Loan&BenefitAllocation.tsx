import FormAutoCompleteField from "../../components/inputs/FormAutoCompleteField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNotification } from "../../context/NotificationContext";
import { axiosInstance } from "../../api/store";
import { useEffect, useLayoutEffect, useState } from "react";
import CustomAccordion from "../../components/accordion/CustomAccordion";
import { Backdrop, Box, CircularProgress, Grid } from "@mui/material";
import LoanAllocation from "./loanAllocation/LoanAllocation";
import BenefitAllocation from "./benefitAllocation/BenefitAllocation";
import Typography from "@mui/material/Typography";

const LoanBenefitAllocation = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [customerCatOptions, setCustomerCatOptions] = useState<Array<any>>([]);

  const [categoryData, setCategoryData] = useState<Array<any>>([]);

  const notify = useNotification();

  const commonError = "Field is required";

  const validationSchema = Yup.object().shape({
    customerCategory: Yup.string().required(commonError),
  });

  const {
    register,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const getAllCustomerCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/customer-category/get-all-customer-categories`,
      );
      if (res?.data?.statusCode === 200) {
        const activeCats = res?.data?.data?.filter((c: any) => c.status);
        setCustomerCatOptions(
          activeCats?.map((d: any) => ({
            label: `${d?.categoryCode}-${d?.categoryName}`,
            value: d?.categoryId,
          })),
        );
        setCategoryData(res?.data?.data);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    getAllCustomerCategories();
  }, []);

  const catId = watch("customerCategory");

  const accordionItems = [
    {
      header: "Loan Allocation",
      body: (
        <LoanAllocation
          notify={notify}
          setLoading={setLoading}
          categoryId={catId}
          categoryData={categoryData}
        />
      ),
    },
    {
      header: "Benefit Allocation",
      body: (
        <BenefitAllocation
          setLoading={setLoading}
          categoryId={catId}
          categoryData={categoryData}
        />
      ),
    },
  ];

  return (
    <>
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
      <h2 className={"landing-heading"}>Loan & Benefit Allocation</h2>
      <hr />
      <Typography mt={5} className={"landing-heading"}>
        Select a customer category to allocate loans & benefits{" "}
      </Typography>
      <Grid container mt={2}>
        <Grid item xs={12} sm={12} md={6}>
          <FormAutoCompleteField
            options={customerCatOptions}
            register={register("customerCategory")}
            label={"Customer Category"}
            error={!!errors?.customerCategory?.message}
            helperText={
              errors?.customerCategory?.message
                ? errors?.customerCategory?.message?.toString()
                : ""
            }
            id={"customerCategory"}
            disabled={false}
            control={control}
            required={true}
            setValue={setValue}
            watch={watch}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 5 }}>
        <CustomAccordion items={accordionItems} />
      </Box>
    </>
  );
};

export default LoanBenefitAllocation;
