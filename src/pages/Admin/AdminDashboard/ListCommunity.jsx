// src/pages/Admin/CommunityManagement/ListCommunity.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, RefreshCw } from "lucide-react";
import { useTheme } from "../../../components/Settings/themeUtils";
import { useSweetAlert } from "../../../components/Common/SweetAlert";
import SearchBar from "../../../components/Common/SearchBar";
import RecordsPerPage from "../../../components/Common/RecordsPerPage";
import Table from "../../../components/Common/Table";
import ActionButtons from "../../../components/Common/ActionButtons";
import Button from "../../../components/Common/Button";
import Card, {
  CardHeader,
  CardTitle,
} from "../../../components/Common/Card";

import { useLocation } from "react-router-dom";

const ListCommunity = () => {
  const { theme, themeUtils } = useTheme();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useSweetAlert();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [communities, setCommunities] = useState([]);

  // 🔐 Get logged-in user (same as logout logic)
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH COMMUNITIES ================= */
  const fetchCommunities = async () => {
    console.log("Fetching communities...");
    console.log("API URL:", import.meta.env.VITE_API_URL);
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // if (!user?.token) return;
      if (!user?.token) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/communities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const data = await res.json();
      console.log("Fetched Communities:", data);

      if (data.success) {
        setCommunities(data.communities);
      } else {
        setCommunities([]);
        throw new Error(data.message || "Failed to fetch communities");
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered for fetching communities");
    fetchCommunities();
  }, [location.pathname]);

  /* ================= SEARCH + PAGINATION ================= */
  const filteredCommunities = communities.filter((c) =>
    (c.community_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const totalPages = Math.ceil(filteredCommunities.length / perPage);

  const handleDelete = async (communityId) => {
    showAlert({
      type: "warning",
      title: "Are you sure?",
      message: "Do you want to delete this Community?",
      showConfirm: true,
      confirmText: "Yes",
      showCancel: true,
      cancelText: "No",
      variant: "modal",
      onConfirm: async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");

          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/communities/${communityId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          );

          const data = await res.json();

          if (!data.success) {
            throw new Error(data.message || "Delete failed");
          }

          // ✅ Remove from UI after backend success
          setCommunities((prev) =>
            prev.filter((c) => c.community_id !== communityId),
          );

          showAlert({
            type: "success",
            title: "Deleted",
            message: "Community deleted successfully!",
            autoClose: true,
            autoCloseTime: 2500,
            variant: "toast",
            showConfirm: false,
          });
        } catch (error) {
          console.error("Delete failed:", error);

          showAlert({
            type: "error",
            title: "Error",
            message: "Failed to delete community",
            autoClose: true,
            autoCloseTime: 2500,
            variant: "toast",
            showConfirm: false,
          });
        }
      },
    });
  };

  /* ================= NAVIGATION ================= */
  const handleView = (community) =>
    navigate(
      `/community-management/communities/view/${community.community_id}`,
      {
        state: { community },
      },
    );

  const handleEdit = (community) =>
    navigate(
      `/community-management/communities/edit/${community.community_id}`,
      {
        state: { community },
      },
    );

  const handleAdd = () => navigate("/community-management/communities/add");

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "Sr. No",
      "Community Name",
      "Community Manager",
      "Manager Contact",
      "Total Properties",
      "Total Units",
    ];

    const csv = [
      headers.join(","),
      ...filteredCommunities.map((c, i) =>
        [
          i + 1,
          `"${c.community_name}"`,
          c.manager_name,
          c.manager_contact || c.manager_contact || "john.doe@example.com",
          c.total_properties,
          c.total_units,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `communities_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    showAlert({
      type: "success",
      title: "Export Successful",
      message: "Communities exported to CSV successfully!",
      autoClose: true,
      autoCloseTime: 2500,
      variant: "toast",
      showConfirm: false,
    });
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/communities/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        showAlert({
          type: "success",
          title: "Sync Successful",
          message: `Synced ${data.count} communities successfully`,
          autoClose: true,
          autoCloseTime: 2500,
          variant: "toast",
          showConfirm: false,
        });

        await fetchCommunities();
      } else {
        throw new Error(data.message || "Sync failed");
      }
    } catch (error) {
      console.error("Sync failed:", error);

      showAlert({
        type: "error",
        title: "Sync Failed",
        message: "Failed to sync communities from EPMS",
        autoClose: true,
        autoCloseTime: 2500,
        variant: "toast",
        showConfirm: false,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= TABLE CONFIG ================= */
  const tableHeaders = [
    "Sr. No",
    "Community Name",
    "Community Manager",
    "Manager Contact",
    "Total Properties",
    "Total Units",
    "Action",
  ];

  const renderRow = (community, index) => (
    <>
      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(false) }}
      >
        {(currentPage - 1) * perPage + index + 1}
      </td>

      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.community_name}
      </td>

      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.manager_name || "-"}
      </td>

      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.manager_contact || "-"}
      </td>

      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.total_properties}
      </td>

      <td
        className="px-3 py-1.5 text-sm text-center"
        style={{ color: themeUtils.getTextColor(true) }}
      >
        {community.total_units}
      </td>

      <td className="px-3 py-1.5 text-center">
        <ActionButtons
          onView={() => handleView(community)}
          onEdit={() => handleEdit(community)}
          // onDelete={() => handleDelete(community.id)}
          onDelete={() => handleDelete(community.community_id)}
          variant="minimal"
          viewTitle="View Community"
          editTitle="Edit Community"
          deleteTitle="Delete Community"
        />
      </td>
    </>
  );

  return (
    <div className="space-y-4">
      <AlertComponent />

      {/* Header */}
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-2">
          <div className="space-y-1">
            <CardTitle themeUtils={themeUtils}>Community List</CardTitle>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <RecordsPerPage
                value={perPage}
                onChange={setPerPage}
                className="shrink-0"
              />
              <SearchBar
                placeholder="Search Communities"
                value={search}
                onChange={setSearch}
                size="medium"
                className="w-full md:min-w-64"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto flex-wrap">
              <Button
              variant   
                icon={Plus}
                onClick={handleAdd}
                className="w-full md:w-auto"
              >
                Add Community
              </Button>

              <Button
                icon={RefreshCw}
                onClick={handleRefresh}
                loading={loading}
                className="w-full md:w-auto"
              >
                Sync
              </Button>

              <Button
                icon={Download}
                onClick={exportCSV}
                className="w-full md:w-auto"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 pl-4 pr-4">
        <div className="inline-block min-w-full align-middle">
          <Table
            headers={tableHeaders}
            data={paginatedCommunities}
            renderRow={renderRow}
            loading={loading}
            emptyMessage="No communities found. Click 'Add Community' to create one."
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 pt-4 border-t gap-4"
          style={{ borderColor: themeUtils.getBorderColor() }}
        >
          <div
            className="text-sm order-2 sm:order-1"
            style={{ color: themeUtils.getTextColor(false, true) }}
          >
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: themeUtils.getBgColor("hover"),
                borderColor: themeUtils.getBorderColor(),
                color: themeUtils.getTextColor(true),
              }}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: themeUtils.getBgColor("hover"),
                borderColor: themeUtils.getBorderColor(),
                color: themeUtils.getTextColor(true),
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCommunity;
