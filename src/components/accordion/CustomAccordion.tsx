import { Accordion } from "react-bootstrap";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

interface CustomAccordionProps {
    items: Array<{header: string, body: ReactJSXElement}>;
}

const CustomAccordion = ({items}: CustomAccordionProps) => {
    return (
        <Accordion>
            {items?.map((item: {header: string, body: ReactJSXElement}, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{item.header}</Accordion.Header>
                    <Accordion.Body>{item.body}</Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default CustomAccordion;