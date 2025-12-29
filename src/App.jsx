import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Receiptpdf from "./components/Receiptpdf";
import Signup from "./components/login/Signup";
import Register from "./components/login/Register";
import Membership from "./components/membership/Membership";
import Monthlyreport from "./components/report/Monthlyreport";
import Previousreport from "./components/report/Previousreport";
import Barcode from "./components/barcode/Barcode";
import ProtectedRoute from "./components/ProtectedRoute";
import Genetic from "./components/genetic/Genetic";
import Receipt from "./components/receipts/Receipt";
import GeneticStepper from "./components/genetic/GeneticStepper";
import GeneticForm from "./components/genetic/GeneticForm";
import FatherCamel from "./components/camel/FatherCamel";




function App() {
  // Role-aware ProtectedRoute for SuperAdmin
  const SuperAdminRoute = ({ children }) => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'SuperAdmin') {
      return <Signup />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/register" element={
        <ProtectedRoute>
          <SuperAdminRoute>
            <Register />
          </SuperAdminRoute>
        </ProtectedRoute>
      } />
      {/* Protected Routes */}
      <Route
        path="/Receipt"
        element={
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        }
      />
            <Route path="/FatherCamel" element={
              <ProtectedRoute>
                <SuperAdminRoute>
                  <FatherCamel />
                </SuperAdminRoute>
              </ProtectedRoute>
            } />
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
      <Route path="/FatherCamel" element={
        <ProtectedRoute>
          <FatherCamel />
        </ProtectedRoute>
        
        } />
   

    </Routes>
  );
}

export default App;
