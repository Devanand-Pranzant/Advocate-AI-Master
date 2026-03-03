import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronRight, Clock, Users, FileText, Briefcase } from 'lucide-react';
import { useTheme } from "../../../components/Settings/themeUtils";
import { useSweetAlert } from "../../../components/Common/SweetAlert";

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
  const [selectedDate, setSelectedDate] = useState(today);
  const [hearings, setHearings] = useState(todaysHearings);
  const [appointments, setAppointments] = useState(STATIC_DATA.todaysAppointments);

  // Handle date click
  const handleDateClick = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    setSelectedDate(dateStr);

    // Filter hearings for selected date
    const filteredHearings = STATIC_DATA.hearings.filter(
      hearing => hearing.hearingDate === dateStr
    );
    setHearings(filteredHearings);

    // Filter appointments for selected date
    const filteredAppointments = STATIC_DATA.appointments.filter(
      app => moment(app.appointment_datetime).format('YYYY-MM-DD') === dateStr
    );
    setAppointments(filteredAppointments);
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

  // Calendar events
  const events = STATIC_DATA.hearings.map(hearing => ({
    title: `${hearing.caseType} - ${hearing.Case_Title}`,
    start: new Date(hearing.hearingDate + 'T' + hearing.hearingTime),
    end: new Date(hearing.hearingDate + 'T' + hearing.hearingTime),
    allDay: false
  }));

  // Custom calendar toolbar
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    return (
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>
          {moment(toolbar.date).format('MMMM YYYY')}
        </span>
        <div className="flex gap-1">
          <button
            onClick={goToBack}
            className="px-2 py-1 text-xs border rounded transition-all"
            style={{
              backgroundColor: themeUtils.getBgColor("card"),
              color: themeUtils.getTextColor(false),
              borderColor: themeUtils.getBorderColor(),
            }}
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="px-2 py-1 text-xs border rounded transition-all"
            style={{
              backgroundColor: themeUtils.getBgColor("card"),
              color: themeUtils.getTextColor(false),
              borderColor: themeUtils.getBorderColor(),
            }}
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: themeUtils.getBgColor("main") }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1
              className="text-lg font-bold underline whitespace-nowrap text-left"
              style={{ color: themeUtils.getTextColor(true) }}
            >
              Advocate Dashboard
            </h1>
          </div>
        </div>
      </div>

      <main className="main-wrapper">
        <div className="main-content">
          <div className="container mx-auto max-w-7xl">
            {/* First Row: Cards, Quick Notes, Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Four Cards */}
              <div
                className="md:col-span-3 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <div className="grid grid-cols-2 gap-2 h-full">
                  {/* Total Clients */}
                  <div
                    className="rounded-lg border p-3 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <h6 className="text-xs mb-1" style={{ color: themeUtils.getTextColor(false) }}>Total Clients</h6>
                    <Users className="w-4 h-4 mb-1" style={{ color: "#aa9166" }} />
                    <h3 className="text-xl font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalClients}</h3>
                  </div>

                  {/* Total Cases */}
                  <div
                    className="rounded-lg border p-3 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <h6 className="text-xs mb-1" style={{ color: themeUtils.getTextColor(false) }}>Total Cases</h6>
                    <Briefcase className="w-4 h-4 mb-1" style={{ color: "#aa9166" }} />
                    <h3 className="text-xl font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalCases}</h3>
                  </div>

                  {/* Total Documents */}
                  <div
                    className="rounded-lg border p-3 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <h6 className="text-xs mb-1" style={{ color: themeUtils.getTextColor(false) }}>Total Documents</h6>
                    <FileText className="w-4 h-4 mb-1" style={{ color: "#aa9166" }} />
                    <h3 className="text-xl font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalDocuments}</h3>
                  </div>

                  {/* Total Hearings */}
                  <div
                    className="rounded-lg border p-3 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <h6 className="text-xs mb-1" style={{ color: themeUtils.getTextColor(false) }}>Total Hearings</h6>
                    <Clock className="w-4 h-4 mb-1" style={{ color: "#aa9166" }} />
                    <h3 className="text-xl font-bold" style={{ color: "#aa9166" }}>{STATIC_DATA.totalHearings}</h3>
                  </div>
                </div>
              </div>

              {/* Middle Column: Quick Notes */}
              <div
                className="md:col-span-6 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <h6 className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>Quick Notes</h6>
                <div className="rounded-lg overflow-y-auto scrollbar-hide h-[170px]">
                  {STATIC_DATA.quickNotes.map((note) => (
                    <div
                      key={note.Note_id}
                      className="flex justify-between items-start p-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-opacity-50"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                      }}
                      onClick={() => handleNoteClick(note.Note_id)}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-light mb-1" style={{ color: themeUtils.getTextColor(true) }}>{note.Note_Title}</div>
                        <div className="text-xs font-light" style={{ color: themeUtils.getTextColor(false) }}>
                          {note.Note_Description.substring(0, 60)}...
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-light" style={{ color: themeUtils.getTextColor(false) }}>
                        {moment(note.createdAt).format('DD MMM YYYY')}
                        <ChevronRight className="w-3 h-3 ml-1" style={{ color: "#aa9166" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Quick Links */}
              <div
                className="md:col-span-3 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <h6 className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>Quick Links</h6>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/all-cases"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>All Cases</span>
                  </a>
                  <a
                    href="/list-client"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Client Details</span>
                  </a>
                  <a
                    href="/quick-notes"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Quick Notes</span>
                  </a>
                  <a
                    href="/document-library"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Document Library</span>
                  </a>
                  <a
                    href="/smart-search"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Smart Search</span>
                  </a>
                  <a
                    href="/subscription"
                    className="border rounded-2xl h-[55px] flex items-center justify-center text-center transition-colors hover:text-[#b59f60]"
                    style={{
                      backgroundColor: themeUtils.getBgColor("main"),
                      borderColor: themeUtils.getBorderColor(),
                    }}
                  >
                    <span className="text-xs font-medium hover:text-[#b59f60]" style={{ color: themeUtils.getTextColor(true) }}>Subscription</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Second Row: Today's Hearings, Appointments, and Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Today's Hearings */}
              <div
                className="md:col-span-4 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <h6 className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>
                  Hearings for {selectedDate}
                </h6>
                <div className="rounded-lg overflow-y-auto scrollbar-hide h-[170px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
                      <tr>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Case Type</th>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Case Title</th>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hearings.length > 0 ? (
                        hearings.map((hearing) => (
                          <tr key={hearing.id} className="border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>{hearing.caseType}</td>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>{hearing.Case_Title}</td>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>{hearing.hearingTime}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center p-4" style={{ color: themeUtils.getTextColor(false) }}>
                            No Hearings Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Today's Appointments */}
              <div
                className="md:col-span-4 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <h6 className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>
                  Appointments for {selectedDate}
                </h6>
                <div className="rounded-lg overflow-y-auto scrollbar-hide h-[170px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0" style={{ backgroundColor: themeUtils.getBgColor("card") }}>
                      <tr>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Client Name</th>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Time</th>
                        <th className="text-left p-2 font-bold border-b" style={{ color: themeUtils.getTextColor(true), borderColor: "#806633" }}>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                          <tr key={index} className="border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>{appointment.client_name}</td>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>
                              {moment(appointment.appointment_datetime).format('h:mma').toUpperCase()}
                            </td>
                            <td className="p-2 font-light" style={{ color: themeUtils.getTextColor(false) }}>{appointment.client_contact}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center p-4" style={{ color: themeUtils.getTextColor(false) }}>
                            No Appointments Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calendar */}
              <div
                className="md:col-span-4 rounded-2xl p-3 h-[240px]"
                style={{
                  backgroundColor: themeUtils.getBgColor("card"),
                  borderColor: themeUtils.getBorderColor(),
                }}
              >
                <div className="rounded-lg h-full">
                  <h6 className="text-sm font-medium mb-2" style={{ color: themeUtils.getTextColor(true) }}>Calendar</h6>
                  <div className="calendar-container text-xs">
                    <style>{`
                      .rbc-calendar {
                        background-color: transparent !important;
                        color: ${themeUtils.getTextColor(true)} !important;
                        font-family: Arial, sans-serif !important;
                        height: 170px !important;
                      }
                      .rbc-header {
                        background-color: ${theme === 'dark' ? '#2e2e2e' : '#f3f4f6'} !important;
                        color: ${themeUtils.getTextColor(true)} !important;
                        border-color: #806633 !important;
                        font-weight: 100 !important;
                        font-size: 10px !important;
                        padding: 4px !important;
                      }
                      .rbc-month-view {
                        border-color: #806633 !important;
                        background-color: transparent !important;
                      }
                      .rbc-day-bg {
                        background-color: transparent !important;
                        border-color: #806633 !important;
                      }
                      .rbc-off-range-bg {
                        background-color: transparent !important;
                        display: none !important;
                      }
                      .rbc-date-cell {
                        color: ${themeUtils.getTextColor(true)} !important;
                        font-size: 10px !important;
                        padding: 2px !important;
                        text-align: center !important;
                      }
                      .rbc-date-cell a {
                        color: ${themeUtils.getTextColor(true)} !important;
                      }
                      .rbc-today {
                        background-color: transparent !important;
                      }
                      .rbc-today .rbc-date-cell a {
                        color: #000000 !important;
                        background: linear-gradient(270deg, rgba(128,102,51,1) 4%, rgba(255,212,127,1) 50%, rgba(128,102,51,1) 96%) !important;
                        border-radius: 50% !important;
                        width: 20px !important;
                        height: 20px !important;
                        display: inline-block !important;
                        line-height: 20px !important;
                        text-align: center !important;
                      }
                      .rbc-button-link {
                        color: ${themeUtils.getTextColor(true)} !important;
                      }
                      .rbc-row-segment {
                        display: none !important;
                      }
                      .rbc-event {
                        display: none !important;
                      }
                      .rbc-row-content {
                        pointer-events: none !important;
                      }
                      .rbc-month-row {
                        border-color: #806633 !important;
                      }
                    `}</style>
                    <Calendar
                      localizer={momentLocalizer(moment)}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      defaultView="month"
                      views={['month']}
                      toolbar={true}
                      components={{
                        toolbar: CustomToolbar
                      }}
                      onNavigate={(date) => handleDateClick(date)}
                      className="h-[170px]"
                    />
                  </div>
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
            <span>Total Cases: {STATIC_DATA.totalCases}</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Active Clients: {STATIC_DATA.totalClients}</span>
          </div>
        </div>
      </div>

      <AlertComponent />
    </div>
  );
};

export default Dashboard;