import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Receiptpdf from "./components/Receiptpdf";
import Signup from "./components/login/Signup";
import Membership from "./components/membership/Membership";
import Monthlyreport from "./components/report/Monthlyreport";
import Previousreport from "./components/report/Previousreport";
import Barcode from "./components/barcode/Barcode";
import ProtectedRoute from "./components/ProtectedRoute";
import Genetic from "./components/genetic/Genetic";
import Receipt from "./components/receipts/Receipt";
import GeneticStepper from "./components/genetic/GeneticStepper";
import GeneticForm from "./components/genetic/GeneticForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/Receipt"
        element={
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Membership"
        element={
          <ProtectedRoute>
            <Membership />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Previousreport"
        element={
          <ProtectedRoute>
            <Previousreport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Monthlyreport"
        element={
          <ProtectedRoute>
            <Monthlyreport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Receiptpdf"
        element={
          <ProtectedRoute>
            <Receiptpdf />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Barcode"
        element={
          <ProtectedRoute>
            <Barcode />
          </ProtectedRoute>
        }
      />

      {/* Genetic */}
      <Route path="/Genetic"
      
      element={
        <ProtectedRoute>
      <Genetic />
      </ProtectedRoute>
    } 
      
      />
      <Route path="/Genetic/GeneticStepper" element={
        <ProtectedRoute>
          <GeneticStepper />
        </ProtectedRoute>
        
        } />
      <Route path="/GeneticForm" element={
        <ProtectedRoute>
          <GeneticForm />
        </ProtectedRoute>
        
        } />
    </Routes>
  );
}

export default App;
