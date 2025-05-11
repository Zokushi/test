import './styles/App.scss';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ByState from './pages/ByState';
import CryptidHotspots from './pages/CryptidHotspots';
import HauntedHotels from './pages/HauntedHotels';
import About from './pages/About';
import Contact from './pages/Contact';
import LocationDetails from './pages/LocationDetailsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/by-state" element={<ByState />} />
        <Route path="/cryptid-hotspots" element={<CryptidHotspots />} />
        <Route path="/haunted-hotels" element={<HauntedHotels />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location/:id" element={<LocationDetails />} />
      </Routes>
    </>
  );
}

export default App;
