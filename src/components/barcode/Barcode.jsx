import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';
import './barcode.scss';
import moment from 'moment';

function Barcode(props) {
    const locationData = props.location.state?.data || []; // Ensure locationData is not undefined
useEffect(()=>{
setTimeout(()=>{
    window.print()
},1000)
},[])


console.log(locationData,'this is locaticn Daata')
    return (
        <div>
        {/* {    console.log(locationData)} */}
            {locationData.map((item, index) => {
                // Define the fields to include in the QR code with custom labels
                const filteredData = {
                    'Owner': item.name,
                    'Memb NO': item.membership,
                    'Receipt': item.doc,
                    'Amount': `${item.amount} QR`,
                    'Date': moment.parseZone(item.date).local().format("DD/MM/YYYY"),
                    "Tel": item.telephone,
                    "Exp": moment(item.date).add(1,'month').format("DD/MM/YYYY"),
                    'User': item.userName,
                };

                return (
                    <div key={index} className='main mx-5 print-container'>
                        <div className='barcodBox'>
                            <div className='barcodeText'>
                                <h4 className='heading_barcode'>
                                    {Object.keys(filteredData).map((key) => (
                                        <p key={key}>
                                            <strong className='valuebarcode'>{key}:</strong> {filteredData[key]}
                                        </p>
                                    ))}
                                </h4>
                            </div>
                            <div className='barcode_image'>
                                <QRCode
                                    value={JSON.stringify(filteredData)}
                                    size={250}
                                    // level="H" // High error correction level
                
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Barcode;
