import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { store, persistor } from "./redux/store/store"; // Adjust paths accordingly
import Routers from "./routes/Routers";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routers />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            theme="light"
            pauseOnHover
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
