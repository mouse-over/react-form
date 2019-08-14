import React from "react";

export const InputFieldGroup = ({labelElement, children, messageElement, validationError}) => <>
    {labelElement}
    {children}
    {messageElement}
    {validationError}
</>;