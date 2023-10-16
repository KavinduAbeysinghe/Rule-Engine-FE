import { Box, Button, Grid } from "@mui/material";
import FormTextField from "../../../components/inputs/FormTextField";
import FormSwitchField from "../../../components/inputs/FormSwitchField";
import * as Yup from "yup";
import { axiosInstance } from "../../../api/store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormAutoCompleteField from "../../../components/inputs/FormAutoCompleteField";
import { number, string } from "yup";

interface LoanAllocationFormProps {
  loanId: any;
  isView: boolean;
  isEdit: boolean;
  notify: any;
  setLoading: any;
  setOpenModal: any;
  categoryId: any;
}

const LoanAllocationForm = ({
  loanId,
  isView,
  isEdit,
  notify,
  setLoading,
  setOpenModal,
  categoryId,
}: LoanAllocationFormProps) => {
  const defaultValues = {
    loanCode: "",
    loanDescription: "",
    interestRate: "",
    isLoanLimitApplicable: false,
    isLimitValidityPeriodApplicable: false,
    limitValidityPeriod: "",
    isInterestRateApplicable: false,
    isInterestRateValidityPeriodApplicable: false,
    interestRateValidity: "",
    interestRateValidityPeriod: "",
    limitValidity: "",
    loanAmount: "",
    isActive: false,
  };

  const commonError = "Field is required";

  const validationSchema = Yup.object().shape({
    loanCode: Yup.string().required(commonError),
    loanDescription: Yup.string().required(commonError),
    interestRate: Yup.mixed().when("isInterestRateApplicable", {
      is: (isInterestRateApplicable: boolean) => isInterestRateApplicable,
      then: () =>
        number()
          .required(commonError)
          .min(0, "Invalid input")
          .typeError(commonError),
      otherwise: () => string().nullable(),
    }),
    isLoanLimitApplicable: Yup.boolean(),
    isLimitValidityPeriodApplicable: Yup.boolean(),
    limitValidityPeriod: Yup.mixed().when("isLimitValidityPeriodApplicable", {
      is: (isLimitValidityPeriodApplicable: boolean) =>
        isLimitValidityPeriodApplicable,
      then: () =>
        number()
          .required(commonError)
          .min(0, "Invalid input")
          .typeError(commonError),
      otherwise: () => string().nullable(),
    }),
    isInterestRateApplicable: Yup.boolean(),
    isInterestRateValidityPeriodApplicable: Yup.boolean(),
    interestRateValidity: Yup.string().when(
      "isInterestRateValidityPeriodApplicable",
      {
        is: (isInterestRateValidityPeriodApplicable: boolean) =>
          isInterestRateValidityPeriodApplicable,
        then: (schema) => schema.required(commonError),
        otherwise: (schema) => schema.nullable(),
      },
    ),
    interestRateValidityPeriod: Yup.mixed().when(
      "isInterestRateValidityPeriodApplicable",
      {
        is: (isInterestRateValidityPeriodApplicable: boolean) =>
          isInterestRateValidityPeriodApplicable,
        then: () =>
          number()
            .required(commonError)
            .min(0, "Invalid input")
            .typeError(commonError),
        otherwise: () => string().nullable(),
      },
    ),
    limitValidity: Yup.string().when("isLimitValidityPeriodApplicable", {
      is: (isLimitValidityPeriodApplicable: boolean) =>
        isLimitValidityPeriodApplicable,
      then: (schema) => schema.required(commonError),
      otherwise: (schema) => schema.nullable(),
    }),
    loanAmount: Yup.mixed().when("isLoanLimitApplicable", {
      is: (isLoanLimitApplicable: boolean) => isLoanLimitApplicable,
      then: () =>
        number()
          .required(commonError)
          .min(0, "Invalid input")
          .typeError(commonError),
      otherwise: () => string().nullable(),
    }),
    isActive: Yup.boolean(),
  });

  const getLoanById = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/get-loan-by-id/${loanId}`);
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        const values = {
          loanCode: data?.loanCode,
          loanDescription: data?.loanDescription,
          loanAmount: data?.loanAmount,
          isLoanLimitApplicable: data?.isLoanLimitApplicable,
          isLimitValidityPeriodApplicable:
            data?.isLimitValidityPeriodApplicable,
          limitValidityPeriod: data?.limitValidityPeriod,
          isInterestRateApplicable: data?.isInterestRateApplicable,
          interestRate: data?.interestRate,
          isInterestRateValidityPeriodApplicable:
            data?.isInterestRateValidityPeriodApplicable,
          interestRateValidity:
            data?.isInterestRateValidityDays &&
            !data?.isInterestRateValidityMonth
              ? "daily"
              : !data?.isInterestRateValidityDays &&
                data?.isInterestRateValidityMonth
              ? "monthly"
              : "",
          interestRateValidityPeriod: data?.interestRateValidityPeriod,
          limitValidity:
            data?.isLimitValidityMonth && !data?.isLimitValidityDays
              ? "monthly"
              : !data?.isLimitValidityMonth && data?.isLimitValidityDays
              ? "daily"
              : "",
          isActive: data?.isActive,
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
      loanId: 0,
      loanCode: data?.loanCode,
      loanAmount: data?.loanAmount,
      loanDescription: data?.loanDescription,
      isLoanLimitApplicable: data?.isLoanLimitApplicable,
      isLimitValidityPeriodApplicable: data?.isLimitValidityPeriodApplicable,
      isLimitValidityMonth: data?.limitValidity === "monthly",
      isLimitValidityDays: data?.limitValidity === "daily",
      limitValidityPeriod: data?.limitValidityPeriod,
      isInterestRateApplicable: data?.isInterestRateApplicable,
      interestRate: data?.interestRate,
      isInterestRateValidityPeriodApplicable:
        data?.isInterestRateValidityPeriodApplicable,
      isInterestRateValidityMonth: data?.interestRateValidity === "monthly",
      isInterestRateValidityDays: data?.interestRateValidity === "daily",
      interestRateValidityPeriod: data?.interestRateValidityPeriod,
      isDeleted: false,
      isActive: data?.isActive,
      categoryId: categoryId,
    };
    if (isEdit) {
      updateLoan(payload);
    } else {
      createLoan(payload);
    }
  };

  const createLoan = async (payload: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/create-loan`, payload);
      if (res?.data?.statusCode === 200) {
        notify.success(res?.data?.message);
        setOpenModal(false);
      } else if (res?.data?.statusCode === 208) {
        notify.error(res?.data?.message);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const updateLoan = async (payload: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/update-loan/${loanId}`, payload);
      if (res?.data?.statusCode === 200) {
        setOpenModal(false);
        notify.success(res?.data?.message);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isView || isEdit) {
      getLoanById();
    }
  }, [loanId, isView, isEdit]);

  const {
    register,
    formState: { errors },
    setValue,
    control,
    reset,
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const clearForm = () => {
    if (isEdit) {
      getLoanById();
    } else {
      reset({});
      reset(defaultValues);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const isLoanLimitApplicableW = watch("isLoanLimitApplicable");

  const isLimitValidityPeriodApplicableW = watch(
    "isLimitValidityPeriodApplicable",
  );

  const isInterestRateApplicableW = watch("isInterestRateApplicable");

  const isInterestRateValidityPeriodApplicableW = watch(
    "isInterestRateValidityPeriodApplicable",
  );

  return (
    <form>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Box display={"flex"} gap={2}>
          <FormTextField
            required={true}
            label={"Loan Code"}
            register={register("loanCode")}
            id={"loanCode"}
            error={!!errors?.loanCode?.message}
            helperText={errors?.loanCode?.message?.toString()}
            type={"text"}
            disabled={isEdit || isView}
          />
          <FormTextField
            required={true}
            label={"Loan Description"}
            register={register("loanDescription")}
            id={"loanDescription"}
            error={!!errors?.loanDescription?.message}
            helperText={errors?.loanDescription?.message?.toString()}
            type={"text"}
            disabled={isView}
          />
        </Box>
        <Box display={"flex"} gap={2}>
          <FormSwitchField
            name={"isLoanLimitApplicable"}
            label={"Loan Limit Applicable"}
            helperText={""}
            disabled={isView}
            error={false}
            control={control}
            setValue={() => setValue}
          />
          <FormTextField
            required={isLoanLimitApplicableW ? isLoanLimitApplicableW : false}
            label={"Loan Amount"}
            register={register("loanAmount")}
            inputProps={{ min: 0 }}
            id={"loanAmount"}
            error={!!errors?.loanAmount?.message}
            helperText={errors?.loanAmount?.message?.toString()}
            type={"number"}
            disabled={isView || !isLoanLimitApplicableW}
            InputProps={{
              startAdornment: "Rs. ",
            }}
          />
        </Box>
        <Box display={"flex"} gap={2}>
          <FormSwitchField
            name={"isLimitValidityPeriodApplicable"}
            label={"Limit Validity Period Applicable"}
            helperText={""}
            disabled={isView}
            error={false}
            control={control}
            setValue={() => setValue}
          />
          <FormAutoCompleteField
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Daily", value: "daily" },
            ]}
            register={register("limitValidity")}
            label={"Limit Validity"}
            error={!!errors?.limitValidity?.message}
            helperText={
              errors?.limitValidity?.message
                ? errors?.limitValidity?.message?.toString()
                : ""
            }
            id={"limitValidity"}
            required={
              isLimitValidityPeriodApplicableW
                ? isLimitValidityPeriodApplicableW
                : false
            }
            control={control}
            setValue={setValue}
            disabled={isView || !isLimitValidityPeriodApplicableW}
            watch={watch}
          />
        </Box>
        <Grid container>
          <Grid item md={6}>
            <FormTextField
              required={isLimitValidityPeriodApplicableW}
              label={"Limit Validity Period"}
              register={register("limitValidityPeriod")}
              id={"loanDescription"}
              error={!!errors?.limitValidityPeriod?.message}
              helperText={errors?.limitValidityPeriod?.message?.toString()}
              type={"number"}
              inputProps={{ min: 0 }}
              disabled={isView || !isLimitValidityPeriodApplicableW}
            />
          </Grid>
        </Grid>
        <Box display={"flex"} gap={2}>
          <FormSwitchField
            name={"isInterestRateApplicable"}
            label={"Interest Rate Applicable"}
            helperText={""}
            disabled={isView}
            error={false}
            control={control}
            setValue={() => setValue}
          />
          <FormTextField
            required={
              isInterestRateApplicableW ? isInterestRateApplicableW : false
            }
            label={"Interest Rate"}
            register={register("interestRate")}
            id={"interestRate"}
            error={!!errors?.interestRate?.message}
            helperText={errors?.interestRate?.message?.toString()}
            type={"number"}
            inputProps={{ min: 0 }}
            disabled={isView || !isInterestRateApplicableW}
            InputProps={{
              endAdornment: "%",
            }}
          />
        </Box>
        <Box display={"flex"} gap={2}>
          <FormSwitchField
            name={"isInterestRateValidityPeriodApplicable"}
            label={"Interest Rate Validity Period Applicable"}
            helperText={""}
            disabled={isView}
            error={false}
            control={control}
            setValue={() => setValue}
          />
          <FormAutoCompleteField
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Daily", value: "daily" },
            ]}
            register={register("interestRateValidity")}
            label={"Interest Rate Validity"}
            error={!!errors?.interestRateValidity?.message}
            helperText={
              errors?.interestRateValidity?.message
                ? errors?.interestRateValidity?.message?.toString()
                : ""
            }
            id={"interestRateValidity"}
            required={
              isInterestRateValidityPeriodApplicableW
                ? isInterestRateValidityPeriodApplicableW
                : false
            }
            control={control}
            setValue={setValue}
            disabled={isView || !isInterestRateValidityPeriodApplicableW}
            watch={watch}
          />
        </Box>
        <Grid container>
          <Grid item md={6}>
            <FormTextField
              required={
                isInterestRateValidityPeriodApplicableW
                  ? isInterestRateValidityPeriodApplicableW
                  : false
              }
              label={"Interest Rate Validity Period"}
              register={register("interestRateValidityPeriod")}
              id={"interestRateValidityPeriod"}
              error={!!errors?.interestRateValidityPeriod?.message}
              helperText={errors?.interestRateValidityPeriod?.message?.toString()}
              type={"number"}
              inputProps={{ min: 0 }}
              disabled={isView || !isInterestRateValidityPeriodApplicableW}
            />
          </Grid>
          <Grid item md={6}>
            <FormSwitchField
              name={"isActive"}
              label={"Active"}
              helperText={""}
              disabled={isView}
              error={false}
              control={control}
              setValue={() => setValue}
            />
          </Grid>
        </Grid>

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

export default LoanAllocationForm;
