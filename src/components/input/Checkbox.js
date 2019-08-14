import React from "react";

export const Checkbox = (props) => {
    return (<input {...props} type='checkbox' checked={props.value} value={props.label}/>);
};