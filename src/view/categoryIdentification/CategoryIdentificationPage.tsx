import { Backdrop, Box, Button, CircularProgress, Grid } from "@mui/material";
import { useState } from "react";
import FormTextField from "../../components/inputs/FormTextField";
import { useForm } from "react-hook-form";
import FormSwitchField from "../../components/inputs/FormSwitchField";
import CollapsibleTable from "../../components/table/CollapsibleTable";
import { axiosInstance } from "../../api/store";
import { useNotification } from "../../context/NotificationContext";
import SearchTable from "../../components/table/SearchTable";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const CategoryIdentificationPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [categoryTitle, setCategoryTitle] = useState<string>("");

  const [loanData, setLoanData] = useState<Array<any>>([]);

  const tableHeaders = [
    "Loan Code",
    "Loan Description",
    "Loan Amount (Rs)",
    "Limit Validity",
    "Interest Rate (%)",
    "Interest Rate Validity",
  ];

  const [benefitsData, setBenefitData] = useState<Array<any>>([]);

  const notify = useNotification();

  const topColumnHeaders = [
    "Benefit Limit ID",
    "Main Benefit Code",
    "Main Benefit Name",
    "Max Allowed Quantity",
  ];

  const bottomColumnHeaders = [
    "Sub Limit ID",
    "Sub Benefit Code",
    "Sub Benefit Name",
    "Max Allowed Quantity",
  ];

  const defaultValues = {
    creditScore: 0,
    income: 0,
    isAgeGreaterThan18: false,
    isSpecializedCustomer: false,
  };

  const commonError = "Field is required";

  const validationSchema = Yup.object().shape({
    creditScore: Yup.number()
      .nullable()
      .min(1, "Min should be 1")
      .max(10, "Max should be 10")
      .integer("Invalid input")
      .typeError(commonError),
    income: Yup.number()
      .nullable()
      .min(0, "Invalid input")
      .typeError(commonError),
  });

  const {
    register,
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const handleSearch = async (data: any) => {
    setLoading(true);
    setCategoryTitle("");
    setLoanData([]);
    setBenefitData([]);
    try {
      const payload = {
        creditScore: data?.creditScore,
        income: data?.income,
        isAgeGreaterThan18: data?.isAgeGreaterThan18,
        isSpecializedCustomer: data?.isSpecializedCustomer,
      };
      const res = await axiosInstance.post(
        `/customer-category/category-identification`,
        payload,
      );
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        setCategoryTitle(`${data?.categoryCode} - ${data?.categoryName}`);
        const activeLoans = data?.loans?.filter((dta: any) => dta?.isActive);
        setLoanData(
          activeLoans?.map((d: any) => ({
            loanId: d?.loanId,
            loanCode: d?.loanCode,
            loanDescription: d?.loanDescription,
            loanAmount: d?.loanAmount,
            limitValidityPeriod:
              d?.isLimitValidityDays && !d?.isLimitValidityMonth
                ? `${d?.limitValidityPeriod} Days`
                : !d?.isLimitValidityDays && d?.isLimitValidityMonth
                ? `${d?.limitValidityPeriod} Months`
                : "",
            interestRate: d?.interestRate,
            interestRateValidityPeriod:
              d?.isInterestRateValidityDays && !d?.isInterestRateValidityMonth
                ? `${d?.interestRateValidityPeriod} Days`
                : !d?.isInterestRateValidityDays &&
                  d?.isInterestRateValidityMonth
                ? `${d?.interestRateValidityPeriod} Months`
                : "",
          })),
        );
        setBenefitData(
          data?.benefitLimits?.map((d: any) => ({
            benefitLimitId: d?.benefitLimitId,
            mainBenefitCode: d?.mainBenefitCode,
            mainBenefitName: d?.mainBenefitName,
            maxAllowedLimit: d?.maxAllowedLimit,
            benefitSubLimits: d?.benefitSubLimits?.map((l: any) => ({
              benefitSubLimitId: l?.benefitSubLimitId,
              subBenefitCode: l?.subBenefitCode,
              subBenefitName: l?.subBenefitName,
              maxAllowedSubLimit: l?.maxAllowedSubLimit,
            })),
          })),
        );
      }
    } catch (error: any) {
      if (
        error?.response?.data?.statusCode === 404 &&
        error?.response?.data?.message === "No matching category"
      ) {
        notify.warn(error?.response?.data?.message);
      } else {
        notify.error(error?.response?.data?.message);
      }
    }
    setLoading(false);
  };

  const clearForm = () => {
    reset();
    setValue("creditScore", 0);
    setValue("income", 0);
    setCategoryTitle("");
    setLoanData([]);
    setBenefitData([]);
  };

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
      <h2 className={"landing-heading"}>Category Identification</h2>
      <hr />
      <Grid container spacing={2} mt={5}>
        <Grid item sm={6} md={3} lg={2}>
          <FormTextField
            label={"Credit Score"}
            register={register("creditScore")}
            id={"creditScore"}
            error={!!errors?.creditScore?.message}
            helperText={errors?.creditScore?.message?.toString()}
            type={"number"}
            disabled={false}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item sm={6} md={3} lg={2}>
          <FormTextField
            label={"Income"}
            register={register("income")}
            id={"income"}
            error={!!errors?.income?.message}
            helperText={errors?.income?.message?.toString()}
            type={"number"}
            disabled={false}
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: "Rs. ",
            }}
          />
        </Grid>
        <Grid item sm={6} md={2} lg={2}>
          <FormSwitchField
            name={"isAgeGreaterThan18"}
            label={"Age Greater Than 18"}
            disabled={false}
            error={false}
            helperText={""}
            control={control}
            setValue={() => setValue}
          />
        </Grid>
        <Grid item sm={6} md={2} lg={2}>
          <FormSwitchField
            name={"isSpecializedCustomer"}
            label={"Specialized Customer"}
            disabled={false}
            error={false}
            helperText={""}
            control={control}
            setValue={() => setValue}
          />
        </Grid>
        <Grid item md={1}>
          <Button
            variant={"contained"}
            size={"small"}
            onClick={handleSubmit(handleSearch)}
          >
            Search
          </Button>
        </Grid>
        <Grid item md={1}>
          <Button variant={"outlined"} size={"small"} onClick={clearForm}>
            Clear
          </Button>
        </Grid>
      </Grid>
      {categoryTitle && (
        <Box sx={{ mt: 5 }}>
          <h6
            className={"landing-heading"}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
              display: "inline-block",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
          >
            {categoryTitle}
          </h6>
        </Box>
      )}
      <Box sx={{ mt: 5 }}>
        <h5 className={"landing-heading"}>Loan Data</h5>
        <SearchTable
          tableData={loanData}
          tableHeaders={tableHeaders}
          id={"loanId"}
          paginate={true}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <h5 className={"landing-heading"}>Benefits Data</h5>
        <CollapsibleTable
          tableData={benefitsData}
          topColumnHeaders={topColumnHeaders}
          bottomColumnHeaders={bottomColumnHeaders}
          bottomTableKey={"benefitSubLimits"}
        />
      </Box>
    </>
  );
};

export default CategoryIdentificationPage;
