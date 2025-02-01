import AppRoutes from "./routes/AppRoutes";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer theme="dark" />
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
};

export default App;
