import React from "react";

export const InputAddons = ({children, renderAppend = null, renderPrepend = null}) => {
    if (!renderAppend && !renderPrepend) {
        return children;
    }
    return (<div className="input-group">
        {renderPrepend ? renderPrepend() : null}
        {children}
        {renderAppend ? renderAppend() : null}
    </div>);
};