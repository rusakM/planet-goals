import React from "react";

import Header from "../../components/header/header";
import ContentContainer from "../../components/content-container/content-container";

type MainPropsT = {
    children: React.ReactNode;
};

const PageContainer: React.FC<MainPropsT> = ({ children }) => {
    return (
        <div>
            <Header />
            <ContentContainer>{children}</ContentContainer>
        </div>
    );
};

export default PageContainer;
