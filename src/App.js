import logo from './logo.svg';
import './App.css';
import CurveMap from './components/CurveMap';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [callsign, setCallsign] = useState();
  const [originPoint, setOriginPoint] = useState();
  const [destinationPoint, setDestinationPoint] = useState();

  const handleSubmit = () => {
    localStorage.removeItem("startTimestamp");
    setOriginPoint(null);
    setDestinationPoint(null);
    axios.get(`https://api.adsbdb.com/v0/callsign/${callsign}`).then((response) => {
      localStorage.setItem("startTimestamp", Date.now())
      const {origin, destination} = response.data.response.flightroute;
      setOriginPoint(origin);
      setDestinationPoint(destination);
    }
  ).catch((error) => {
    console.log(error);
  });
  }

  return (
    <div className="App">
      <input value={callsign} onChange={e => setCallsign(e.target.value)} type='text'/>
      <button onClick={handleSubmit}>Submit</button>
      {originPoint && destinationPoint && <CurveMap startPoint={[originPoint.latitude, originPoint.longitude]} endPoint={[destinationPoint.latitude, destinationPoint.longitude]}/>}
    </div>
  );
}

export default App;
