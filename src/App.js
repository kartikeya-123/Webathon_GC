import Layout from "./containers/Layout";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthContextProvider } from "./context";
function App() {
  return (
    <div class="App">
      <BrowserRouter>
        <AuthContextProvider>
          <Layout />
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
