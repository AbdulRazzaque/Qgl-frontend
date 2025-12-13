// src/components/barcode/barcodeUtils.js
import moment from "moment";

export function buildQrPayload(item) {
  const fields = [
    item.name || "",
    item.membership || "",
    item.doc || "",
    `${item.amount || ""} QR`,
    item.date
      ? moment.parseZone(item.date).local().format("DD/MM/YYYY")
      : "",
    String(item.telephone || ""),
    item.microchip
      ? moment(item.microchip).add(1, "month").format("DD/MM/YYYY")
      : "",
    item.userName || "",
  ];

  return fields
    .map(v => String(v).replace(/[\t\r\n]/g, " "))
    .join("\t");
}
