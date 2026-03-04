// src/pages/ClientManagement/ViewClient.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/Settings/themeUtils";
import Button from "../../components/Common/Button";

const ViewClient = ({ client, onClose }) => {
  const { themeUtils } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (client?.Client_id) {
      fetchDocuments();
      fetchNotes();
    }
  }, [client]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/client_documents.php?client_id=${client.Client_id}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/case_notes.php?client_id=${client.Client_id}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!client) return null;

  return (
    <div className="p-6" style={{ backgroundColor: themeUtils.getBgColor() }}>
      <div className="mb-[-8px] p-[2px_10px] rounded mr-0">
        <div className="flex justify-between items-center mb-3 px-5">
          <h2 className="text-[#aa9166] text-base font-bold border-r border-[#aa9166] pr-1">
            View Client Details
          </h2>
          <Button variant="secondary" onClick={onClose}>Back</Button>
        </div>
        <hr className="border border-gray-300 my-2.5" />

        <div className="px-5">
          <h2 className="text-[#aa9166] text-sm font-bold mt-1">Client Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Name:&nbsp;</span>
                {client.FirstName} {client.LastName}
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Email:&nbsp;</span>
                {client.Email}
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Phone No:&nbsp;</span>
                {client.PhoneNo}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Gender:&nbsp;</span>
                {client.Gender}
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Date Of Birth:&nbsp;</span>
                {client.DateofBirth ? formatDate(client.DateofBirth) : "N/A"}
              </p>
            </div>
            <div className="col-span-1"></div>
          </div>

          <div className="grid grid-cols-1 mt-2">
            <div className="col-span-1">
              <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                <span className="font-bold text-[#d3c89b]">Address:&nbsp;</span>
                {client.AddressLine1}, {client.AddressLine2}, {client.City}, {client.State}, {client.Country}, {client.Pincode}
              </p>
            </div>
          </div>

          <hr className="border border-gray-300 my-2.5" />

          <h2 className="text-[#aa9166] text-sm font-bold mt-1">Case Details</h2>
          
          {client.Case_Title ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Adverse Party Name:&nbsp;</span>
                    {client.Adverse_Party_Names || "N/A"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Advocate Name:&nbsp;</span>
                    {client.Adverse_Party_advocate_Names || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Case Title:&nbsp;</span>
                    {client.Case_Title}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Case Description:&nbsp;</span>
                    {client.Case_Description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Court Name:&nbsp;</span>
                    {client.Court_Name || "N/A"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Court Location:&nbsp;</span>
                    {client.Court_Location || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">Start Date:&nbsp;</span>
                    {client.Case_Startdate ? formatDate(client.Case_Startdate) : "N/A"}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
                    <span className="font-bold text-[#d3c89b]">End Date:&nbsp;</span>
                    {client.Case_Enddate ? formatDate(client.Case_Enddate) : "N/A"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-white text-xs" style={{ color: themeUtils.getTextColor() }}>
              No case details found for this client.
            </p>
          )}

          <hr className="border border-gray-300 my-2.5" />

          {/* Documents and Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            {/* Documents Section */}
            <div className="mb-[-8px] p-[2px_10px] rounded mr-0">
              <h2 className="text-[#aa9166] text-sm font-bold mt-1">Document Uploaded</h2>
              <div className="w-full">
                <div className="overflow-x-auto whitespace-nowrap">
                  <table className="w-full border border-[#aa9166]" style={{ borderCollapse: "collapse" }}>
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-[1px_3px] text-xs">No</th>
                        <th className="p-[1px_3px] text-xs">Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.length > 0 ? (
                        documents.slice(0, 5).map((doc, index) => (
                          <tr key={index}>
                            <td className="p-[1px_4px] text-xs" style={{ color: themeUtils.getTextColor() }}>
                              {index + 1}
                            </td>
                            <td className="p-[1px_4px] text-xs">
                              <a 
                                href={doc.Document_URl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#aa9166] no-underline hover:text-[#aa9166]"
                              >
                                {doc.Document_Title}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-[1px_4px] text-xs text-center" style={{ color: themeUtils.getTextColor() }}>
                            No documents found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-[-8px] p-[2px_10px] rounded mr-0 md:border-l md:border-gray-500">
              <h2 className="text-[#aa9166] text-sm font-bold mt-1">Notes</h2>
              <div className="w-full">
                <div className="overflow-x-auto whitespace-nowrap">
                  <table className="w-full border border-[#aa9166]" style={{ borderCollapse: "collapse" }}>
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-[1px_3px] text-xs">Note Date</th>
                        <th className="p-[1px_3px] text-xs">Note Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.length > 0 ? (
                        notes.slice(0, 5).map((note) => (
                          <tr key={note.Note_id}>
                            <td className="p-[1px_4px] text-xs" style={{ color: themeUtils.getTextColor() }}>
                              {note.Note_Date ? new Date(note.Note_Date).toLocaleDateString('en-CA') : "N/A"}
                            </td>
                            <td className="p-[1px_4px] text-xs" style={{ color: themeUtils.getTextColor() }}>
                              {note.Note_Title}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-[1px_4px] text-xs text-center" style={{ color: themeUtils.getTextColor() }}>
                            No notes found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClient;