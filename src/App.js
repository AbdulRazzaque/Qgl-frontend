import './App.scss';
import {Switch,Route}  from 'react-router-dom'
import Home from "./components/Home"

import Receiptpdf from './components/Receiptpdf';
import Signup from './components/login/Signup';
import Membership from './components/membership/Membership';
import Monthlyreport from './components/report/Monthlyreport';
import Previousreport from './components/report/Previousreport';
import Barcode from './components/barcode/Barcode';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Membership" component={Membership} />
      <Route exact path="/Previousreport" component={Previousreport} />
      <Route exact path="/Monthlyreport" component={Monthlyreport} />
      <Route exact path="/Receiptpdf" component={Receiptpdf} />
      <Route exact path="/Barcode" component={Barcode} />
    </Switch>
  );
}

export default App;
