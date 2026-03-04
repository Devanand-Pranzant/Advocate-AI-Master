// src/pages/ClientManagement/ListClient.jsx
import React, { useState, useEffect } from "react";
import { Plus, Download, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "../../components/Settings/themeUtils";
import SearchBar from "../../components/Common/SearchBar";
import RecordsPerPage from "../../components/Common/RecordsPerPage";
import Table from "../../components/Common/Table";
import ThreeDotsMenu from "../../components/Common/ThreeDotsMenu";
import Button from "../../components/Common/Button";
import { CardHeader, CardTitle } from "../../components/Common/Card";
import CommonDialog from "../../components/Common/CommonDialog";
import AddClient from "./AddClient";
// import ViewClient from "./ViewClient";
import EditClient from "./EditClient";
import Pagination from "../../components/Common/Pagination";
import CustomConfirmDialog from "../../components/Common/CustomConfirmDialog";

const ListClient = () => {
  const { themeUtils, theme } = useTheme();
  // const toast = useToast();

  // State for custom confirm dialog
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

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
      Gender: "male",
      profile_image: null
    },
    {
      Client_id: 2,
      FirstName: "Jane",
      LastName: "Smith",
      Email: "jane.smith@email.com",
      PhoneNo: "9876543211",
      City: "Delhi",
      DateofBirth: "1988-08-22",
      Gender: "female",
      profile_image: null
    },
    {
      Client_id: 3,
      FirstName: "Robert",
      LastName: "Johnson",
      Email: "robert.j@email.com",
      PhoneNo: "9876543212",
      City: "Bangalore",
      DateofBirth: "1992-03-10",
      Gender: "male",
      profile_image: null
    },
    {
      Client_id: 4,
      FirstName: "Sarah",
      LastName: "Williams",
      Email: "sarah.w@email.com",
      PhoneNo: "9876543213",
      City: "Chennai",
      DateofBirth: "1985-11-30",
      Gender: "female",
      profile_image: null
    },
    {
      Client_id: 5,
      FirstName: "Michael",
      LastName: "Brown",
      Email: "michael.b@email.com",
      PhoneNo: "9876543214",
      City: "Kolkata",
      DateofBirth: "1991-07-18",
      Gender: "male",
      profile_image: null
    },
    {
      Client_id: 6,
      FirstName: "Emily",
      LastName: "Davis",
      Email: "emily.d@email.com",
      PhoneNo: "9876543215",
      City: "Pune",
      DateofBirth: "1989-09-25",
      Gender: "female",
      profile_image: null
    },
    {
      Client_id: 7,
      FirstName: "David",
      LastName: "Miller",
      Email: "david.m@email.com",
      PhoneNo: "9876543216",
      City: "Ahmedabad",
      DateofBirth: "1987-12-05",
      Gender: "male",
      profile_image: null
    }
  ]);

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    const searchLower = search.toLowerCase();
    const fullName = `${client.FirstName} ${client.LastName}`.toLowerCase();
    const email = client.Email.toLowerCase();
    const phone = client.PhoneNo.toLowerCase();
    const city = (client.City || "").toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower) || 
           city.includes(searchLower);
  });

  // Sort clients by ID or name
  const sortedClients = [...filteredClients].sort((a, b) => {
    const nameA = `${a.FirstName} ${a.LastName}`.toLowerCase();
    const nameB = `${b.FirstName} ${b.LastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Pagination
  const paginatedClients =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? sortedClients
      : sortedClients.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        );

  const totalPages =
    perPage === "All" || perPage === Infinity || perPage <= 0
      ? 1
      : Math.ceil(sortedClients.length / perPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= ACTIONS ================= */
  const handleDeleteClick = (clientId) => {
    setClientToDelete(clientId);
    setConfirmDialogVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!clientToDelete) return;
    
    setConfirmDialogVisible(false);
    
    // Filter out the deleted client
    const updatedClients = clients.filter(client => client.Client_id !== clientToDelete);
    setClients(updatedClients);
    
    toast.success("Deleted!", "Client deleted successfully.");
    setClientToDelete(null);
  };

  const handleDeleteReject = () => {
    setConfirmDialogVisible(false);
    setClientToDelete(null);
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setIsViewDrawerOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditDrawerOpen(true);
  };

  const handleAdd = () => setIsAddDrawerOpen(true);

  const handleAddSuccess = () => {
    // In a real app, you'd add the new client to the list
    // For now, we'll just close the drawer and show success
    setIsAddDrawerOpen(false);
    toast.success("Success", "Client added successfully!");
  };

  const handleEditSuccess = () => {
    setIsEditDrawerOpen(false);
    toast.success("Success", "Client updated successfully!");
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
      toast.success("Refreshed", "Client list updated successfully!");
    }, 500);
  };

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "First Name",
      "Last Name",
      "Email",
      "Phone No",
      "City",
      "Date of Birth",
      "Gender",
    ];

    const csv = [
      headers.join(","),
      ...sortedClients.map((c, i) =>
        [
          i + 1,
          `"${c.FirstName?.replace(/"/g, '""') || ""}"`,
          `"${c.LastName?.replace(/"/g, '""') || ""}"`,
          `"${c.Email?.replace(/"/g, '""') || ""}"`,
          `"${c.PhoneNo?.toString().replace(/"/g, '""') || ""}"`,
          `"${c.City?.replace(/"/g, '""') || ""}"`,
          `"${c.DateofBirth || ""}"`,
          `"${c.Gender || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clients_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Export Successful", "Clients exported to CSV successfully!");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper: truncate long text
  const truncateText = (text, maxLength = 20) => {
    if (typeof text !== "string" || text == null) return text || "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";
    return phone.toString();
  };

  /* ================= TABLE COLUMNS ================= */
  const tableHeaders = [
    "Sr. No",
    "Profile",
    "Client Name",
    "Email",
    "Phone No",
    "City",
    "Date of Birth",
    "Gender",
    "Action",
  ];

  const renderRow = (client, index) => (
    <>
      <td
        className="px-4 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(false) }}
      >
        {perPage === "All" || perPage === Infinity || perPage <= 0
          ? index + 1
          : (currentPage - 1) * perPage + index + 1}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        <div className="flex justify-center">
          <img
            src={client.profile_image 
              ? client.profile_image
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(client.FirstName + ' ' + client.LastName)}&background=806633&color=fff&size=40&bold=true`}
            alt={client.FirstName || "Client"}
            className="w-10 h-10 rounded-full object-cover border"
            style={{
              borderColor: "#806633",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.FirstName + ' ' + client.LastName)}&background=806633&color=fff&size=40&bold=true`;
            }}
          />
        </div>
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left truncate max-w-[200px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={`${client.FirstName} ${client.LastName}`}
      >
        {truncateText(`${client.FirstName} ${client.LastName}`)}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left truncate max-w-[200px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={client.Email || "-"}
      >
        {truncateText(client.Email)}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left"
        style={{ color: themeUtils.getTextColor(true) }}
        title={client.PhoneNo || "-"}
      >
        {formatPhoneNumber(client.PhoneNo)}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left truncate max-w-[150px]"
        style={{ color: themeUtils.getTextColor(true) }}
        title={client.City || "-"}
      >
        {truncateText(client.City || "-")}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left"
        style={{ color: themeUtils.getTextColor(true) }}
        title={client.DateofBirth || "-"}
      >
        {formatDate(client.DateofBirth)}
      </td>
      <td
        className="px-4 py-1.5 text-sm text-left"
        style={{ color: themeUtils.getTextColor(true) }}
        title={client.Gender || "-"}
      >
        {client.Gender ? client.Gender.charAt(0).toUpperCase() + client.Gender.slice(1).toLowerCase() : "-"}
      </td>
      <td className="px-4 py-1.5 text-center">
        <ThreeDotsMenu
          onView={() => handleView(client)}
          onEdit={() => handleEdit(client)}
          onDelete={() => handleDeleteClick(client.Client_id)}
          viewTitle="View Client"
          editTitle="Edit Client"
          deleteTitle="Delete Client"
          menuAlignment="right"
        />
      </td>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Custom ConfirmDialog with glass effect */}
      <CustomConfirmDialog
        visible={confirmDialogVisible}
        onHide={handleDeleteReject}
        header="Delete Confirmation"
        message="Do you want to delete this Client? This action cannot be undone."
        accept={handleDeleteConfirm}
        reject={handleDeleteReject}
        acceptLabel="Yes, Delete"
        rejectLabel="Cancel"
      />

      {/* Header */}
      <CardHeader>
        <div 
          className="flex flex-col xl:flex-row items-center justify-between gap-4 px-4 py-2"
          style={{
            ...(theme.headerBg?.includes("card")
              ? { background: theme.headerBg }
              : { backgroundColor: theme.headerBg }),
          }}
        >
          <div className="shrink-0">
            <CardTitle themeUtils={themeUtils}>Client List</CardTitle>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <RecordsPerPage
                value={perPage}
                onChange={setPerPage}
                className="shrink-0"
              />
              <SearchBar
                placeholder="Search Clients"
                value={search}
                onChange={setSearch}
                size="medium"
                className="w-full sm:w-64"
              />
            </div>

            <div className="flex flex-row items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleAdd}
                className="whitespace-nowrap shrink-0"
              >
                Add
              </Button>

              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={handleRefresh}
                className="whitespace-nowrap shrink-0"
                loading={loading}
              >
                Refresh
              </Button>

              <Button
                variant="success"
                icon={Download}
                onClick={exportCSV}
                className="whitespace-nowrap shrink-0"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 sm:mx-0 pl-4 pr-4">
        <div className="inline-block min-w-full align-middle">
          <Table
            headers={tableHeaders}
            data={paginatedClients}
            renderRow={renderRow}
            loading={loading}
            emptyMessage="No clients found. Click 'Add' to create one."
          />
        </div>
      </div>

      {/* Pagination */}
      {paginatedClients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          themeUtils={themeUtils}
        />
      )}

      {/* Drawers / Dialogs */}
      <CommonDialog
        header="Add New Client"
        visible={isAddDrawerOpen}
        onHide={() => setIsAddDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <AddClient
          onClose={() => setIsAddDrawerOpen(false)}
          onSuccess={handleAddSuccess}
        />
      </CommonDialog>

      <CommonDialog
        header="Client Details"
        visible={isViewDrawerOpen}
        onHide={() => setIsViewDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        {/* <ViewClient
          client={selectedClient}
          onClose={() => setIsViewDrawerOpen(false)}
        /> */}
      </CommonDialog>

      <CommonDialog
        header="Edit Client"
        visible={isEditDrawerOpen}
        onHide={() => setIsEditDrawerOpen(false)}
        position="right"
        fullHeight={true}
        width="75vw"
      >
        <EditClient
          clientId={selectedClient?.Client_id}
          client={selectedClient}
          onClose={() => setIsEditDrawerOpen(false)}
          onSuccess={handleEditSuccess}
        />
      </CommonDialog>
    </div>
  );
};

export default ListClient;