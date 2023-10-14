import {Breadcrumbs, Link, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [breadcrumbs, setBreadCurmbs] = useState<JSX.Element[]>();
    function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) {
        event.preventDefault();
        navigate(path);
    }

    const [paths, setPaths] = useState<Array<string>>([]);

    useEffect(() => {
        const pathName = location.pathname.split("/").filter((e) => e !== "");
        let uniquePath = Array.from(new Set(pathName));
        uniquePath = uniquePath.filter((e) => e !== "main");
        let temp = [];
        let prevPath = ".";

        temp = uniquePath.map((e, index) => {
            let path = prevPath + "/" + e;
            const maxWidth = uniquePath?.length > 3 ? 150 : 200;
            prevPath = path;
            let item =
                index !== uniquePath?.length - 1 ? (
                    <Link underline="hover" key={index} color="inherit" href={"#"} onClick={(e: any) => handleClick(e, path)} className={"breadcrumb-link"}>
                        <Typography key="3" variant="overline" display={"block"} className={"breadcrumb-text"} style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1, maxWidth: maxWidth }}>
                            {e.replaceAll("-", " ")}
                        </Typography>
                    </Link>
                ) : (
                    <Typography key={index} color="text.primary" variant="overline" display={"block"} style={{ fontWeight: 600, letterSpacing: "normal" }}>
                        {e.replaceAll("-", " ")}
                    </Typography>
                );
            return item;
        });
        setBreadCurmbs(temp);
    }, [location]);


    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" className="styled-breadcrumbs">
                {breadcrumbs}
            </Breadcrumbs>
        </>
    );
}

export default Breadcrumb;