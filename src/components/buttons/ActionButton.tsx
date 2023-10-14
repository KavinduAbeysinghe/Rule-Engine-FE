import {Tooltip} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ActionButtonProps {
    tooltip: string;
    icon: any;
    handleClick: () => void;
}

const ActionButton = (props: ActionButtonProps) => {
    return (
        <Tooltip title={props.tooltip}>
            <FontAwesomeIcon icon={props.icon} onClick={props.handleClick} style={{
                cursor: "pointer",
                marginLeft: 5,
                marginRight: 5,
                color: "gray",
                verticalAlign: "center"
            }}/>
        </Tooltip>
    );
}

export default ActionButton;