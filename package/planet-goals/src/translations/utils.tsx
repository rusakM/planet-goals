import React from "react";

export const formatNewLines = (text: string) => (
    <>
        {text.split("<br>").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ))}
    </>
);
