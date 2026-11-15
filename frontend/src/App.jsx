import { BrowserRouter, Routes,Route } from "react-router-dom"



import Chat from "./pages/Chat.jsx";
import Conversations from "./components/Conversations.jsx";
import Login from "./pages/Login.jsx";
import AdminConversations from "./pages/AdminConversations.jsx";
import PatientRegister from "./pages/PatientRegister.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home.jsx";
import Contacts from "./pages/Contacts.jsx";
import AdminLayout from "./components/dashboard/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";

function App() {
  return (
  <BrowserRouter>
  <Routes>
  <Route path="/login" element={<Login />}/>
  <Route path="/" element={<Home />} />
  <Route path="/contacts" element={<Contacts />} />
  <Route path="/conversations" element={<Conversations />}/>
  <Route path="/chat/:conversationId" element= {<Chat />}/>

  <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRole="admin">
            <AdminLayout />
        </ProtectedRoute>
    }
>
    <Route index element={<AdminDashboard />} />

    <Route
        path="conversations"
        element={<AdminConversations />}
    />
    <Route
    path="appointments"
    element={<AdminAppointments />}
/>

    <Route
        path="conversations/:conversationId"
        element={<AdminConversations />}
    />
</Route>
  <Route path="/register/:slug" element={<PatientRegister />}/>

  </Routes>
  </BrowserRouter>


  );
}

export default App;