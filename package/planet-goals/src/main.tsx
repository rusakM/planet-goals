import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TolgeeProvider } from "@tolgee/react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import tolgeeConfig from "./translations/index.ts";

import "./index.css";
import 'flipping-pages/dist/style.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import App from "./App.tsx";
import Spinner from "./components/spinner/spinner.component.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <PersistGate persistor={persistor}>
                    <TolgeeProvider tolgee={tolgeeConfig} fallback={<Spinner/>}>
                        <App />
                    </TolgeeProvider>
                </PersistGate>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
