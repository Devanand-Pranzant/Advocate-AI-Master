// src/pages/ClientManagement/ListClient.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/Settings/themeUtils";
import { useSweetAlert } from "../../components/Common/SweetAlert";
import { 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

const ListClient = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useSweetAlert();

  // Static client data
  const [clients, setClients] = useState([
    {
      Client_id: 1,
      FirstName: "John",
      LastName: "Doe",
      Email: "john.doe@email.com",
      PhoneNo: "9876543210",
      City: "Mumbai",
      DateofBirth: "1990-05-15",
      Gender: "male"
    },
    {
      Client_id: 2,
      FirstName: "Jane",
      LastName: "Smith",
      Email: "jane.smith@email.com",
      PhoneNo: "9876543211",
      City: "Delhi",
      DateofBirth: "1988-08-22",
      Gender: "female"
    },
    {
      Client_id: 3,
      FirstName: "Robert",
      LastName: "Johnson",
      Email: "robert.j@email.com",
      PhoneNo: "9876543212",
      City: "Bangalore",
      DateofBirth: "1992-03-10",
      Gender: "male"
    },
    {
      Client_id: 4,
      FirstName: "Sarah",
      LastName: "Williams",
      Email: "sarah.w@email.com",
      PhoneNo: "9876543213",
      City: "Chennai",
      DateofBirth: "1985-11-30",
      Gender: "female"
    },
    {
      Client_id: 5,
      FirstName: "Michael",
      LastName: "Brown",
      Email: "michael.b@email.com",
      PhoneNo: "9876543214",
      City: "Kolkata",
      DateofBirth: "1991-07-18",
      Gender: "male"
    },
    {
      Client_id: 6,
      FirstName: "Emily",
      LastName: "Davis",
      Email: "emily.d@email.com",
      PhoneNo: "9876543215",
      City: "Pune",
      DateofBirth: "1989-09-25",
      Gender: "female"
    },
    {
      Client_id: 7,
      FirstName: "David",
      LastName: "Miller",
      Email: "david.m@email.com",
      PhoneNo: "9876543216",
      City: "Ahmedabad",
      DateofBirth: "1987-12-05",
      Gender: "male"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const searchValue = searchTerm.toLowerCase();
    const fullName = `${client.FirstName} ${client.LastName}`.toLowerCase();
    const email = client.Email.toLowerCase();
    const phone = client.PhoneNo.toLowerCase();
    const city = (client.City || "").toLowerCase();
    const gender = (client.Gender || "").toLowerCase();
    
    return fullName.includes(searchValue) || 
           email.includes(searchValue) || 
           phone.includes(searchValue) || 
           city.includes(searchValue) || 
           gender.includes(searchValue);
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredClients.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredClients.length / recordsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Navigation handlers
  const handleView = (id) => {
    navigate(`/client-management/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/client-management/update/${id}`);
  };

  const handleAdd = () => {
    navigate("/client-management/add");
  };

  const handleDelete = (id) => {
    showAlert({
      type: "warning",
      title: "Are you sure?",
      message: "You want to delete!",
      showConfirm: true,
      confirmText: "Delete",
      showCancel: true,
      cancelText: "Cancel",
      variant: "modal",
      onConfirm: () => {
        // Filter out the deleted client
        const updatedClients = clients.filter(client => client.Client_id !== id);
        setClients(updatedClients);
        
        showAlert({
          type: "success",
          title: "Deleted Successfully!",
          message: "Client deleted successfully!",
          autoClose: true,
          autoCloseTime: 2500,
          variant: "toast",
          showConfirm: false,
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <AlertComponent />
      
      <main className="main-wrapper min-h-[80vh]">
        <div className="main-content">
          <div className="px-4 sm:px-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              {/* Left: Client Heading */}
              <div className="md:w-1/2">
                <div className="text-[#aa9166] font-bold font-['poppine'] relative left-4 -mt-2.5 text-xl">
                  Client
                </div>
              </div>

              {/* Right: Search bar and Add Client button */}
              <div className="md:w-1/2">
                <div className="flex flex-wrap items-center justify-start md:justify-end gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input 
                      type="search" 
                      placeholder="Search Customers"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-auto pl-8 pr-3 py-0.5 h-[30px] bg-transparent text-white border border-gray-300 rounded focus:border-2 focus:border-white focus:outline-none placeholder:text-gray-400 placeholder:text-sm placeholder:pl-2"
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#aa9166]" size={16} />
                  </div>

                  {/* Add Client Button */}
                  <button 
                    onClick={handleAdd}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-medium rounded text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Plus size={16} />
                    Add New Client
                  </button>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="mt-2 bg-transparent">
              <div className="p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead className="bg-transparent">
                      <tr className="border-b border-[#aa9166]">
                        <th className="text-left py-1.5 pl-[18px] pr-3 text-xs font-bold">Client Name</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">Email</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">Contact No.</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">Location</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">DOB</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">Gender</th>
                        <th className="text-left py-1.5 px-3 text-xs font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.length > 0 ? (
                        currentRecords.map((client) => (
                          <tr key={client.Client_id} className="border-b border-[#aa9166] hover:bg-transparent">
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              <a href="#" className="flex items-center gap-3 text-white no-underline hover:text-[#aa9166]">
                                <span>{client.FirstName} {client.LastName}</span>
                              </a>
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              <a href="#" className="text-white no-underline hover:text-[#aa9166]">
                                {client.Email}
                              </a>
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              {client.PhoneNo}
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              {client.City || "-"}
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              {formatDate(client.DateofBirth)}
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              {client.Gender ? client.Gender.charAt(0).toUpperCase() + client.Gender.slice(1).toLowerCase() : "-"}
                            </td>
                            <td className="py-1 px-1.5 text-xs font-light whitespace-nowrap">
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => handleView(client.Client_id)}
                                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                  title="View Client"
                                >
                                  <Eye size={14} />
                                </button>
                                <button 
                                  onClick={() => handleEdit(client.Client_id)}
                                  className="p-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors"
                                  title="Edit Client"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(client.Client_id)}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  title="Delete Client"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-white">
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                      {currentPage > 1 && (
                        <button 
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="px-4 py-1.5 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-medium rounded text-sm flex items-center gap-1 hover:opacity-90 transition-opacity mr-3"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                      )}
                      
                      {currentPage < totalPages && (
                        <button 
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="px-4 py-1.5 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-medium rounded text-sm flex items-center gap-1 hover:opacity-90 transition-opacity"
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListClient;