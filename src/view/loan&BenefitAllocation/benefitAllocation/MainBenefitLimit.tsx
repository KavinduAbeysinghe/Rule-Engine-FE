import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import FormTextField from "../../../components/inputs/FormTextField";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useNotification } from "../../../context/NotificationContext";
import { axiosInstance } from "../../../api/store";
import { useFieldArray } from "react-hook-form";
import FormAutoCompleteField from "../../../components/inputs/FormAutoCompleteField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubBenefitLimitAllocation from "./SubBenefitLimitAllocation";

interface MainBenefitLimitProps {
  register: any;
  control: any;
  setValue: any;
  watch: any;
  mainBenefitId: any;
  mainBenefits: any;
  mainBenefitIndex: number;
  removeMainBenefitLimit: any;
  getValues: any;
  subBenefitsRef: Array<any>;
}

const MainBenefitLimit = ({
  register,
  control,
  setValue,
  watch,
  mainBenefits,
  mainBenefitId,
  mainBenefitIndex,
  removeMainBenefitLimit,
  getValues,
  subBenefitsRef,
}: MainBenefitLimitProps) => {
  const notify = useNotification();

  const [subBenfitOptions, setSubBenfitOptions] = useState<Array<any>>([]);

  const [setBenfits, setSubBenfits] = useState<Array<any>>(subBenefitsRef);

  useEffect(() => {
    if (mainBenefits.length > 0 && !!mainBenefitId) {
      setValue(
        `mainBenefitLimits.${mainBenefitIndex}.mainBenefitCode`,
        mainBenefits?.find((b: any) => b.mainBenefitId === mainBenefitId)
          ?.mainBenefitCode,
      );
      setValue(
        `mainBenefitLimits.${mainBenefitIndex}.mainBenefitName`,
        mainBenefits?.find((b: any) => b.mainBenefitId === mainBenefitId)
          ?.mainBenefitName,
      );
    }
  }, [mainBenefitId, mainBenefits]);

  const handleRemoveMBL = () => {
    removeMainBenefitLimit(mainBenefitIndex);
  };

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: `mainBenefitLimits.${mainBenefitIndex}.subBenefitLimits`,
  });

  const getAllSubBenefits = async () => {
    if (!!mainBenefitId) {
      const activeSubBenefits = subBenefitsRef?.filter(
        (d: any) => d?.status && d?.mainBenefitId === mainBenefitId,
      );
      setSubBenfitOptions(
        activeSubBenefits?.map((d: any) => ({
          label: `${d?.subBenefitId}-${d?.subBenefitCode}`,
          value: d?.subBenefitId,
        })),
      );
    }
  };

  useEffect(() => {
    getAllSubBenefits();
  }, [mainBenefitId]);

  const subBenefit = watch(`mainBenefitLimits.${mainBenefitIndex}.subBenefit`);

  const handleAddSubBenefit = () => {
    if (!!subBenefit) {
      // const item = setBenfits?.find((c: any) => c?.value === subBenefit);
      const dupSubBenefit = fields?.find(
        (b: any) => b?.subBenefitId === subBenefit,
      );
      if (!dupSubBenefit) {
        prepend({
          subBenefitId: subBenefit,
          subBenefitName: setBenfits?.find(
            (b: any) => b.subBenefitId === subBenefit,
          )?.subBenefitName,
          subBenefitCode: setBenfits?.find(
            (b: any) => b.subBenefitId === subBenefit,
          )?.subBenefitCode,
          maxAllowedLimit: "",
        });
        setValue(`mainBenefitLimits.${mainBenefitIndex}.subBenefit`, "");
      } else {
        setValue(`mainBenefitLimits.${mainBenefitIndex}.subBenefit`, "");
        notify.warn("Sub benefit already exists");
      }
    } else {
      return;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid container spacing={2}>
            <Grid item sm={12} md={3}>
              <FormTextField
                register={register(
                  `mainBenefitLimits.${mainBenefitIndex}.mainBenefitCode`,
                )}
                required={false}
                label={"Main Benefit Code"}
                id={`mainBenefitLimits.${mainBenefitIndex}.mainBenefitCode`}
                error={false}
                helperText={""}
                type={"text"}
                disabled={true}
              />
            </Grid>
            <Grid item sm={12} md={5}>
              <FormTextField
                register={register(
                  `mainBenefitLimits.${mainBenefitIndex}.mainBenefitName`,
                )}
                required={false}
                label={"Main Benefit Name"}
                id={`mainBenefitLimits.${mainBenefitIndex}.mainBenefitName`}
                error={false}
                helperText={""}
                type={"text"}
                disabled={true}
              />
            </Grid>
            <Grid item sm={12} md={3}>
              <FormTextField
                register={register(
                  `mainBenefitLimits.${mainBenefitIndex}.maxAllowedLimit`,
                )}
                required={false}
                label={"Max Allowed Limit"}
                id={`mainBenefitLimits.${mainBenefitIndex}.maxAllowedLimit`}
                error={false}
                helperText={""}
                type={"number"}
                inputProps={{ min: 0 }}
                disabled={false}
              />
            </Grid>
            <Grid item sm={12} md={1}>
              <IconButton onClick={handleRemoveMBL}>
                <ClearIcon color={"error"} />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} mt={1}>
            <Grid item sm={8} md={6}>
              <FormAutoCompleteField
                options={subBenfitOptions}
                register={register(
                  `mainBenefitLimits.${mainBenefitIndex}.subBenefit`,
                )}
                label={"Sub Benefit"}
                error={false}
                helperText={""}
                id={`mainBenefitLimits.${mainBenefitIndex}.subBenefit`}
                required={true}
                control={control}
                setValue={setValue}
                watch={watch}
              />
            </Grid>
            <Grid item sm={1} md={2}>
              <Button
                variant={"outlined"}
                size={"small"}
                onClick={handleAddSubBenefit}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          {fields.map((field: any, index) => (
            <SubBenefitLimitAllocation
              key={index}
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              subBenefitId={field.subBenefitId}
              subBenefits={setBenfits}
              subBenefitIndex={`mainBenefitLimits.${mainBenefitIndex}.subBenefitLimits.${index}`}
              removeSubBenefitLimit={remove}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MainBenefitLimit;
