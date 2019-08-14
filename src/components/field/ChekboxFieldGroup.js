import React from "react";

export const CheckboxFieldGroup = ({children, messageElement, validationError, label}) => <>
    <label>
        {children}&nbsp;{label}
    </label>
    {messageElement}
    {validationError}
</>;