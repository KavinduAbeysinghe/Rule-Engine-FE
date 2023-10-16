import { Box, Button, Grid } from "@mui/material";
import FormAutoCompleteField from "../../../components/inputs/FormAutoCompleteField";
import { useFieldArray, useForm } from "react-hook-form";
import { useNotification } from "../../../context/NotificationContext";
import { axiosInstance } from "../../../api/store";
import { useEffect, useState } from "react";
import MainBenefitLimit from "./MainBenefitLimit";

interface BenefitAllocationProps {
  setLoading: (loading: boolean) => void;
  categoryId: any;
  categoryData: Array<any>;
}

const BenefitAllocation = ({
  setLoading,
  categoryId,
  categoryData,
}: BenefitAllocationProps) => {
  const notify = useNotification();

  const {
    register,
    formState: { errors },
    setValue,
    control,
    reset,
    handleSubmit,
    watch,
    getValues,
  } = useForm({
    // resolver: yupResolver(validationSchema),
    // defaultValues: defaultValues
  });

  const [mainBenefitOptions, setMainBenefitOptions] = useState<Array<any>>([]);

  const [subBenefitsRef, setSubBenefitsRef] = useState<Array<any>>([]);

  const [mainBenefits, setMainBenefits] = useState<Array<any>>([]);

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: "mainBenefitLimits",
  });

  const mainBenefit = watch("mainBenefit");

  const [havaData, setHaveData] = useState<boolean>(false);

  const getBenefitsByCatId = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/benefit-limits/get-benefit-limits-by-cat-id/${categoryId}`,
      );
      if (res?.data?.statusCode === 200) {
        const data = res?.data?.data;
        setHaveData(data.length > 0);
        const mainBenefitLimits = data?.map((data: any, index: number) => {
          const subBenefitLimits = data?.benefitSubLimits?.map((l: any) => ({
            subBenefitId: l?.subBenefitId,
            subBenefitName: l?.subBenefitName,
            subBenefitCode: l?.subBenefitCode,
            maxAllowedLimit: l?.maxAllowedSubLimit,
          }));
          return {
            mainBenefitCode: data?.mainBenefitCode,
            mainBenefitId: data?.mainBenefitId,
            mainBenefitName: data?.mainBenefitName,
            maxAllowedLimit: data?.maxAllowedLimit,
            subBenefitLimits: subBenefitLimits,
          };
        });
        setValue("mainBenefitLimits", mainBenefitLimits);
        console.log(getValues());
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (categoryId) {
      getBenefitsByCatId();
    } else {
      setValue("mainBenefitLimits", []);
    }
  }, [categoryId]);

  const getMainBenefits = async () => {
    try {
      const res = await axiosInstance.get(
        `/main-benefits/get-all-main-benefits`,
      );
      if (res?.data?.statusCode === 200) {
        const activeMainBenfits = res?.data?.data?.filter(
          (d: any) => d?.status,
        );
        setMainBenefitOptions(
          activeMainBenfits?.map((d: any) => ({
            value: d?.mainBenefitId,
            label: `${d?.mainBenefitCode}-${d?.mainBenefitName}`,
          })),
        );
        setMainBenefits(res?.data?.data);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
  };

  const getAllSubBenefits = async () => {
    try {
      const res = await axiosInstance.get(`/sub-benefits/get-all-sub-benefits`);
      if (res?.data?.statusCode === 200) {
        setSubBenefitsRef(res?.data?.data);
      }
    } catch (error: any) {
      notify.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getMainBenefits();
    getAllSubBenefits();
  }, []);

  const handleAddMainCat = () => {
    if (!!mainBenefit) {
      const dupMainBenefit = fields?.find(
        (b: any) => b?.mainBenefitId === mainBenefit,
      );
      if (!dupMainBenefit) {
        prepend({
          mainBenefitId: mainBenefit,
          mainBenefitName: mainBenefits?.find(
            (b: any) => b.mainBenefitId === mainBenefit,
          )?.mainBenefitName,
          mainBenefitCode: mainBenefits?.find(
            (b: any) => b.mainBenefitId === mainBenefit,
          )?.mainBenefitCode,
          maxAllowedLimit: "",
          subBenefitLimits: [],
        });
        setValue("mainBenefit", "");
      } else {
        setValue("mainBenefit", "");
        notify.warn("Main benefit already exists");
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (categoryId) {
      setLoading(true);
      try {
        console.log(getValues());
        const payload = {
          customerCategoryId: categoryId,
          mainBenefitLimits: getValues()?.mainBenefitLimits?.map((f: any) => ({
            maxAllowedQuantity: f?.maxAllowedLimit,
            mainBenefitId: f?.mainBenefitId,
            customerCategoryId: categoryId,
            subBenefitLimits:
              f?.subBenefitLimits?.map((l: any) => ({
                maxAllowedQuantity: l?.maxAllowedLimit,
                subBenefitId: l?.subBenefitId,
              })) ?? [],
          })),
        };
        const res = havaData
          ? await axiosInstance.put(
              `/benefit-limits/update-benefit-limit`,
              payload,
            )
          : await axiosInstance.post(
              `/benefit-limits/create-benefit-limit`,
              payload,
            );
        if (res?.data?.statusCode === 200) {
          notify.success(res?.data?.message);
        }
      } catch (error: any) {
        notify.error(error?.response?.data?.message);
      }
      setLoading(false);
    }
  };

  const clearData = () => {
    if (categoryId) {
      getBenefitsByCatId();
    } else {
      setValue("mainBenefitLimits", []);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <FormAutoCompleteField
            options={mainBenefitOptions}
            register={register("mainBenefit")}
            label={"Main Benefit"}
            error={false}
            helperText={""}
            id={"mainBenefit"}
            required={true}
            control={control}
            setValue={setValue}
            watch={watch}
            disabled={!categoryId}
          />
        </Grid>
        <Grid item md={2}>
          <Button
            variant={"outlined"}
            size={"small"}
            onClick={handleAddMainCat}
            disabled={!categoryId}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      {fields?.map((field: any, index) => (
        <MainBenefitLimit
          getValues={getValues}
          key={field.id}
          register={register}
          control={control}
          setValue={setValue}
          watch={watch}
          mainBenefitId={field.mainBenefitId}
          mainBenefits={mainBenefits}
          mainBenefitIndex={index}
          removeMainBenefitLimit={remove}
          subBenefitsRef={subBenefitsRef}
        />
      ))}
      <Box display={"flex"} gap={2} sx={{ mt: 5 }} justifyContent={"center"}>
        <Button
          variant={"outlined"}
          size={"small"}
          onClick={clearData}
          disabled={!categoryId}
        >
          Clear
        </Button>
        <Button
          variant={"contained"}
          size={"small"}
          onClick={handleSubmit(onSubmit)}
          disabled={!categoryId}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default BenefitAllocation;
