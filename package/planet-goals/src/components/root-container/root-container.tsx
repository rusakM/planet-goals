import React from "react";
import style from "./root-container.module.scss";

type RootContainerT = {
    children?: React.ReactNode;
};

const RootContainer: React.FC<RootContainerT> = ({ children }) => (
    <div className={style.container}>
        <div className={style.viewer}>{children}</div>
    </div>
);

export default RootContainer;
