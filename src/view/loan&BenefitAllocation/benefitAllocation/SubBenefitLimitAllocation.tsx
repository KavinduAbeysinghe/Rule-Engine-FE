import {Grid, IconButton} from "@mui/material";
import FormTextField from "../../../components/inputs/FormTextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";

interface SubBenefitLimitProps {
    register: any;
    control: any;
    setValue: any;
    watch: any;
    subBenefitId: any;
    subBenefits: any;
    subBenefitIndex: any;
    removeSubBenefitLimit: any;
}

const SubBenefitLimitAllocation = ({register, control, setValue, watch, subBenefitId, subBenefits, subBenefitIndex, removeSubBenefitLimit}: SubBenefitLimitProps) => {
    const handleRemoveSBL = () => {
        removeSubBenefitLimit(subBenefitIndex);
    }

    useEffect(() => {
        if (!!subBenefitId && subBenefits.length>0) {
            setValue(`${subBenefitIndex}.subBenefitCode`, subBenefits?.find((b: any) => b.subBenefitId === subBenefitId)?.subBenefitCode);
            setValue(`${subBenefitIndex}.subBenefitName`, subBenefits?.find((b: any) => b.subBenefitId === subBenefitId)?.subBenefitName);
        }
    }, [subBenefitId, subBenefits]);

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item md={3}>
                <FormTextField
                    register={register(`${subBenefitIndex}.subBenefitCode`)}
                    required={false}
                    label={"Sub Benefit Code"}
                    id={`${subBenefitIndex}.subBenefitCode`}
                    error={false}
                    helperText={""}
                    type={"text"}
                    disabled={true}/>
            </Grid>
            <Grid item md={4.7}>
                <FormTextField
                    register={register(`${subBenefitIndex}.subBenefitName`)}
                    required={false}
                    label={"Sub Benefit Name"}
                    id={`${subBenefitIndex}.subBenefitName`}
                    error={false}
                    helperText={""}
                    type={"text"}
                    disabled={true}/>
            </Grid>
            <Grid item md={3}>
                <FormTextField
                    register={register(`${subBenefitIndex}.maxAllowedLimit`)}
                    required={false}
                    label={"Max Allowed Limit"}
                    id={`${subBenefitIndex}.maxAllowedLimit`}
                    error={false}
                    helperText={""}
                    type={"number"}
                    inputProps={{min:0}}
                    disabled={false}/>
            </Grid>
            <Grid item md={1}>
                <IconButton onClick={handleRemoveSBL}>
                    <ClearIcon color={"error"}/>
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default SubBenefitLimitAllocation;