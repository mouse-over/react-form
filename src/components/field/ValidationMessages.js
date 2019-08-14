import {ErrorMessage} from "./ErrorMessage";
import React from "react";

export const ValidationMessages = ({messages}) => messages ? messages.map((message, index) => <ErrorMessage
    key={`message_${index}`}>{message}</ErrorMessage>) : null;