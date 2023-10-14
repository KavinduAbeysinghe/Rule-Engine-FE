import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {axiosInstance} from "../../../api/store";
import {useEffect} from "react";
import {Box, Button} from "@mui/material";
import FormTextField from "../../../components/inputs/FormTextField";
import FormSwitchField from "../../../components/inputs/FormSwitchField";

interface SubBenefitFormProps {
    subBenefitId: any;
    mainBenefitId: any;
    isView: boolean;
    isEdit: boolean;
    notify: any;
    setLoading: any;
    setOpenModal: any;
}

const SubBenefitForm = ({
                            subBenefitId,
                            isView,
                            isEdit,
                            notify,
                            setLoading,
                            mainBenefitId,
                            setOpenModal
                        }: SubBenefitFormProps) => {

    const defaultValues = {
        subBenefitCode: "",
        subBenefitName: "",
        status: false
    }

    const commonError = "Field is required";

    const validationSchema = Yup.object().shape({
        subBenefitCode: Yup.string().required(commonError),
        subBenefitName: Yup.string().required(commonError),
        status: Yup.boolean(),
    });

    const {
        register,
        formState: {errors},
        setValue,
        control,
        reset,
        handleSubmit
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
    });

    const updateSubBenefit = async (payload: any) => {
        setLoading(true);
        try {
            const res = await axiosInstance.put(`/sub-benefits/update-sub-benefit/${subBenefitId}`, payload);
            if (res?.data?.statusCode === 200) {
                setOpenModal(false);
                notify.success(res?.data?.message);
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    const createSubBenefit = async (payload: any) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/sub-benefits/create-sub-benefit`, payload);
            if (res?.data?.statusCode === 200) {
                setOpenModal(false);
                notify.success(res?.data?.message);
            } else if (res?.data?.statusCode === 208) {
                notify.warn(res?.data?.message);
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    const onSubmit = (data: any) => {
        const payload = {
            subBenefitId: 0,
            subBenefitCode: data?.subBenefitCode,
            subBenefitName: data?.subBenefitName,
            status: data?.status,
            mainBenefitId: mainBenefitId,
            isDeleted: false
        }
        if (isEdit) {
            updateSubBenefit(payload);
        } else {
            createSubBenefit(payload);
        }
    }

    const clearForm = () => {
        if (isView || isEdit) {
            getSubBenefitById();
        } else {
            reset({});
            reset(defaultValues);
        }
    }

    const getSubBenefitById = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/sub-benefits/get-sub-benefit-by-id/${subBenefitId}`);
            if (res?.data?.statusCode === 200) {
                const data = res?.data?.data;
                const values = {
                    subBenefitCode: data?.subBenefitCode,
                    subBenefitName: data?.subBenefitName,
                    status: data?.status
                }
                reset(values);
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (isView || isEdit) {
            getSubBenefitById();
        }
    }, [isView, isEdit]);

    return (
        <form>
            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormTextField
                    label={"Sub Benefit Code"}
                    register={register("subBenefitCode")}
                    id={"subBenefitCode"}
                    error={!!errors?.subBenefitCode?.message}
                    helperText={errors?.subBenefitCode?.message?.toString()}
                    type={"text"}
                    disabled={isEdit || isView}/>
                <FormTextField
                    label={"Sub Benefit Name"}
                    register={register("subBenefitName")}
                    id={"subBenefitName"}
                    error={!!errors?.subBenefitName?.message}
                    helperText={errors?.subBenefitName?.message?.toString()}
                    type={"text"}
                    disabled={isView}/>
                <FormSwitchField
                    name={"status"}
                    label={"Status"}
                    helperText={""}
                    disabled={isView}
                    error={false}
                    control={control}
                    setValue={() => setValue}/>
                {!isView &&
                    <Box display={"flex"} justifyContent={"center"} mt={3} gap={2}>
                        <Button variant={"outlined"} size={"small"} onClick={clearForm}>Clear</Button>
                        <Button variant={"contained"} size={"small"} onClick={handleSubmit(onSubmit)}>Save</Button>
                    </Box>
                }
            </Box>
        </form>
    )
}

export default SubBenefitForm;