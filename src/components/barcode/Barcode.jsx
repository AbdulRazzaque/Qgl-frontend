import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./barcode.scss";
import moment from "moment";
import logo from "../../images/logo.png";
import { useLocation } from "react-router-dom";

function Barcode({ data }) {
  const location = useLocation();

  // ✅ STEP 1: data source priority
  const rawData = data ?? location.state?.data ?? [];

  // ✅ STEP 2: always convert to array
  const locationData = Array.isArray(rawData) ? rawData : [rawData];

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 1000);
  }, []);

  return (
    <div className="barcode-list">
      {locationData.map((item, index) => {
        if (!item) return null; // ✅ safety guard

        const fields = [
          { label: "الاسم", value: item.name || "" },
          { label: "رقم المشارك", value: item.membership || "" },
          { label: "رقم الإيصال", value: item.doc || "" },
          { label: "الرسوم", value: `${item.amount || ""} QR` },
          {
            label: "تاريخ الترخيص",
            value: item.date
              ? moment.parseZone(item.date).local().format("DD/MM/YYYY")
              : "",
          },
          { label: "الهاتف", value: String(item.telephone || "") },
          {
            label: "انتهاء الصلاحية",
            value: item.microchip
              ? moment(item.microchip).add(1, "month").format("DD/MM/YYYY")
              : "",
          },
          { label: "المستخدم", value: item.userName || "" },
        ];

        const qrPayload = fields
          .map(f => String(f.value).replace(/[\t\r\n]/g, " "))
          .join("\t");

        return (
          <div key={index} className="main mx-5 print-container">
            {/* Text */}
            <div
              className="barcodeText"
              style={{ direction: "rtl", textAlign: "right" }}
            >
              <h4 className="heading_barcode">
                {fields.map(({ label, value }) => (
                  <p key={label}>
                    <span className="valuebarcode">{label}</span> : {value}
                  </p>
                ))}
              </h4>
            </div>

            {/* QR */}
            <div
              className="barcode_image"
              style={{ position: "relative", display: "inline-block" }}
            >
              <QRCodeCanvas
                value={qrPayload}
                size={250}
                level="M"
                includeMargin
              />

              <img
                src={logo}
                alt="Company Logo"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: "white",
                  padding: 5,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Barcode;


