import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import "./barcode.scss";
import moment from "moment";
import logo from '../../images/logo.png'
function Barcode(props) {
  const locationData = props.location.state?.data || [];

  useEffect(() => {
    setTimeout(() => {
      // window.print();
    }, 1000);
  }, []);

  return (
    <div className="barcode-list">
      {locationData.map((item, index) => {
        const fields = [
          { label: "الاسم", value: item.name || "" },
          { label: "رقم المشارك", value: item.membership || "" },
          { label: "رقم الإيصال", value: item.doc || "" },
          { label: "الرسوم", value: `${item.amount || ""} QR` },
          {
            label: "تاريخ الترخيص",
            value: moment.parseZone(item.date).local().format("DD/MM/YYYY"),
          },
          { label: "الهاتف", value: String(item.telephone || "") },
          {
            label: "انتهاء الصلاحية",
            value: item.microchip? moment(item.microchip).add(1, "month").format("DD/MM/YYYY"):"",
          },
          { label: "المستخدم", value: item.userName || "" },
        ];

        const safe = (v) => String(v).replace(/[\t\r\n]/g, " ");
        const qrPayload = fields.map(f => safe(f.value)).join("\t");

        return (
          <div key={index} className="main mx-5 print-container">
            {/* Text section */}
            <div className="barcodeText" style={{ direction: "rtl", textAlign: "right" }}>
              <h4 className="heading_barcode">
                {fields.map(({ label, value }) => (
                  <p key={label}>
                    <strong className="valuebarcode">{label}</strong> : {value}
                  </p>
                ))}
              </h4>
            </div>

            {/* QR Code + Logo section */}
            <div className="barcode_image" style={{ position: "relative", display: "inline-block" }}>
              {/* QR Code */}
              <QRCode
                value={qrPayload}
                size={300}
                level="M"
                includeMargin
                renderAs="canvas"
              />
              
              {/* Logo overlay at center */}
              <img
                src={logo}    // 🔸 Place logo.png inside /public folder
                alt="Company Logo"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",      // adjust as needed
                  height: "60px",
                  borderRadius: "12px",
                  background: "white", // gives white padding behind logo
                  padding: "5px",      // spacing to improve scan readability
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
