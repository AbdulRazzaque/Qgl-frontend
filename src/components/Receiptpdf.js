import React, { useEffect, useState } from 'react'
import './pdf.scss'
import axios from 'axios';
import moment from 'moment'
// import logo from '../../images/logo.png';
import logo from '../images/logo.png'
import FIRSTLAB from '../images/FIRST LAB.png'
import GENETICCENTER from '../images/GENETIC CENTER.png'
import FOOTER from '../images/FOOTER.png'
import COMMITTEELOGO from '../images/COMMITTEE LOGO.jpg'
const Receiptpdf = (props) => {
  const [currentDateTime,setCurrentDateTime]=useState(moment())
  console.log('props:', props); // Add this line
  const locationData = props.location.state?.data;
  console.log('locationData:', locationData); // Add this line
 
console.log(locationData)
React.useEffect(()=>{
  const timeoutId = setTimeout(() => {
    setCurrentDateTime(moment()) ;        
    window.print();   
}, 1000);
//Cleare the timeout when the componet unouts to prevet memory
return ()=>clearTimeout(timeoutId)
},[])
  return (
    <>
     {locationData && (
     <div className="">
   
  <div className='row mx-auto'>
    <div className='col-4'>
  <img src={FIRSTLAB} alt="Logo" className='mylogo' />

    </div>
    <div className='col-4'>
  <img src={GENETICCENTER} alt="Logo" className='mylogo' />

    </div>
    <div className='col-4'>
 {
  // (locationData.category === "Committee"?  <img src={COMMITTEELOGO} alt="Logo" className='mylogo' />:"")
  (locationData.category === "Committee"  ?  <img src={COMMITTEELOGO} alt="Logo" className='mylogo' />:"")
} 
 
  
 
    </div>
  </div>
<div className='title'>
<h1 className='text-center title1'>سند القبض</h1> 
   <h1 className='text-center title2 '>RECEIPT VOUCHER</h1> 
   <h4 className='text-center title3'>QR ريال قطري </h4> 
</div>
  
 
 
   <div class="container center-print">
  <div class="row my-3 justify-content-center align-items-center">

  <div class="col-auto">
  <h3 className='key'> No : <span className='value'>{locationData.doc}</span> </h3> 
  </div>
  <div class="col-auto">
  <div class="row">
  <div class="col-auto dark-border">
  <h3 className='key'> Amount</h3> 
  </div>
  <div class="col-auto  dark-border">
  <h3 className='key'>{locationData.amount}</h3> 
  </div>
  <div class="col-auto dark-border">
  <h3 className='key'> المبلغ</h3> 
  </div>
</div>
  </div>
  <div class="col-auto">
  {/* <h3 className='key'>Date: <span className='value'>{new Date(locationData.date).toLocaleDateString('en-US')}</span> */}
  <h3 className='key'>
  Date: <span className='value'>{new Date(locationData.date).toLocaleDateString('en-GB')}</span>


</h3> 



  </div>
</div>
</div>
<div class="container center-print">
  <div class="row my-3 justify-content-center align-items-center">
  {/* First Row Start Here  */}
    <div class="col-3 my-2">
      <h3 className='key'>Received From Mr/ Mrs</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
      <span className='name'><b>{locationData.name}</b></span> 
    </div>
    <div class="col-3 my-2">
      <h3 className='key'>استلمنا من السيد</h3> 
    </div>
    {/* Second Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>The Amount Paid</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>{locationData.amount} QR</span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>المبلغ المدفوع </h3> 
    </div>
    {/* Third Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>Membership No</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>{locationData.membership}</span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>رقم المشارك</h3> 
    </div>
    {/* forth Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>Payment Method</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>{locationData.cash}</span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>طريقه الدفع</h3> 
    </div>
    {/* Fifh Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>Being for</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>{locationData.being}</span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>ذلك عن</h3> 
    </div>
    {/* Fifh Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>Telephone</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>{locationData.telephone}</span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>هاتف</h3> 
    </div>
    {/* Sixth Row start Here  */}
    <div class="col-3 my-2">
    <h3 className='key'>Microchip Implementation</h3> 
    </div>
    <div class="col-4 my-2 dark-border border-top-0 border-left-0 border-right-0">
    <span className='value'>
      {locationData.microchip && !isNaN  (new Date(locationData.microchip))? 
    // new Date(locationData.microchip).toLocaleDateString('en-Us')
    new Date(locationData.microchip).toLocaleDateString('en-GB'):""}
    </span> 
    </div>
    <div class="col-3 my-2">
    <h3 className='key'>تاريخ الترصيص</h3> 
    </div>
   
   {/* seven Row Start Here  */}
   
   
  </div>


</div>
<div className='container sign '>
<div className='row'>
<div className='col-6'>
<h3 className='key'>توقيع المستلم</h3> 
  <h3 className='key receiver'> Receiver Sign</h3> 
</div>
<div className='col-6 mb-0'>
  <h3 className='key '>توقيع المحاسب</h3> 
  <h3 className='key receiver '> Accountant Sign</h3> 
</div>
</div>
</div>
<div className='mt-0'>
  <img src={FOOTER} alt='footer'/>
</div>
  <span className='printDate'>Issue Date: {currentDateTime.format("DD/MM/YYYY h:mm A")}</span>

      </div>
       )}
    </>
   

        
  )
}

export default Receiptpdf