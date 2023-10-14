import {Backdrop, Box, Button, CircularProgress, Grid} from "@mui/material";
import {useState} from "react";
import FormTextField from "../../components/inputs/FormTextField";
import {useForm} from "react-hook-form";
import FormSwitchField from "../../components/inputs/FormSwitchField";
import CollapsibleTable from "../../components/table/CollapsibleTable";
import {axiosInstance} from "../../api/store";
import {useNotification} from "../../context/NotificationContext";
import SearchTable from "../../components/table/SearchTable";

const CategoryIdentificationPage = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const [catId, setCatId] = useState<any>("");

    const [categoryTitle, setCategoryTitle] = useState<string>("");

    const [loanData, setLoanData] = useState<Array<any>>([]);

    const tableHeaders = ["Loan Code", "Loan Description", "Loan Amount", "Limit Validity", "Interest Rate", "Interest Rate Validity"]

    const [benefitsData, setBenefitData] = useState<Array<any>>([]);

    const notify = useNotification();

    const topColumnHeaders = ["Benefit Limit ID", "Main Benefit Code", "Main Benefit Name", "Max Allowed Quantity"];

    const bottomColumnHeaders = ["Sub Limit ID", "Sub Benefit Code", "Sub Benefit Name", "Max Allowed Quantity"];

    const defaultValues = {
        creditScore: "",
        income: "",
        isAgeGreaterThan18: false,
        isSpecializedCustomer: false,
    }

    const {
        register,
        setValue,
        control,
        reset,
        handleSubmit
    } = useForm({
        defaultValues: defaultValues
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
                isSpecializedCustomer: data?.isSpecializedCustomer
            }
            const res = await axiosInstance.post(`/customer-category/category-identification`, payload);
            if (res?.data?.statusCode === 200) {
                const data = res?.data?.data;
                setCatId(data?.categoryId);
                setCategoryTitle(`${data?.categoryCode} - ${data?.categoryName}`);
                await getLoans(res?.data?.data?.categoryId);
                await getBenefits(res?.data?.data?.categoryId);
            }
        } catch (error: any) {
            if (error?.response?.data?.statusCode === 404 && error?.response?.data?.message === "No matching category") {
                notify.warn(error?.response?.data?.message);
            } else {
                notify.error(error?.response?.data?.message);
            }
        }
        setLoading(false);
    }

    const clearForm = () => {
        reset();
        setValue("creditScore", "");
        setValue("income", "");
        setCategoryTitle("");
        setLoanData([]);
        setBenefitData([]);
    }

    const getLoans = async (categoryId: any) => {
        if (categoryId) {
            try {
                const res = await axiosInstance.get(`/get-loans-by-cat-id/${categoryId}`);
                if (res?.data?.statusCode === 200) {
                    const activeLoans = res?.data?.data?.filter((dta: any) => dta?.isActive);
                    setLoanData(activeLoans?.map((d: any) => ({
                        loanId: d?.loanId,
                        loanCode: d?.loanCode,
                        loanDescription: d?.loanDescription,
                        loanAmount: d?.loanAmount,
                        limitValidityPeriod: d?.isLimitValidityDays && !d?.isLimitValidityMonth? `${d?.limitValidityPeriod} Days` : !d?.isLimitValidityDays && d?.isLimitValidityMonth? `${d?.limitValidityPeriod} Months` : "",
                        interestRate: d?.interestRate,
                        interestRateValidityPeriod: d?.isInterestRateValidityDays && !d?.isInterestRateValidityMonth? `${d?.interestRateValidityPeriod} Days` : !d?.isInterestRateValidityDays && d?.isInterestRateValidityMonth? `${d?.interestRateValidityPeriod} Months` : "",
                    })));
                }
            } catch (error: any) {
                notify.error(error?.response?.data?.message);
            }
        }
    }

    const getBenefits = async (categoryId: any) => {
        if (categoryId) {
            try {
                const res = await axiosInstance.get(`/benefit-limits/get-benefit-limits-by-cat-id/${categoryId}`);
                if (res?.data?.statusCode === 200) {
                    const data = res?.data?.data;
                    setBenefitData(data?.map((d: any) => ({
                        benefitLimitId: d?.benefitLimitId,
                        mainBenefitCode: d?.mainBenefitCode,
                        mainBenefitName: d?.mainBenefitName,
                        maxAllowedLimit: d?.maxAllowedLimit,
                        benefitSubLimits: d?.benefitSubLimits?.map((l: any) => ({
                            benefitSubLimitId: l?.benefitSubLimitId,
                            subBenefitCode: l?.subBenefitCode,
                            subBenefitName: l?.subBenefitName,
                            maxAllowedSubLimit: l?.maxAllowedSubLimit
                        })),
                    })));
                    console.log(data);
                }
            } catch (error: any) {
                notify.error(error?.response?.data?.message);
            }
        }
    }

    return (
        <>
            <Backdrop sx={{color: "#fff", zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1}}
                      open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <h2 className={"landing-heading"}>Category Identification</h2>
            <hr/>
            <Grid container spacing={2} mt={5}>
                <Grid item md={3}>
                    <FormTextField
                        label={"Credit Score"}
                        register={register("creditScore")}
                        id={"creditScore"}
                        error={false}
                        helperText={""}
                        type={"number"}
                        disabled={false}/>
                </Grid>
                <Grid item md={3}>
                    <FormTextField
                        label={"Income"}
                        register={register("income")}
                        id={"income"}
                        error={false}
                        helperText={""}
                        type={"number"}
                        disabled={false}/>
                </Grid>
                <Grid item md={2}>
                    <FormSwitchField
                        name={"isAgeGreaterThan18"}
                        label={"Age Greater Than 18"}
                        disabled={false}
                        error={false}
                        helperText={""}
                        control={control}
                        setValue={() => setValue}/>
                </Grid>
                <Grid item md={2}>
                    <FormSwitchField
                        name={"isSpecializedCustomer"}
                        label={"Specialized Customer"}
                        disabled={false}
                        error={false}
                        helperText={""}
                        control={control}
                        setValue={() => setValue}/>
                </Grid>
                <Grid item md={1}>
                    <Button variant={"outlined"} size={"small"} onClick={clearForm}>Clear</Button>
                </Grid>
                <Grid item md={1}>
                    <Button variant={"contained"} size={"small"} onClick={handleSubmit(handleSearch)}>Search</Button>
                </Grid>
            </Grid>
            {categoryTitle &&
                <Box sx={{mt: 5}}>
                    <h6 style={{marginLeft: "15px"}}>Customer Category</h6>
                    <h4 style={{border: "1px solid green", borderRadius: "20px", padding: "10px", display: "inline-block"}}>{categoryTitle}</h4>
                </Box>
            }
            <Box sx={{mt: 5}}>
                <h4 className={"landing-heading"}>Loan Data</h4>
                <SearchTable tableData={loanData} tableHeaders={tableHeaders} id={"loanId"} paginate={true}/>
            </Box>
            <Box sx={{mt: 5}}>
                <h4 className={"landing-heading"}>Benefits Data</h4>
                <CollapsibleTable
                    tableData={benefitsData}
                    topColumnHeaders={topColumnHeaders}
                    bottomColumnHeaders={bottomColumnHeaders}
                    bottomTableKey={"benefitSubLimits"}/>
            </Box>
        </>
    )
}

export default CategoryIdentificationPage;