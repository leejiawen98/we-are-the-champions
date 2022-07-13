import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import MatchResults from "./pages/MatchResults/MatchResults";
import Ranking from "./pages/Ranking/Ranking";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/matchResults" element={<MatchResults/>}/>
        <Route exact path="/ranking" element={<Ranking/>}/>
      </Routes>
    </Router>
  );
}