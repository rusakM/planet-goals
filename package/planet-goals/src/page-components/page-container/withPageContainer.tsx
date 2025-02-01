import PageContainer from "./page-container";

const withPageContainer = (WrappedComponent) => {
    return (props) => (
        <PageContainer>
            <WrappedComponent {...props} />
        </PageContainer>
    );
};

export default withPageContainer;
