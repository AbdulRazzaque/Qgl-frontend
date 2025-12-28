import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import moment from "moment";
import { buildQrPayload } from "./barcodeUtils";
import "./barcode.scss";

function GeneticBarcode({ data }) {
  if (!data) return null;

  const fields = [
    { label: "Owner", value: data.name || "" },
    { label: "Memb NO", value: data.membership || "" },
    { label: "Receipt", value: data.doc || "" },
    { label: "Amount", value: `${data.amount || ""} QR` },
    {
      label: "Date",
      value: data.date
        ? moment.parseZone(data.date).local().format("DD/MM/YYYY")
        : "",
    },
    { label: "Tel", value: data.telephone || "" },
    {
      label: "Exp",
      value: data.microchip
        ? moment(data.microchip).add(1, "month").format("DD/MM/YYYY")
        : "",
    },
    { label: "User", value: data.userName || "" },
  ];

  const payload = buildQrPayload(data);

  return (
<div className="genetic-barcode-card">
  {/* TEXT PART */}
  <div className="genetic-barcode-text">
    {fields.map((f) => (
      <div key={f.label} className="genetic-barcode-row">
        <span className="label">{f.label}:</span>
        <span className="value">{f.value}</span>
      </div>
    ))}
  </div>

  {/* QR PART */}
  <div className="genetic-barcode-qr">
    <QRCodeCanvas value={payload} size={120} level="M" />
  </div>
</div>
  );
}

export default GeneticBarcode;
