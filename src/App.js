import './App.scss';
import {Switch,Route}  from 'react-router-dom'
import Home from "./components/Home"
import Previousreport from './components/Previousreport';
import Receiptpdf from './components/Receiptpdf';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/Previousreport" component={Previousreport} />
      <Route exact path="/Receiptpdf" component={Receiptpdf} />
    </Switch>
  );
}

export default App;
