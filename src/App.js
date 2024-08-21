import './App.scss';
import {Switch,Route}  from 'react-router-dom'
import Home from "./components/Home"

import Receiptpdf from './components/Receiptpdf';
import Signup from './components/login/Signup';
import Membership from './components/membership/Membership';
import Monthlyreport from './components/report/Monthlyreport';
import Previousreport from './components/report/Previousreport';
import Barcode from './components/barcode/Barcode';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Signup} />
      <ProtectedRoute exact path="/Home" component={Home} />
      <ProtectedRoute exact path="/Membership" component={Membership} />
      <ProtectedRoute exact path="/Previousreport" component={Previousreport} />
      <ProtectedRoute exact path="/Monthlyreport" component={Monthlyreport} />
      <ProtectedRoute exact path="/Receiptpdf" component={Receiptpdf} />
      <ProtectedRoute exact path="/Barcode" component={Barcode} />
    </Switch>
  );
}

export default App;
