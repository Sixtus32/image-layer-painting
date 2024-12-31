import "./App.css";
import ImageEditor from "./components/ImageEditor";

function App() {
  return (
    <div className="App">
      <ImageEditor onSave={console.log("onSave")} />
    </div>
  );
}

export default App;
