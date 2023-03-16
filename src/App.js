import Layout from "./containers/Layout";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div class="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
