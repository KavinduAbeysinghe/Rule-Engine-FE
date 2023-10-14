import {Box, Button} from "@mui/material";
import FormTextField from "../../../components/inputs/FormTextField";
import FormSwitchField from "../../../components/inputs/FormSwitchField";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {axiosInstance} from "../../../api/store";
import {useEffect} from "react";

interface  MainBenefitFormProps {
    categoryId: any;
    isView: boolean;
    isEdit: boolean;
    notify: any;
    setLoading: any;
    setOpenModal: any;
}

const MainBenefitForm = ({categoryId, isView, isEdit, notify, setLoading, setOpenModal}: MainBenefitFormProps) => {

    const defaultValues = {
        mainBenefitCode: "",
        mainBenefitName: "",
        status: false
    }

    const commonError = "Field is required";

    const validationSchema = Yup.object().shape({
        mainBenefitCode: Yup.string().required(commonError),
        mainBenefitName: Yup.string().required(commonError),
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

    const update = async (payload: any) => {
        setLoading(true);
        try {
            const res = await axiosInstance.put(`/main-benefits/update-main-benefit?id=${categoryId}`, payload);
            if (res?.data?.statusCode === 200) {
                notify.success(res?.data?.message);
                setOpenModal(false);
            }
        } catch (error: any) {
            notify.error(error?.response?.data?.message);
        }
        setLoading(false);
    }

    const create = async (payload: any) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/main-benefits/create-main-benefit`, payload);
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
    }

    const onSubmit = (data: any) => {
        const payload = {
            mainBenefitId: 0,
            mainBenefitCode: data?.mainBenefitCode,
            mainBenefitName: data?.mainBenefitName,
            status: data?.status,
            isDeleted: false
        }
        if (isEdit) {
            update(payload);
        } else {
            create(payload);
        }
    }

    const clearForm = () => {
        if (isEdit) {
            getMainBenefitById();
        } else {
            reset({});
            reset(defaultValues);
        }
    }

    const getMainBenefitById = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/main-benefits/get-main-benefit-by-id/${categoryId}`);
            if (res?.data?.statusCode === 200) {
                const data = res?.data?.data;
                const values = {
                    mainBenefitCode: data?.mainBenefitCode,
                    mainBenefitName: data?.mainBenefitName,
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
            getMainBenefitById();
        }
    }, [isView, isEdit]);

    return (
        <form>
            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <FormTextField
                    label={"Main Benefit Code"}
                    register={register("mainBenefitCode")}
                    id={"categoryCode"}
                    error={!!errors?.mainBenefitCode?.message}
                    helperText={errors?.mainBenefitCode?.message?.toString()}
                    type={"text"}
                    disabled={isEdit || isView}/>
                <FormTextField
                    label={"Main Benefit Name"}
                    register={register("mainBenefitName")}
                    id={"categoryName"}
                    error={!!errors?.mainBenefitName?.message}
                    helperText={errors?.mainBenefitName?.message?.toString()}
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

export default MainBenefitForm;