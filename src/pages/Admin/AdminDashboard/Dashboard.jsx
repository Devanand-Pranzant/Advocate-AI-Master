// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronRight, Clock, Users, FileText, Briefcase, RefreshCw } from 'lucide-react';
import { useTheme } from "../../../components/Settings/themeUtils";
import { useSweetAlert } from "../../../components/Common/SweetAlert";
import SearchBar from "../../../components/Common/SearchBar";
import Table from "../../../components/Common/Table";
import ActionButtons from "../../../components/Common/ActionButtons";
import Button from "../../../components/Common/Button";
import Card, { CardHeader, CardTitle } from "../../../components/Common/Card";

const localizer = momentLocalizer(moment);

// Static data
const STATIC_DATA = {
  totalClients: 156,
  totalCases: 89,
  totalDocuments: 234,
  totalHearings: 12,
  openCases: 45,
  closedCases: 44,
  
  caseCounts: {
    'Criminal Law': 15,
    'Civil Law': 12,
    'Family Law': 8,
    'Commercial Law': 5,
    'Corporate Law': 3,
    'Other Law': 2
  },

  quickNotes: [
    {
      Note_id: 1,
      Note_Title: 'Client Meeting Summary',
      Note_Description: 'Discussed case strategy for Smith vs. Johnson. Need to file motion by Friday...',
      createdAt: '2024-03-15 10:30:00'
    },
    {
      Note_id: 2,
      Note_Title: 'Court Hearing Notes',
      Note_Description: 'Judge requested additional documentation for the property dispute case...',
      createdAt: '2024-03-14 14:45:00'
    },
    {
      Note_id: 3,
      Note_Title: 'Document Review',
      Note_Description: 'Reviewed contract terms for merger agreement. Several clauses need revision...',
      createdAt: '2024-03-13 09:15:00'
    },
    {
      Note_id: 4,
      Note_Title: 'Witness Statement',
      Note_Description: 'Key witness available for deposition next Tuesday. Schedule with court reporter...',
      createdAt: '2024-03-12 16:20:00'
    },
    {
      Note_id: 5,
      Note_Title: 'Settlement Discussion',
      Note_Description: 'Opposing counsel proposed settlement terms. Client reviewing options...',
      createdAt: '2024-03-11 11:00:00'
    }
  ],

  hearings: [
    {
      id: 1,
      caseType: 'Criminal Law',
      Case_Title: 'State vs. Johnson',
      hearingDate: moment().format('YYYY-MM-DD'),
      hearingTime: '10:00 AM'
    },
    {
      id: 2,
      caseType: 'Civil Law',
      Case_Title: 'Smith vs. Corporation',
      hearingDate: moment().format('YYYY-MM-DD'),
      hearingTime: '2:30 PM'
    },
    {
      id: 3,
      caseType: 'Family Law',
      Case_Title: 'Davis Divorce',
      hearingDate: moment().add(1, 'day').format('YYYY-MM-DD'),
      hearingTime: '9:00 AM'
    },
    {
      id: 4,
      caseType: 'Commercial Law',
      Case_Title: 'Business Contract Dispute',
      hearingDate: moment().add(2, 'day').format('YYYY-MM-DD'),
      hearingTime: '11:30 AM'
    },
    {
      id: 5,
      caseType: 'Corporate Law',
      Case_Title: 'Merger Agreement Review',
      hearingDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      hearingTime: '3:00 PM'
    }
  ],

  appointments: [
    {
      client_name: 'John Smith',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 10:00:00',
      client_contact: '+1 (555) 123-4567'
    },
    {
      client_name: 'Sarah Johnson',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 14:30:00',
      client_contact: '+1 (555) 987-6543'
    },
    {
      client_name: 'Michael Brown',
      appointment_datetime: moment().add(1, 'day').format('YYYY-MM-DD') + ' 11:00:00',
      client_contact: '+1 (555) 456-7890'
    },
    {
      client_name: 'Emily Davis',
      appointment_datetime: moment().add(2, 'day').format('YYYY-MM-DD') + ' 09:30:00',
      client_contact: '+1 (555) 234-5678'
    },
    {
      client_name: 'Robert Wilson',
      appointment_datetime: moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 15:45:00',
      client_contact: '+1 (555) 876-5432'
    }
  ],

  todaysAppointments: [
    {
      client_name: 'John Smith',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 10:00:00',
      client_contact: '+1 (555) 123-4567'
    },
    {
      client_name: 'Sarah Johnson',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 14:30:00',
      client_contact: '+1 (555) 987-6543'
    }, {
      client_name: 'John Smith',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 10:00:00',
      client_contact: '+1 (555) 123-4567'
    },
    {
      client_name: 'Sarah Johnson',
      appointment_datetime: moment().format('YYYY-MM-DD') + ' 14:30:00',
      client_contact: '+1 (555) 987-6543'
    }
  ]
};

// Get today's date
const today = moment().format('YYYY-MM-DD');

// Filter today's hearings
const todaysHearings = STATIC_DATA.hearings.filter(
  hearing => hearing.hearingDate === today
);

const Dashboard = () => {
  const { theme, themeUtils } = useTheme();
  const { showAlert, AlertComponent } = useSweetAlert();
  
  // State
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [hearings, setHearings] = useState(todaysHearings);
  const [appointments, setAppointments] = useState(STATIC_DATA.todaysAppointments);
  const [quickNotesSearch, setQuickNotesSearch] = useState('');
  const [hearingsSearch, setHearingsSearch] = useState('');
  const [appointmentsSearch, setAppointmentsSearch] = useState('');
  const [quickNotesPerPage, setQuickNotesPerPage] = useState(5);
  const [hearingsPerPage, setHearingsPerPage] = useState(5);
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(5);
  const [quickNotesPage, setQuickNotesPage] = useState(1);
  const [hearingsPage, setHearingsPage] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState(1);

  // Get current month and year for calendar
  const [currentDate, setCurrentDate] = useState(moment().toDate());

  // Handle date click
  const handleDateClick = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    setSelectedDate(dateStr);

    // Filter hearings for selected date
    const filteredHearings = STATIC_DATA.hearings.filter(
      hearing => hearing.hearingDate === dateStr
    );
    setHearings(filteredHearings);
    setHearingsPage(1);

    // Filter appointments for selected date
    const filteredAppointments = STATIC_DATA.appointments.filter(
      app => moment(app.appointment_datetime).format('YYYY-MM-DD') === dateStr
    );
    setAppointments(filteredAppointments);
    setAppointmentsPage(1);
  };

  // Handle note click
  const handleNoteClick = (noteId) => {
    showAlert({
      type: "info",
      title: "Quick Note",
      message: "Viewing note details",
      confirmText: "Close",
    });
  };

  // Handle hearing click
  const handleHearingClick = (hearingId) => {
    showAlert({
      type: "info",
      title: "Hearing Details",
      message: `Viewing hearing ID: ${hearingId}`,
      confirmText: "Close",
    });
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment) => {
    showAlert({
      type: "info",
      title: "Appointment Details",
      message: `Client: ${appointment.client_name}\nContact: ${appointment.client_contact}`,
      confirmText: "Close",
    });
  };

  

  // Calendar events
  const events = STATIC_DATA.hearings.map(hearing => ({
    title: `${hearing.caseType} - ${hearing.Case_Title}`,
    start: new Date(hearing.hearingDate + 'T' + hearing.hearingTime),
    end: new Date(hearing.hearingDate + 'T' + hearing.hearingTime),
    allDay: false
  }));

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
    setCurrentDate(toolbar.date);
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
    setCurrentDate(toolbar.date);
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
    setCurrentDate(new Date());
    handleDateClick(new Date());
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>
        {moment(toolbar.date).format('MMMM YYYY')}
      </span>
      <div className="flex gap-1">
        <button
          onClick={goToBack}
          className="px-2 py-1 text-xs border rounded transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            color: themeUtils.getTextColor(true),
            borderColor: "#806633",
          }}
        >
          ‹
        </button>
        <button
          onClick={goToToday}
          className="px-2 py-1 text-xs border rounded transition-all hover:shadow-md"
          style={{
            background: "linear-gradient(270deg, rgba(128,102,51,1) 4%, rgba(255,212,127,1) 50%, rgba(128,102,51,1) 96%)",
            color: "#000000",
            borderColor: "#806633",
            fontWeight: "500"
          }}
        >
          Today
        </button>
        <button
          onClick={goToNext}
          className="px-2 py-1 text-xs border rounded transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            color: themeUtils.getTextColor(true),
            borderColor: "#806633",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

  // Filter functions
  const filteredHearings = hearings.filter(hearing =>
    hearing.caseType.toLowerCase().includes(hearingsSearch.toLowerCase()) ||
    hearing.Case_Title.toLowerCase().includes(hearingsSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter(app =>
    app.client_name.toLowerCase().includes(appointmentsSearch.toLowerCase()) ||
    app.client_contact.includes(appointmentsSearch)
  );

  const filteredQuickNotes = STATIC_DATA.quickNotes.filter(note =>
    note.Note_Title.toLowerCase().includes(quickNotesSearch.toLowerCase()) ||
    note.Note_Description.toLowerCase().includes(quickNotesSearch.toLowerCase())
  );

  // Pagination
  const paginatedHearings = filteredHearings.slice(
    (hearingsPage - 1) * hearingsPerPage,
    hearingsPage * hearingsPerPage
  );

  const paginatedAppointments = filteredAppointments.slice(
    (appointmentsPage - 1) * appointmentsPerPage,
    appointmentsPage * appointmentsPerPage
  );

  const paginatedQuickNotes = filteredQuickNotes.slice(
    (quickNotesPage - 1) * quickNotesPerPage,
    quickNotesPage * quickNotesPerPage
  );

  const hearingsTotalPages = Math.ceil(filteredHearings.length / hearingsPerPage);
  const appointmentsTotalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const quickNotesTotalPages = Math.ceil(filteredQuickNotes.length / quickNotesPerPage);

  // Table headers
  const hearingsHeaders = ["Case Type", "Case Title", "Time", "Action"];
  const appointmentsHeaders = ["Client Name", "Time", "Contact", "Action"];
  const quickNotesHeaders = ["Title", "Description", "Date", "Action"];

  // Render functions
  const renderHearingsRow = (hearing, index) => (
    <>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(true) }}>
        {hearing.caseType}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(true) }}>
        {hearing.Case_Title}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(false) }}>
        {hearing.hearingTime}
      </td>
      <td className="px-3 py-2 text-center">
        <ActionButtons
          onView={() => handleHearingClick(hearing.id)}
          variant="minimal"
          viewTitle="View Hearing"
        />
      </td>
    </>
  );

  const renderAppointmentsRow = (appointment, index) => (
    <>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(true) }}>
        {appointment.client_name}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(false) }}>
        {moment(appointment.appointment_datetime).format('h:mma').toUpperCase()}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(false) }}>
        {appointment.client_contact}
      </td>
      <td className="px-3 py-2 text-center">
        <ActionButtons
          onView={() => handleAppointmentClick(appointment)}
          variant="minimal"
          viewTitle="View Appointment"
        />
      </td>
    </>
  );

  const renderQuickNotesRow = (note, index) => (
    <>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(true) }}>
        {note.Note_Title}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(false) }}>
        {note.Note_Description.substring(0, 50)}...
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: themeUtils.getTextColor(false) }}>
        {moment(note.createdAt).format('DD MMM YYYY')}
      </td>
      <td className="px-3 py-2 text-center">
        <ActionButtons
          onView={() => handleNoteClick(note.Note_id)}
          variant="minimal"
          viewTitle="View Note"
        />
      </td>
    </>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: themeUtils.getBgColor("main") }}
    >
      <AlertComponent />

      {/* Header with Refresh Button */}
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2 py-1">
        
            <CardTitle themeUtils={themeUtils}>Advocate Dashboard</CardTitle>
            
          
        </div>
      </CardHeader>

      <main className="main-wrapper mt-4">
        <div className="main-content">
          <div className="container mx-auto max-w-7xl">
            {/* First Row: Stats Cards, Quick Notes, Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
         
            {/* Left Column: Stats Cards */}
<div
  className="md:col-span-3 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px' // Slightly reduced height
  }}
>
  <div className="grid grid-cols-2 gap-2 h-full"> {/* Reduced gap from 3 to 2 */}
    {/* Total Clients */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
      onClick={() => window.location.href = '/list-client'}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Total Clients</h6> {/* Smaller text, reduced margin */}
      <h3 className="text-lg font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalClients}</h3> {/* Reduced from text-xl to text-lg */}
    </div>

    {/* Total Cases */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
      onClick={() => window.location.href = '/all-cases'}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Total Cases</h6>
      <h3 className="text-lg font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalCases}</h3>
    </div>

    {/* Total Documents */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
      onClick={() => window.location.href = '/document-library'}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Total Documents</h6>
      <h3 className="text-lg font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalDocuments}</h3>
    </div>

    {/* Total Hearings */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Total Hearings</h6>
      <h3 className="text-lg font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalHearings}</h3>
    </div>

    {/* Open Cases */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Open Cases</h6>
      <h3 className="text-lg font-bold" style={{ color: "#10b981" }}>{STATIC_DATA.openCases}</h3>
    </div>

    {/* Closed Cases */}
    <div
      className="rounded-lg border py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <h6 className="text-[10px] mb-0.5" style={{ color: themeUtils.getTextColor(false) }}>Closed Cases</h6>
      <h3 className="text-lg font-bold" style={{ color: "#ef4444" }}>{STATIC_DATA.closedCases}</h3>
    </div>
  </div>
</div>  
              {/* Middle Column: Quick Notes with Table Component */}
<div
  className="md:col-span-6 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px'
  }}
>
  <div className="flex justify-between items-center mb-2">
    <h6 className="text-md font-medium" style={{ color: themeUtils.getTextColor(true) }}>Quick Notes</h6>
    <div className="flex gap-2">
      <SearchBar
        placeholder="Search notes..."
        value={quickNotesSearch}
        onChange={setQuickNotesSearch}
        size="small"
        className="w-40"
      />
    </div>
  </div>
  
  {/* Table container with adjusted height to fill space */}
  <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}> {/* Dynamic height calculation */}
    <Table
      headers={quickNotesHeaders}
      data={paginatedQuickNotes}
      renderRow={renderQuickNotesRow}
      loading={loading}
      emptyMessage="No quick notes found"
    />
  </div>

  {/* Pagination for Quick Notes - only shown when needed */}
  {quickNotesTotalPages > 1 && (
    <div className="flex justify-between items-center mt-1 pt-1 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
      <span className="text-[10px]" style={{ color: themeUtils.getTextColor(false) }}>
        Page {quickNotesPage} of {quickNotesTotalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => setQuickNotesPage(p => Math.max(1, p - 1))}
          disabled={quickNotesPage === 1}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Prev
        </button>
        <button
          onClick={() => setQuickNotesPage(p => Math.min(quickNotesTotalPages, p + 1))}
          disabled={quickNotesPage === quickNotesTotalPages}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>
            {/* Right Column: Quick Links */}
{/* Right Column: Quick Links */}
<div
  className="md:col-span-3 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px'
  }}
>
  <h6 className="text-xs font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>Quick Links</h6>
  
  <div className="grid grid-cols-2 gap-1.5 h-[calc(100%-32px)]"> {/* Added height calculation to fill space */}
    <a
      href="/all-cases"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>All Cases</span>
    </a>
    <a
      href="/list-client"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Client Details</span>
    </a>
    <a
      href="/quick-notes"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Quick Notes</span>
    </a>
    <a
      href="/document-library"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Document Library</span>
    </a>
    <a
      href="/smart-search"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Smart Search</span>
    </a>
    <a
      href="/subscription"
      className="border rounded-xl flex items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{
        backgroundColor: themeUtils.getBgColor("main"),
        borderColor: themeUtils.getBorderColor(),
        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
      }}
    >
      <span className="text-[11px] font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Subscription</span>
    </a>
  </div>
</div>
            </div>

            {/* Second Row: Today's Hearings, Appointments, and Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Today's Hearings with Table Component */}
 <div
  className="md:col-span-4 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px'
  }}
>
  <div className="flex justify-between items-center mb-2">
    <h6 className="text-xs font-medium" style={{ color: themeUtils.getTextColor(true) }}>
      Hearings for {selectedDate}
    </h6>
    <div className="flex gap-2">
      <SearchBar
        placeholder="Search hearings..."
        value={hearingsSearch}
        onChange={setHearingsSearch}
        size="small"
        className="w-36"
      />
    </div>
  </div>
  
  <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
    <Table
      headers={hearingsHeaders}
      data={paginatedHearings}
      renderRow={renderHearingsRow}
      loading={loading}
      emptyMessage="No hearings found for this date"
    />
  </div>

  {hearingsTotalPages > 1 && (
    <div className="flex justify-between items-center mt-1 pt-1 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
      <span className="text-[10px]" style={{ color: themeUtils.getTextColor(false) }}>
        Page {hearingsPage} of {hearingsTotalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => setHearingsPage(p => Math.max(1, p - 1))}
          disabled={hearingsPage === 1}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Prev
        </button>
        <button
          onClick={() => setHearingsPage(p => Math.min(hearingsTotalPages, p + 1))}
          disabled={hearingsPage === hearingsTotalPages}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>

              {/* Today's Appointments with Table Component */}
<div
  className="md:col-span-4 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px'
  }}
>
  <div className="flex justify-between items-center mb-2">
    <h6 className="text-xs font-medium" style={{ color: themeUtils.getTextColor(true) }}>
      Appointments for {selectedDate}
    </h6>
    <div className="flex gap-2">
      <SearchBar
        placeholder="Search appointments..."
        value={appointmentsSearch}
        onChange={setAppointmentsSearch}
        size="small"
        className="w-36"
      />
    </div>
  </div>
  
  <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
    <Table
      headers={appointmentsHeaders}
      data={paginatedAppointments}
      renderRow={renderAppointmentsRow}
      loading={loading}
      emptyMessage="No appointments found for this date"
    />
  </div>

  {appointmentsTotalPages > 1 && (
    <div className="flex justify-between items-center mt-1 pt-1 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
      <span className="text-[10px]" style={{ color: themeUtils.getTextColor(false) }}>
        Page {appointmentsPage} of {appointmentsTotalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => setAppointmentsPage(p => Math.max(1, p - 1))}
          disabled={appointmentsPage === 1}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Prev
        </button>
        <button
          onClick={() => setAppointmentsPage(p => Math.min(appointmentsTotalPages, p + 1))}
          disabled={appointmentsPage === appointmentsTotalPages}
          className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 transition-all hover:shadow-md"
          style={{
            backgroundColor: themeUtils.getBgColor("main"),
            borderColor: themeUtils.getBorderColor(),
            color: themeUtils.getTextColor(true)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>

              {/* Calendar */}
              {/* Calendar */}
{/* Calendar */}
<div
  className="md:col-span-4 rounded-2xl p-2"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
    height: '280px'
  }}
>
  <h6 className="text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(true) }}>Calendar</h6>
  
  <div className="calendar-container" style={{ height: 'calc(100% - 25px)' }}>
    <style>{`
      .rbc-calendar {
        background-color: transparent !important;
        font-family: Arial, sans-serif !important;
        height: 100% !important;
      }
      .rbc-header {
        background-color: ${theme.mode === "Dark" ? '#2e2e2e' : '#f3f4f6'} !important;
        color: ${themeUtils.getTextColor(true)} !important;
        border-color: #806633 !important;
        font-weight: 500 !important;
        font-size: 10px !important;
        padding: 4px !important;
        text-transform: uppercase !important;
      }
      .rbc-month-view {
        border-color: #806633 !important;
        background-color: transparent !important;
        border-radius: 4px !important;
        overflow: hidden !important;
      }
      .rbc-day-bg {
        background-color: transparent !important;
        border-color: #806633 !important;
        cursor: pointer !important;
      }
      .rbc-day-bg:hover {
        background-color: ${theme.mode === "Dark" ? 'rgba(128,102,51,0.2)' : 'rgba(128,102,51,0.1)'} !important;
      }
      .rbc-off-range-bg {
        background-color: transparent !important;
      }
      .rbc-off-range {
        opacity: 0.3 !important;
      }
      .rbc-date-cell {
        color: ${themeUtils.getTextColor(true)} !important;
        font-size: 11px !important;
        padding: 2px !important;
        text-align: center !important;
        font-weight: ${theme.mode === "Dark" ? '300' : '400'} !important;
      }
      .rbc-date-cell a {
        color: ${themeUtils.getTextColor(true)} !important;
        text-decoration: none !important;
        cursor: pointer !important;
        display: inline-block !important;
        width: 22px !important;
        height: 22px !important;
        line-height: 22px !important;
        border-radius: 50% !important;
        transition: all 0.2s ease !important;
      }
      .rbc-date-cell a:hover {
        background-color: ${theme.mode === "Dark" ? 'rgba(128,102,51,0.3)' : 'rgba(128,102,51,0.2)'} !important;
        color: ${theme.mode === "Dark" ? '#fff' : '#000'} !important;
      }
      .rbc-today {
        background-color: transparent !important;
      }
      .rbc-today .rbc-date-cell a {
        color: #000000 !important;
        background: linear-gradient(270deg, rgba(128,102,51,1) 4%, rgba(255,212,127,1) 50%, rgba(128,102,51,1) 96%) !important;
        border-radius: 50% !important;
        width: 22px !important;
        height: 22px !important;
        display: inline-block !important;
        line-height: 22px !important;
        text-align: center !important;
        font-weight: bold !important;
        font-size: 11px !important;
      }
      .rbc-button-link {
        color: ${themeUtils.getTextColor(true)} !important;
        font-size: 11px !important;
        cursor: pointer !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      .rbc-row-segment {
        display: none !important;
      }
      .rbc-event {
        display: none !important;
      }
      .rbc-month-row {
        border-color: #806633 !important;
      }
      .rbc-row-content {
        pointer-events: auto !important; /* CHANGED: This was 'none', now 'auto' to allow clicking */
      }
      .rbc-header + .rbc-header {
        border-left-color: #806633 !important;
      }
      .rbc-day-bg + .rbc-day-bg {
        border-left-color: #806633 !important;
      }
      .rbc-row {
        min-height: 28px !important;
      }
      .rbc-month-row {
        min-height: 32px !important;
      }
      .rbc-row-bg {
        pointer-events: auto !important;
      }
      .rbc-date-cell {
        pointer-events: auto !important;
      }
    `}</style>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      views={['month']}
      date={currentDate}
      onNavigate={(date) => setCurrentDate(date)}
      toolbar={true}
      components={{
        toolbar: CustomToolbar
      }}
      onDrillDown={(date) => handleDateClick(date)}
    />
  </div>
</div>
            </div>

            {/* Case Types Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              <div
                className="md:col-span-12 rounded-2xl p-3"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <h6 className="text-sm font-medium mb-3" style={{ color: themeUtils.getTextColor(true) }}>
                  Case Distribution by Type
                </h6>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.entries(STATIC_DATA.caseCounts).map(([type, count]) => (
                    <div
                      key={type}
                      className="border rounded-lg p-3 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      style={{
                        backgroundColor: themeUtils.getBgColor("main"),
                        borderColor: themeUtils.getBorderColor(),
                        boxShadow: theme.mode === "Dark" ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
                      }}
                    >
                      <div className="text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(true) }}>
                        {type}
                      </div>
                      <div className="text-lg font-bold" style={{ color: "#aa9166" }}>
                        {count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div
        className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          borderColor: themeUtils.getBorderColor(),
        }}
      >
        <div
          className="flex items-center gap-2 text-xs font-semibold"
          style={{ color: themeUtils.getTextColor(false, true) }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Advocate Case Management System</span>
          <span className="opacity-50">•</span>
          <span>Version 1.0.0</span>
          <span className="opacity-50">•</span>
          <span>Last Updated: {moment().format('DD MMM YYYY')}</span>
        </div>
        <div
          className="flex items-center gap-3 text-xs font-medium"
          style={{ color: themeUtils.getTextColor(false, true) }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Open Cases: {STATIC_DATA.openCases}</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Closed Cases: {STATIC_DATA.closedCases}</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Active Clients: {STATIC_DATA.totalClients}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;