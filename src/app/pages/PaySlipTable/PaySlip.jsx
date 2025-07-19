/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import logo from "../../../assets/mainLogo2.png"; // Adjust if needed
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "components/ui";

export default function PayslipReport() {
  const { id } = useParams(); // staffId from URL
  const location = useLocation();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const payslipRef = useRef(); // Reference for the download target

  // If the employee was passed via state, use that
  const passedEmployee = location.state?.employee;

  useEffect(() => {
    if (passedEmployee) {
      setPayslip(passedEmployee);
      setLoading(false);
    } else {
      axios
        .get("https://dev.trafficcounting.in/nodejs/api/get-payslip", {
          params: { staffId: id },
        })
        .then((res) => {
          setPayslip(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, passedEmployee]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  if (!payslip) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No payslip record found.
      </div>
    );
  }

  // Calculate totals as needed
  const earningTotal =
    Number(payslip.Basic) +
    Number(payslip.HRA) +
    Number(payslip.Others) +
    Number(payslip.OTAMOUNT) +
    Number(payslip.Bonus);

  const deductionsTotal =
    Number(payslip.ESI) +
    Number(payslip.PF) +
    Number(payslip.TDS) +
    Number(payslip.ProfTax);

  const netAmount = payslip.NetSal;

  // Inline CSS that mimics your Razor style
  const pageStyle = {
    width: "80%",
    minHeight: "500px",
    margin: "50px auto",
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "Calibri, Helvetica, sans-serif",
    padding: "20px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  };

  // Custom CSS string injected into the component
  const customCSS = `
    .tRight {
      text-align: right;
    }
    .borderWhite {
      border-bottom: 2px solid white !important;
    }
    .ALLborderBlack {
      border: 2px solid black !important;
    }
    .borderBlack {
      border-bottom: 2px solid black !important;
    }
    .payslip-table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 15px;
    }
    .payslip-table thead th {
      border: 2px solid black;
      padding: 8px;
      font-weight: 600;
    }
    .payslip-table tbody td {
      border-right: 2px solid black;
      border-left: 2px solid black;
      padding: 8px;
      vertical-align: middle;
      font-weight: 500;
    }
    .payslip-table tfoot tr td {
      padding: 8px;
    }
    .download-btn {
      margin-top: 20px;
      display: block;
      width: 200px;
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      text-align: center;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .download-btn:hover {
      background-color: #0056b3;
    }
  `;

  // Function to generate PDF from the payslip container
  const handleDownload = async () => {
    if (payslipRef.current) {
      try {
        const canvas = await html2canvas(payslipRef.current, {
          scale: 2,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Calculate width and height for A4 size
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Payslip-${payslip.Code}.pdf`);
      } catch (err) {
        console.error("Failed to generate PDF", err);
      }
    }
  };

  return (
    <>
      <style>{customCSS}</style>
      <div ref={payslipRef} style={pageStyle}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <img
              src={logo}
              alt="Logo"
              style={{ borderStyle: "none", height: "70px" }}
            />
            <h3 style={{ marginLeft: "80px", marginTop: "20px" }}>
              <b>PAY SLIP</b>
            </h3>
          </div>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <p>Hrishikesh Technologies Pvt Ltd</p>
            <p>1-221-1, NTR Road, Sri Nagar</p>
            <p>Gannavaram, A.P, 521101</p>
            <p>
              Month: {payslip.Month} - {payslip.Year}
            </p>
          </div>
        </div>

        {/* Employee info */}
        <div style={{ marginTop: "20px" }}>
          <table style={{ border: "none" }}>
            <tbody>
              <tr>
                <td style={{ width: "120px" }}>Employee No</td>
                <td style={{ width: "30px" }}> </td>
                <td>HTPL {payslip.Code}</td>
              </tr>
              <tr>
                <td>Employee Name</td>
                <td> </td>
                <td>{payslip.Name}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td> </td>
                <td>{payslip.DeptName}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Earnings and Deductions table */}
        <table className="payslip-table">
          <thead>
            <tr>
              <th>Earnings</th>
              <th className="tRight">Amount</th>
              <th>Deductions</th>
              <th className="tRight">Amount</th>
            </tr>
          </thead>
          <tbody style={{ border: "none" }}>
            <tr>
              <td className="borderWhite">Basic Pay</td>
              <td className="tRight borderWhite">{payslip.Basic}</td>
              <td className="borderWhite">Employee State Insurance</td>
              <td className="tRight borderWhite">{payslip.ESI}</td>
            </tr>
            <tr>
              <td className="borderWhite">House Rent Allowance</td>
              <td className="tRight borderWhite">{payslip.HRA}</td>
              <td className="borderWhite">Provident Fund</td>
              <td className="tRight borderWhite">{payslip.PF}</td>
            </tr>
            <tr>
              <td className="borderWhite">Others</td>
              <td className="tRight borderWhite">{payslip.Others}</td>
              <td className="borderWhite">Professional Tax</td>
              <td className="tRight borderWhite">{payslip.ProfTax}</td>
            </tr>
            <tr>
              <td className="borderWhite">Overtime</td>
              <td className="tRight borderWhite">{payslip.OTAMOUNT}</td>
              <td className="borderWhite">TDS</td>
              <td className="tRight borderWhite">{payslip.TDS}</td>
            </tr>
            <tr>
              <td className="borderBlack">Bonus</td>
              <td className="tRight borderBlack">{payslip.Bonus}</td>
              <td className="borderBlack"></td>
              <td className="tRight borderBlack"></td>
            </tr>
            <tr>
              <td className="borderBlack">Total</td>
              <td className="tRight borderBlack">{earningTotal}</td>
              <td className="borderBlack">Total</td>
              <td className="tRight borderBlack">{deductionsTotal}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ height: "20px" }} />
            <tr className="ALLborderBlack">
              <td style={{ border: "2px solid white" }}></td>
              <td
                className="tRight"
                style={{
                  borderLeft: "2px solid white",
                  borderBottom: "2px solid white",
                  borderTop: "2px solid white",
                }}
              />
              <td className="ALLborderBlack" style={{ textAlign: "center" }}>
                Net Amount
              </td>
              <td className="tRight ALLborderBlack">{netAmount}</td>
            </tr>
          </tfoot>
        </table>

        <p style={{ textAlign: "center", fontSize: "12px", marginTop: "15px" }}>
          <i>Note: This is a system generated statement. No signature is required.</i>
        </p>
        {/* Download button */}
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <Button color="primary" onClick={handleDownload}>
          Download Payslip
        </Button>
      </div>
      </div>

    </>
  );
}
