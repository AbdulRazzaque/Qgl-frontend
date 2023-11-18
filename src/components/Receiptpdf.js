import React, { useEffect } from 'react'
import './pdf.scss'
import axios from 'axios';
import moment from 'moment'
const Receiptpdf = (props) => {
  console.log('props:', props); // Add this line
  const locationData = props.location.state?.data;
  console.log('locationData:', locationData); // Add this line
 
console.log(locationData)
React.useEffect(()=>{
  setTimeout(() => {
    window.print();            
}, 1000);
},[])
  return (
    <>
     {locationData && (
     <div className="">
   

   <h1 className='text-center title'>سند قبض نقدأ/شيك</h1> 
   <h1 className='text-center title '>CASH/CHEQUE RECEIPT VOUCHER</h1> 
   <h4 className='text-center title'>ريال قطري QR</h4> 

<div class="row rectip  ">
  <div class="col">
  <h3 className='key'> No : <span className='value'>{locationData.doc}</span> </h3> 
  </div>
  <div class="col">
  <div class="row">
  <div class="col dark-border">
  <h3 className='key'> Amount</h3> 
  </div>
  <div class="col  dark-border">
  <h3 className='key'>{locationData.amount}</h3> 
  </div>
  <div class="col dark-border">
  <h3 className='key'> المبلغ</h3> 
  </div>
</div>
  </div>
  <div class="col-4">
  <h3 className='key'>Date: <span className='value'>{new Date(locationData.date).toLocaleDateString('en-US')}</span>

</h3> 



  </div>
</div>

<div class="row">
   
   <div class="col-3 my-2  ">
  <h3 className='key'>Received From Mr/ Mrs</h3> 
  </div>
   <div class="col-4 my-2  dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='name'><b>{locationData.name}</b></span> 
  </div>
   <div class="col-5 my-2 ">
  <h3 className='key'>استلمنا من السيد</h3> 
  </div>
  
   <div class="col-3 my-2  ">
  <h3 className='key'>The Amount Paid</h3> 
  </div>
   <div class="col-4 my-2   dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='value'>{locationData.amount}</span> 
  </div>
   <div class="col-5 my-2 ">
  <h3 className='key'>المبلغ المدفوع </h3> 
  </div>
  
   <div class="col-3 my-2  ">
  <h3 className='key'>Membership No</h3> 
  </div>
   <div class="col-4 my-2   dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='value'>{locationData.membership}</span> 
  </div>
   <div class="col-5 my-2 ">
  <h3 className='key'>رقم المشارك</h3> 
  </div>

   <div class="col-3 my-2  ">
  <h3 className='key'>Payment Method</h3> 
  </div>
   <div class="col-4 my-2  dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='value'>{locationData.cash}</span> 
  </div>
   <div class="col-5 my-2 ">
  <h3 className='key'>نقدا</h3> 
  </div>
 
   <div class="col-3 my-2  ">
  <h3 className='key'>Being for</h3> 
  </div>
   <div class="col-4 my-2   dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='being'>{locationData.being}</span> 
  </div>

   <div class="col-5 my-2 ">
  <h3 className='key'>ذالك عن</h3> 
  </div>
   <div class="col-3 my-2  ">
  <h3 className='key'>Microchip Implementation</h3> 
  </div>
   <div class="col-4 my-2   dark-border border-top-0 border-left-0 border-right-0">
 
    <span className='value'>{new Date(locationData.microchip).toLocaleDateString('en-US')}</span> 
  </div>

   <div class="col-5 my-2 ">
  <h3 className='key'>تاريخ الترصيص</h3> 
  </div>
  

   <div class="col my-t">
  <h3 className='key'>تو قيع المستلم</h3> 
  <h3 className='key mt-2'> Receiver Sign</h3> 

  </div>
 
   <div class="col mt-2">
  <h3 className='key'>تو قيع المحاسب</h3> 
  <h3 className='key mt-2'> Accountant Sign</h3> 
  </div>
  
</div>

 

      </div>
       )}
    </>
   

        
  )
}

export default Receiptpdf