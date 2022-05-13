import './App.css';
import Board from './components/Board/Board';
import Info from './components/Info/Info';

function App() {

  let size = window.innerWidth < 750 ? "mobile" : "desktop"

  return (
      <div className={`App ${size}`}>
          <Board/>
          <Info/>
      </div>
  );
}

export default App;