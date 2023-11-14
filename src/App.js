import './App.scss';
import {Switch,Route}  from 'react-router-dom'
import Home from "./components/Home"
import Previousreport from './components/Previousreport';
import Receiptpdf from './components/Receiptpdf';
import Signup from './components/login/Signup';
import Membership from './components/membership/Membership';


function App() {
  return (
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Membership" component={Membership} />
      <Route exact path="/Previousreport" component={Previousreport} />
      <Route exact path="/Receiptpdf" component={Receiptpdf} />
    </Switch>
  );
}

export default App;
