import React, { useRef } from "react";
import MacRunner from './mac_runner';
import RpiRunner from './rpi_runner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {process.env.REACT_APP_DEVICE === 'mac' && <MacRunner />}
        {process.env.REACT_APP_DEVICE === 'rpi' && <RpiRunner />}
      </header>
    </div>
  );
}

export default App;
