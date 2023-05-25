import {
    AdaptivityProvider, 
    AppRoot, 
    ConfigProvider, 
    Group, 
    Header, 
    Panel, 
    PanelHeader, 
    SimpleCell, 
    SplitCol, 
    SplitLayout, 
    View 
} from "@vkontakte/vkui";

const App = () => {
    return (
        <ConfigProvider appearance="dark">
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout header={<PanelHeader separator={false} />}>
                        <SplitCol autoSpaced>
                            REA ACS??
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};

export default App;
