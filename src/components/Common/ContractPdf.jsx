// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import Swal from "sweetalert2";
// import { useTheme } from "../Settings/themeUtils";
// import Button from "./Button";
// import FreesiaLogo from "../../assets/img/RajyugLogo1.png"; // Adjust path as needed

// const getBase64ImageFromUrl = async (imageUrl) => {
//   try {
//     const response = await fetch(imageUrl);
//     if (!response.ok) throw new Error("Failed to fetch image");
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (err) {
//     console.error("Failed to convert image to base64:", err);
//     return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
//   }
// };

// // Mock email sending function - replace with real API call
// const sendEmailWithAttachment = async (email, file, fileName) => {
//   console.log(`Sending email to: ${email}`);
//   console.log(
//     `Attachment: ${fileName}, size: ${(file.size / 1024).toFixed(1)} KB`,
//   );
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1500));
//   Swal.fire({
//     title: "Email Sent",
//     text: `Successfully sent to ${email}`,
//     icon: "success",
//     timer: 2500,
//     showConfirmButton: false,
//   });
// };

// const ContractPdf = ({ isOpen, onClose, owner = null, mode = "generate" }) => {
//   const { themeUtils } = useTheme();
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     if (!isOpen) {
//       setPdfUrl("");
//       setUploadedFile(null);
//       setSending(false);
//       return;
//     }
//     if (mode === "generate" && owner) {
//       generateContract();
//     }
//   }, [isOpen, mode, owner]);

//   const generateContract = async () => {
//     setLoading(true);
//     try {
//       const pdfWidth = 900;
//       const pdfHeight = 1200;

//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: [pdfWidth, pdfHeight],
//       });

//       const logoBase64 = await getBase64ImageFromUrl(FreesiaLogo);
//       // Logos at top
//       doc.addImage(logoBase64, "JPEG", 80, 50, 250, 40);
//       // doc.addImage(aziziBase64, "JPEG", pdfWidth - 190, 30, 150, 60);

//       // Title box
//       const titleText = "Contract & Receipt for Residential BTU Meter";
//       const titleFontSize = 32;
//       const boxWidth = 780;
//       const boxX = (pdfWidth - boxWidth) / 2;
//       const boxY = 100;
//       const boxHeight = 44;

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(titleFontSize);
//       doc.setDrawColor(0, 0, 0);
//       doc.rect(boxX, boxY, boxWidth, boxHeight);
//       doc.setTextColor(0, 0, 0);
//       doc.text(titleText, pdfWidth / 2, boxY + 30, { align: "center" });

//       // Get today's date in DD/MM/YYYY format
//       const today = new Date();
//       const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
//         today.getMonth() + 1
//       )
//         .toString()
//         .padStart(2, "0")}/${today.getFullYear()}`;

//       // Description
//       doc.setFontSize(21);
//       doc.text(
//         `This Contract is made on date ${formattedDate} between first party & Second Party`,
//         60,
//         boxY + 78,
//       );

//       // First Party
//       doc.setFontSize(21);
//       doc.setTextColor(0, 0, 0);
//       doc.text("First Party", 60, boxY + 110);
//       doc.setDrawColor(0, 0, 0);
//       doc.setLineWidth(0.4);
//       doc.line(60, boxY + 113, 130, boxY + 113);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(0, 0, 0);
//       doc.text(
//         ": FREESIA ELECTROMECHANICAL WORKS CONTRACTING L.L.C",
//         150,
//         boxY + 110,
//       );

//       // Second Party Section
//       let tableStartY = boxY + 150;
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(21);
//       doc.setTextColor(0, 0, 0);
//       doc.text("Second Party :", 60, tableStartY);
//       doc.setDrawColor(0, 0, 0);
//       doc.setLineWidth(0.5);
//       doc.line(60, tableStartY + 3, 170, tableStartY + 3);

//       const col1X = 60;
//       const col3X = 650;
//       const tableWidth = col3X - col1X + 200;
//       const rowHeight = 35;
//       tableStartY += 10;

//       // Use owner data (you can also pass formData if needed)
//       const rows = [
//         ["Client Name", owner?.fullName || "N/A"],
//         ["Property/Building Name", owner?.PropertyName || "Not Selected"],
//         ["Unit Number", owner?.propertyId || "Not Selected"],
//         ["Contact Number", owner?.phone || "Not Provided"],
//         ["Email", owner?.email || ""],
//       ];

//       doc.setDrawColor(0, 0, 0);

//       rows.forEach((row, i) => {
//         const y = tableStartY + i * rowHeight;
//         doc.rect(col1X, y, tableWidth, rowHeight);
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(18);
//         doc.setTextColor(0, 0, 0);
//         doc.text(`${row[0]}`, col1X + 10, y + 22);
//         doc.text(":", col1X + 160, y + 22);
//         doc.setFont("helvetica", "normal");
//         doc.setTextColor(0, 0, 0);
//         doc.text(`${row[1]}`, col1X + 180, y + 22);
//       });

//       const lastY = tableStartY + rows.length * rowHeight;
//       doc.rect(col1X, lastY, tableWidth / 2, rowHeight);
//       doc.rect(col1X + tableWidth / 2, lastY, tableWidth / 2, rowHeight);
//       doc.setFont("helvetica", "bold");
//       doc.text("Initial BTU Meter Reading :", col1X + 5, lastY + 20);
//       doc.text("00001", col1X + 200, lastY + 20); // ← can come from owner/formData
//       doc.text(
//         "BTU Meter Serial Number :",
//         col1X + tableWidth / 2 + 5,
//         lastY + 20,
//       );
//       doc.text("SN12345678", col1X + tableWidth / 2 + 200, lastY + 20); // ← can come from owner/formData

//       // Charges Table Header
//       let y = lastY + rowHeight + 30;
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(21);
//       doc.setTextColor(255, 0, 0);
//       doc.text("Chilled Water Supply & Connection Charges:", col1X, y);

//       const underlineStartX = col1X;
//       const underlineEndX = col1X + 270;
//       const underlineY = y + 3;
//       doc.setDrawColor(255, 0, 0);
//       doc.setLineWidth(0.5);
//       doc.line(underlineStartX, underlineY, underlineEndX, underlineY);
//       doc.setDrawColor(0, 0, 0);
//       y += 10;

//       const boxX1 = col1X;
//       const boxWidth1 = tableWidth;
//       const lineHeight = 35;

//       // Values from your specification (mock / placeholders – replace with dynamic later)
//       const consumptionTariff = "0.80";
//       const fuelSurcharge = "0.075";
//       const serviceFee = "30.00";
//       const activationFee = "200.00";
//       const reconnectionCharge = "100.00";
//       const latePaymentFee = "100.00 (max 100% of outstanding)";
//       const depositMax = "Max 8 months capacity charge";
//       const excessDemandFee = "120% of Capacity Tariff (building level)";
//       const tamperingPenalty = "10% + actual cost of repair";
//       const paymentMode = "Online"; // example

//       const totalPayableExample = "TBD based on consumption"; // can be calculated later

//       const charges = [
//         [`Consumption Tariff (capped) : AED ${consumptionTariff} / RTh`, ""],
//         [`Fuel Surcharge : AED ${fuelSurcharge} / RTh`, ""],
//         [`Billing Service Fee : AED ${serviceFee} / Month`, ""],
//         [`Activation Fee (one-time) : AED ${activationFee}`, ""],
//         [`Reconnection Charge : AED ${reconnectionCharge}`, ""],
//         [`Late Payment Fee : ${latePaymentFee}`, ""],
//         [`Security Deposit`, `: ${depositMax}`],
//         [`Excess Demand Fee`, `: ${excessDemandFee} (building level)`],
//         [`Meter Tampering Penalty`, `: ${tamperingPenalty}`],
//         [
//           "Total Payable Amount (example)",
//           `: ${totalPayableExample}`,
//           "Mode of Payment",
//           `: ${paymentMode}`,
//         ],
//       ];

//       charges.forEach((row, i) => {
//         const currentY = y + i * lineHeight;
//         doc.rect(boxX1, currentY, boxWidth1, lineHeight);

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(18);
//         doc.setTextColor(i === charges.length - 1 ? 255 : 0, 0, 0);

//         if (i === charges.length - 1) {
//           // Special row with multiple columns + checkboxes
//           doc.text(row[0], boxX1 + 10, currentY + 24);
//           doc.text(row[1], boxX1 + 200, currentY + 24);
//           doc.text(row[2], boxX1 + 400, currentY + 24);

//           const checkboxY = currentY + 14;
//           const checkboxSize = 10;

//           doc.setDrawColor(0, 0, 0);
//           doc.rect(boxX1 + 580, checkboxY, checkboxSize, checkboxSize);
//           if (paymentMode === "Online") {
//             doc.setFillColor(0, 0, 0);
//             doc.rect(boxX1 + 580, checkboxY, checkboxSize, checkboxSize, "F");
//           }
//           doc.setFont("helvetica", "normal");
//           doc.setFontSize(16);
//           doc.text("Online", boxX1 + 595, currentY + 24);

//           doc.rect(boxX1 + 680, checkboxY, checkboxSize, checkboxSize);
//           if (paymentMode === "Offline") {
//             doc.setFillColor(0, 0, 0);
//             doc.rect(boxX1 + 680, checkboxY, checkboxSize, checkboxSize, "F");
//           }
//           doc.text("Cash", boxX1 + 695, currentY + 24);
//         } else {
//           doc.text(row[0], boxX1 + 10, currentY + 24);
//           doc.setTextColor(0, 0, 0);
//           doc.text(row[1], boxX1 + 200, currentY + 24);
//         }
//       });

//       y = y + charges.length * lineHeight + 40;

//       // Terms & Conditions Section
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(21);
//       doc.setTextColor(255, 0, 0);
//       doc.text("Terms & Conditions :", col1X, y);

//       const termsUnderlineY = y + 3;
//       doc.setDrawColor(255, 0, 0);
//       doc.setLineWidth(0.5);
//       doc.line(col1X, termsUnderlineY, col1X + 160, termsUnderlineY);

//       y += 25;

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(16);
//       doc.setTextColor(0, 0, 0);

//       const terms = [
//         "1. First party agrees to supply chilled water through BTU meter, provide connection, and provide service upon request to the above-mentioned premises.",
//         "2. First Party hereby reserves the rights to revise the above rates after providing a prior notice to the tenants depending on market conditions and regulatory approvals.",
//         "3. Second Party agrees to prevent unauthorized access, tampering or modification of the BTU meter or related equipment by any party other than the First Party team.",
//         "4. Second Party shall be responsible for all chilled water equipment inside the residential unit such as control valves, strainers, air vents etc. First Party reserves the right to submit a variation quotation for spare parts if replacement is required.",
//         "5. First Party will charge the chilled water bills to the Second Party directly. Charges shall be based on the BTU meter reading (in Refrigeration Ton-hours – RTh); if unavailable, estimated readings will be calculated based on average consumption. Service and admin fees are fixed monthly.",
//         "6. If the Second Party fails to make payment within 30 days of submission, First Party may disconnect supply without notice. Reconnection fee of AED 100 will be charged. Legal action may be taken under UAE law and costs borne by Second Party.",
//         "7. Second Party undertakes to follow the safety instructions and maintenance guidelines provided.",
//         "8. Required documents for new connection: 1) Rental/Ownership agreement copy, 2) Emirates ID copy.",
//         "9. Security Deposit:\n   a) The security deposit claim must be raised only by the signed Second Party within 60 days of disconnection.\n   b) First Party reserves the right to deduct unpaid bills, excess demand charges or damage/tampering costs from the deposit.",
//         "10. Meter tampering or damage will attract penalty of 10% of applicable charges plus actual cost of repair/replacement.",
//       ];

//       terms.forEach((text) => {
//         const wrapped = doc.splitTextToSize(text, pdfWidth - 120);
//         doc.text(wrapped, col1X, y);
//         y += wrapped.length * 16;
//       });

//       y += 40;

//       // Signature box
//       const signatureBoxY = y - 10;
//       const signatureBoxHeight = 70;
//       const signatureBoxX = col1X - 10;
//       const signatureBoxWidth = pdfWidth - 2 * (col1X - 10);

//       doc.setDrawColor(0, 0, 0);
//       doc.setLineWidth(0.5);
//       doc.rect(
//         signatureBoxX,
//         signatureBoxY,
//         signatureBoxWidth,
//         signatureBoxHeight,
//       );

//       const midX = signatureBoxX + signatureBoxWidth / 2;
//       doc.setDrawColor(0, 0, 0);
//       doc.setLineWidth(0.2);
//       doc.line(midX, signatureBoxY, midX, signatureBoxY + signatureBoxHeight);

//       doc.setFontSize(16);
//       doc.setTextColor(255, 0, 0);

//       const lineY = y;

//       doc.text("First Party Signature", signatureBoxX + 20, lineY + 5);
//       doc.text(
//         "Employee ID: __________________",
//         signatureBoxX + 20,
//         lineY + 50,
//       );

//       doc.text("Second Party Signature", midX + 20, lineY + 5);
//       doc.text("Emirates ID: __________________", midX + 20, lineY + 50);

//       doc.setTextColor(0, 0, 0);

//       const dataUri = doc.output("datauristring");
//       setPdfUrl(dataUri);
//     } catch (error) {
//       console.error("PDF generation error:", error);
//       Swal.fire("Error", "Failed to generate contract PDF", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.type !== "application/pdf") {
//       Swal.fire("Invalid File", "Please select a PDF file", "warning");
//       return;
//     }
//     setUploadedFile(file);
//     const objectUrl = URL.createObjectURL(file);
//     setPdfUrl(objectUrl);
//   };

//   const handleSend = async () => {
//     if (!pdfUrl) {
//       Swal.fire(
//         "No Document",
//         "Please generate or upload a PDF first",
//         "warning",
//       );
//       return;
//     }
//     if (!owner?.email) {
//       Swal.fire("Missing Email", "Customer email is required", "warning");
//       return;
//     }

//     setSending(true);

//     try {
//       let fileBlob;
//       let fileName = `Contract_${owner?.fullName?.replace(/\s+/g, "_") || "Customer"}_${new Date().toISOString().slice(0, 10)}.pdf`;

//       if (uploadedFile) {
//         fileBlob = uploadedFile;
//       } else {
//         const res = await fetch(pdfUrl);
//         fileBlob = await res.blob();
//       }

//       await sendEmailWithAttachment(owner.email, fileBlob, fileName);
//       onClose();
//     } catch (err) {
//       console.error("Send failed:", err);
//       Swal.fire(
//         "Send Failed",
//         "Could not send email. Please try again.",
//         "error",
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!pdfUrl) return;
//     const link = document.createElement("a");
//     link.href = pdfUrl;
//     link.download = `contract_${owner?.fullName?.replace(/\s+/g, "_") || "customer"}.pdf`;
//     link.click();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="w-full h-full flex flex-col">
//       {/* Body - swapped layout: details left | preview right */}
//       <div className="flex flex-1 overflow-hidden h-full">
//         {/* Left - Customer Details & Controls */}
//         <div
//           className="w-full md:w-80 border-r p-6 flex flex-col gap-6 overflow-y-auto"
//           style={{
//             backgroundColor: themeUtils.getBgColor("card"),
//             borderColor: themeUtils.getBorderColor(),
//           }}
//         >
//           <div>
//             <h3
//               className="font-semibold text-lg mb-4 border-b pb-2"
//               style={{
//                 color: themeUtils.getTextColor(true),
//                 borderColor: themeUtils.getBorderColor(),
//               }}
//             >
//               Customer Details
//             </h3>
//             <div className="space-y-2">
//               <p
//                 className="text-sm"
//                 style={{ color: themeUtils.getTextColor(false, true) }}
//               >
//                 <strong style={{ color: themeUtils.getTextColor(true) }}>
//                   Name:
//                 </strong>{" "}
//                 {owner?.fullName || "—"}
//               </p>
//               <p
//                 className="text-sm"
//                 style={{ color: themeUtils.getTextColor(false, true) }}
//               >
//                 <strong style={{ color: themeUtils.getTextColor(true) }}>
//                   Email:
//                 </strong>{" "}
//                 {owner?.email || "—"}
//               </p>
//               <p
//                 className="text-sm"
//                 style={{ color: themeUtils.getTextColor(false, true) }}
//               >
//                 <strong style={{ color: themeUtils.getTextColor(true) }}>
//                   Phone:
//                 </strong>{" "}
//                 {owner?.phone || "—"}
//               </p>
//             </div>
//           </div>

//           {mode === "upload" && (
//             <div>
//               <label
//                 className="block text-sm font-medium mb-2"
//                 style={{ color: themeUtils.getTextColor(true) }}
//               >
//                 Upload PDF File
//               </label>
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handleFileUpload}
//                 className="block w-full text-sm rounded-lg cursor-pointer focus:outline-none p-2.5 border"
//                 style={{
//                   backgroundColor: themeUtils.getBgColor("input"),
//                   borderColor: themeUtils.getBorderColor(),
//                   color: themeUtils.getTextColor(true),
//                 }}
//               />
//             </div>
//           )}

//           <div className="flex flex-col gap-4 mt-auto">
//             <Button
//               variant="primary"
//               onClick={handleSend}
//               disabled={sending || loading || !pdfUrl}
//               loading={sending}
//               className="w-full"
//               themeUtils={themeUtils}
//             >
//               Send via Email
//             </Button>

//             {pdfUrl && (
//               <Button
//                 variant="outline"
//                 onClick={handleDownload}
//                 className="w-full"
//                 themeUtils={themeUtils}
//               >
//                 Download PDF
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Right - PDF Preview */}
//         <div
//           className="flex-1 p-6 overflow-auto"
//           style={{ backgroundColor: themeUtils.getBgColor("default") }}
//         >
//           {loading ? (
//             <div className="h-full flex items-center justify-center">
//               <div
//                 className="animate-spin rounded-full h-16 w-16 border-t-4"
//                 style={{ borderTopColor: themeUtils.getTextColor(true) }}
//               ></div>
//             </div>
//           ) : pdfUrl ? (
//             <iframe
//               src={pdfUrl}
//               className="w-full h-full border rounded-lg shadow-sm"
//               style={{ borderColor: themeUtils.getBorderColor() }}
//               title="PDF Preview"
//             />
//           ) : (
//             <div
//               className="h-full flex items-center justify-center text-lg italic"
//               style={{ color: themeUtils.getTextColor(false, true) }}
//             >
//               {mode === "upload"
//                 ? "Please upload a PDF file to preview"
//                 : "Generating contract preview..."}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContractPdf;

import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import { useTheme } from "../Settings/themeUtils";
import Button from "./Button";
import FreesiaLogo from "../../assets/img/RajyugLogo1.png"; // Adjust path as needed

const getBase64ImageFromUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to convert image to base64:", err);
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  }
};

// Mock email sending function - replace with real API call
const sendEmailWithAttachment = async (email, file, fileName) => {
  console.log(`Sending email to: ${email}`);
  console.log(
    `Attachment: ${fileName}, size: ${(file.size / 1024).toFixed(1)} KB`,
  );
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  Swal.fire({
    title: "Email Sent",
    text: `Successfully sent to ${email}`,
    icon: "success",
    timer: 2500,
    showConfirmButton: false,
  });
};

const ContractPdf = ({ isOpen, onClose, owner = null, mode = "generate" }) => {
  const { themeUtils } = useTheme();
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [pdfKey, setPdfKey] = useState(0); // For forcing iframe reload
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setPdfUrl("");
      setUploadedFile(null);
      setSending(false);
      setPdfKey((prev) => prev + 1); // Reset key
      return;
    }
    if (mode === "generate" && owner) {
      generateContract();
    }
  }, [isOpen, mode, owner]);

  const generateContract = async () => {
    setLoading(true);
    try {
      const pdfWidth = 900;
      const pdfHeight = 1200;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      const logoBase64 = await getBase64ImageFromUrl(FreesiaLogo);
      // Logos at top
      doc.addImage(logoBase64, "JPEG", 80, 50, 250, 40);

      // Title box
      const titleText = "Contract & Receipt for Residential BTU Meter";
      const titleFontSize = 32;
      const boxWidth = 780;
      const boxX = (pdfWidth - boxWidth) / 2;
      const boxY = 100;
      const boxHeight = 44;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(titleFontSize);
      doc.setDrawColor(0, 0, 0);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.text(titleText, pdfWidth / 2, boxY + 30, { align: "center" });

      // Get today's date in DD/MM/YYYY format
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;

      // Description
      doc.setFontSize(21);
      doc.text(
        `This Contract is made on date ${formattedDate} between first party & Second Party`,
        60,
        boxY + 78,
      );

      // First Party
      doc.setFontSize(21);
      doc.setTextColor(0, 0, 0);
      doc.text("First Party", 60, boxY + 110);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(60, boxY + 113, 130, boxY + 113);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(
        ": FREESIA ELECTROMECHANICAL WORKS CONTRACTING L.L.C",
        150,
        boxY + 110,
      );

      // Second Party Section
      let tableStartY = boxY + 150;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.setTextColor(0, 0, 0);
      doc.text("Second Party :", 60, tableStartY);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(60, tableStartY + 3, 170, tableStartY + 3);

      const col1X = 60;
      const col3X = 650;
      const tableWidth = col3X - col1X + 200;
      const rowHeight = 35;
      tableStartY += 10;

      // Use owner data (you can also pass formData if needed)
      const rows = [
        ["Client Name", owner?.fullName || "N/A"],
        ["Property/Building Name", owner?.PropertyName || "Not Selected"],
        ["Unit Number", owner?.propertyId || "Not Selected"],
        ["Contact Number", owner?.phone || "Not Provided"],
        ["Email", owner?.email || ""],
      ];

      doc.setDrawColor(0, 0, 0);

      rows.forEach((row, i) => {
        const y = tableStartY + i * rowHeight;
        doc.rect(col1X, y, tableWidth, rowHeight);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(`${row[0]}`, col1X + 10, y + 22);
        doc.text(":", col1X + 160, y + 22);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${row[1]}`, col1X + 180, y + 22);
      });

      const lastY = tableStartY + rows.length * rowHeight;
      doc.rect(col1X, lastY, tableWidth / 2, rowHeight);
      doc.rect(col1X + tableWidth / 2, lastY, tableWidth / 2, rowHeight);
      doc.setFont("helvetica", "bold");
      doc.text("Initial BTU Meter Reading :", col1X + 5, lastY + 20);
      doc.text("00001", col1X + 200, lastY + 20); // ← can come from owner/formData
      doc.text(
        "BTU Meter Serial Number :",
        col1X + tableWidth / 2 + 5,
        lastY + 20,
      );
      doc.text("SN12345678", col1X + tableWidth / 2 + 200, lastY + 20); // ← can come from owner/formData

      // Charges Table Header
      let y = lastY + rowHeight + 30;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.setTextColor(255, 0, 0);
      doc.text("Chilled Water Supply & Connection Charges:", col1X, y);

      const underlineStartX = col1X;
      const underlineEndX = col1X + 270;
      const underlineY = y + 3;
      doc.setDrawColor(255, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(underlineStartX, underlineY, underlineEndX, underlineY);
      doc.setDrawColor(0, 0, 0);
      y += 10;

      const boxX1 = col1X;
      const boxWidth1 = tableWidth;
      const lineHeight = 35;

      // Values from your specification (mock / placeholders – replace with dynamic later)
      const consumptionTariff = "0.80";
      const fuelSurcharge = "0.075";
      const serviceFee = "30.00";
      const activationFee = "200.00";
      const reconnectionCharge = "100.00";
      const latePaymentFee = "100.00 (max 100% of outstanding)";
      const depositMax = "Max 8 months capacity charge";
      const excessDemandFee = "120% of Capacity Tariff (building level)";
      const tamperingPenalty = "10% + actual cost of repair";
      const paymentMode = "Online"; // example

      const totalPayableExample = "TBD based on consumption"; // can be calculated later

      const charges = [
        [`Consumption Tariff (capped) : AED ${consumptionTariff} / RTh`, ""],
        [`Fuel Surcharge : AED ${fuelSurcharge} / RTh`, ""],
        [`Billing Service Fee : AED ${serviceFee} / Month`, ""],
        [`Activation Fee (one-time) : AED ${activationFee}`, ""],
        [`Reconnection Charge : AED ${reconnectionCharge}`, ""],
        [`Late Payment Fee : ${latePaymentFee}`, ""],
        [`Security Deposit`, `: ${depositMax}`],
        [`Excess Demand Fee`, `: ${excessDemandFee} (building level)`],
        [`Meter Tampering Penalty`, `: ${tamperingPenalty}`],
        [
          "Total Payable Amount (example)",
          `: ${totalPayableExample}`,
          "Mode of Payment",
          `: ${paymentMode}`,
        ],
      ];

      charges.forEach((row, i) => {
        const currentY = y + i * lineHeight;
        doc.rect(boxX1, currentY, boxWidth1, lineHeight);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(i === charges.length - 1 ? 255 : 0, 0, 0);

        if (i === charges.length - 1) {
          // Special row with multiple columns + checkboxes
          doc.text(row[0], boxX1 + 10, currentY + 24);
          doc.text(row[1], boxX1 + 200, currentY + 24);
          doc.text(row[2], boxX1 + 400, currentY + 24);

          const checkboxY = currentY + 14;
          const checkboxSize = 10;

          doc.setDrawColor(0, 0, 0);
          doc.rect(boxX1 + 580, checkboxY, checkboxSize, checkboxSize);
          if (paymentMode === "Online") {
            doc.setFillColor(0, 0, 0);
            doc.rect(boxX1 + 580, checkboxY, checkboxSize, checkboxSize, "F");
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(16);
          doc.text("Online", boxX1 + 595, currentY + 24);

          doc.rect(boxX1 + 680, checkboxY, checkboxSize, checkboxSize);
          if (paymentMode === "Offline") {
            doc.setFillColor(0, 0, 0);
            doc.rect(boxX1 + 680, checkboxY, checkboxSize, checkboxSize, "F");
          }
          doc.text("Cash", boxX1 + 695, currentY + 24);
        } else {
          doc.text(row[0], boxX1 + 10, currentY + 24);
          doc.setTextColor(0, 0, 0);
          doc.text(row[1], boxX1 + 200, currentY + 24);
        }
      });

      y = y + charges.length * lineHeight + 40;

      // Terms & Conditions Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.setTextColor(255, 0, 0);
      doc.text("Terms & Conditions :", col1X, y);

      const termsUnderlineY = y + 3;
      doc.setDrawColor(255, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(col1X, termsUnderlineY, col1X + 160, termsUnderlineY);

      y += 25;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);

      const terms = [
        "1. First party agrees to supply chilled water through BTU meter, provide connection, and provide service upon request to the above-mentioned premises.",
        "2. First Party hereby reserves the rights to revise the above rates after providing a prior notice to the tenants depending on market conditions and regulatory approvals.",
        "3. Second Party agrees to prevent unauthorized access, tampering or modification of the BTU meter or related equipment by any party other than the First Party team.",
        "4. Second Party shall be responsible for all chilled water equipment inside the residential unit such as control valves, strainers, air vents etc. First Party reserves the right to submit a variation quotation for spare parts if replacement is required.",
        "5. First Party will charge the chilled water bills to the Second Party directly. Charges shall be based on the BTU meter reading (in Refrigeration Ton-hours – RTh); if unavailable, estimated readings will be calculated based on average consumption. Service and admin fees are fixed monthly.",
        "6. If the Second Party fails to make payment within 30 days of submission, First Party may disconnect supply without notice. Reconnection fee of AED 100 will be charged. Legal action may be taken under UAE law and costs borne by Second Party.",
        "7. Second Party undertakes to follow the safety instructions and maintenance guidelines provided.",
        "8. Required documents for new connection: 1) Rental/Ownership agreement copy, 2) Emirates ID copy.",
        "9. Security Deposit:\n   a) The security deposit claim must be raised only by the signed Second Party within 60 days of disconnection.\n   b) First Party reserves the right to deduct unpaid bills, excess demand charges or damage/tampering costs from the deposit.",
        "10. Meter tampering or damage will attract penalty of 10% of applicable charges plus actual cost of repair/replacement.",
      ];

      terms.forEach((text) => {
        const wrapped = doc.splitTextToSize(text, pdfWidth - 120);
        doc.text(wrapped, col1X, y);
        y += wrapped.length * 16;
      });

      y += 40;

      // Signature box
      const signatureBoxY = y - 10;
      const signatureBoxHeight = 70;
      const signatureBoxX = col1X - 10;
      const signatureBoxWidth = pdfWidth - 2 * (col1X - 10);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(
        signatureBoxX,
        signatureBoxY,
        signatureBoxWidth,
        signatureBoxHeight,
      );

      const midX = signatureBoxX + signatureBoxWidth / 2;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.line(midX, signatureBoxY, midX, signatureBoxY + signatureBoxHeight);

      doc.setFontSize(16);
      doc.setTextColor(255, 0, 0);

      const lineY = y;

      doc.text("First Party Signature", signatureBoxX + 20, lineY + 5);
      doc.text(
        "Employee ID: __________________",
        signatureBoxX + 20,
        lineY + 50,
      );

      doc.text("Second Party Signature", midX + 20, lineY + 5);
      doc.text("Emirates ID: __________________", midX + 20, lineY + 50);

      doc.setTextColor(0, 0, 0);

      const dataUri = doc.output("datauristring");
      setPdfUrl(dataUri);
      setPdfKey((prev) => prev + 1); // Force iframe reload
    } catch (error) {
      console.error("PDF generation error:", error);
      Swal.fire("Error", "Failed to generate contract PDF", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      Swal.fire("Invalid File", "Please select a PDF file", "warning");
      return;
    }
    setUploadedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);
    setPdfKey((prev) => prev + 1); // Force iframe reload
  };

  const handleSend = async () => {
    if (!pdfUrl) {
      Swal.fire(
        "No Document",
        "Please generate or upload a PDF first",
        "warning",
      );
      return;
    }
    if (!owner?.email) {
      Swal.fire("Missing Email", "Customer email is required", "warning");
      return;
    }

    setSending(true);

    try {
      let fileBlob;
      let fileName = `Contract_${owner?.fullName?.replace(/\s+/g, "_") || "Customer"}_${new Date().toISOString().slice(0, 10)}.pdf`;

      if (uploadedFile) {
        fileBlob = uploadedFile;
      } else {
        const res = await fetch(pdfUrl);
        fileBlob = await res.blob();
      }

      await sendEmailWithAttachment(owner.email, fileBlob, fileName);
      onClose();
    } catch (err) {
      console.error("Send failed:", err);
      Swal.fire(
        "Send Failed",
        "Could not send email. Please try again.",
        "error",
      );
    } finally {
      setSending(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `contract_${owner?.fullName?.replace(/\s+/g, "_") || "customer"}.pdf`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col"
      style={{ minHeight: "600px" }}
    >
      {/* Body - swapped layout: details left | preview right */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left - Customer Details & Controls */}
        <div
          className="w-full md:w-80 border-r p-6 flex flex-col gap-6 overflow-y-auto"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            borderColor: themeUtils.getBorderColor(),
          }}
        >
          <div>
            <h3
              className="font-semibold text-lg mb-4 border-b pb-2"
              style={{
                color: themeUtils.getTextColor(true),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              Customer Details
            </h3>
            <div className="space-y-2">
              <p
                className="text-sm"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                <strong style={{ color: themeUtils.getTextColor(true) }}>
                  Name:
                </strong>{" "}
                {owner?.fullName || "—"}
              </p>
              <p
                className="text-sm"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                <strong style={{ color: themeUtils.getTextColor(true) }}>
                  Email:
                </strong>{" "}
                {owner?.email || "—"}
              </p>
              <p
                className="text-sm"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                <strong style={{ color: themeUtils.getTextColor(true) }}>
                  Phone:
                </strong>{" "}
                {owner?.phone || "—"}
              </p>
            </div>
          </div>

          {mode === "upload" && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Upload PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm rounded-lg cursor-pointer focus:outline-none p-2.5 border"
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  borderColor: themeUtils.getBorderColor(),
                  color: themeUtils.getTextColor(true),
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-4 mt-auto">
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || loading || !pdfUrl}
              loading={sending}
              className="w-full"
              themeUtils={themeUtils}
            >
              Send via Email
            </Button>

            {pdfUrl && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="w-full"
                themeUtils={themeUtils}
              >
                Download PDF
              </Button>
            )}
          </div>
        </div>

        {/* Right - PDF Preview */}
        <div
          className="flex-1 flex flex-col p-6 overflow-hidden"
          style={{
            backgroundColor: themeUtils.getBgColor("default"),
            minHeight: "500px",
          }}
        >
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div
                className="animate-spin rounded-full h-16 w-16 border-t-4"
                style={{ borderTopColor: themeUtils.getTextColor(true) }}
              ></div>
            </div>
          ) : pdfUrl ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-lg"
                  style={{ color: themeUtils.getTextColor(true) }}
                >
                  Contract Preview
                </h3>
                <span
                  className="text-sm"
                  style={{ color: themeUtils.getTextColor(false, true) }}
                >
                  {mode === "upload" ? "Uploaded PDF" : "Generated Contract"}
                </span>
              </div>
              <div
                className="flex-1 overflow-hidden border rounded-lg shadow-sm"
                style={{
                  borderColor: themeUtils.getBorderColor(),
                  minHeight: "400px",
                }}
              >
                <iframe
                  key={pdfKey}
                  ref={iframeRef}
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=fitH`}
                  className="w-full h-full"
                  title="PDF Preview"
                  style={{
                    minHeight: "400px",
                    border: "none",
                  }}
                  onLoad={() => {
                    // Optional: Adjust iframe height based on content
                    if (iframeRef.current) {
                      iframeRef.current.style.height = "100%";
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="text-lg italic mb-4"
                style={{ color: themeUtils.getTextColor(false, true) }}
              >
                {mode === "upload"
                  ? "Please upload a PDF file to preview"
                  : "Generating contract preview..."}
              </div>
              {mode === "generate" && !loading && (
                <Button
                  variant="outline"
                  onClick={generateContract}
                  disabled={!owner}
                  className="mt-4"
                  themeUtils={themeUtils}
                >
                  Regenerate Contract
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractPdf;
