// {/* <>

// <div className="mx-3">
// <div
//   style={{
//     height: 800,
//     width: "100%",
//     marginTop: "10px",
//     padding: "5px",
//   }}
// >
//   <div >
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 300 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
           

//             <TableCell align="right">Id</TableCell>
//             <TableCell align="right">MembershipNO</TableCell>
//             <TableCell align="right">Mr</TableCell>
//             <TableCell align="right"> Nationality</TableCell>
//             <TableCell align="right">NationalityID</TableCell>
//             <TableCell align="right">TelePhone</TableCell>
//             <TableCell align="right">ExtraTelePhone</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
          
//           {/* {rows.map((row, id) => ( */}
//           {rows && rows.map((row, id) => (
//             <TableRow key={id}>
//               <TableCell align="right">{id + 1}</TableCell>
//               {/* <TableCell align="right">{row.membershipno ?? ''}</TableCell> */}
//               <TableCell align="right">{row && row.membershipno ? row.membershipno : ''}</TableCell>
//               <TableCell align="right">{row.ownername ?? ''}</TableCell>
//               <TableCell align="right">{row.nationality ?? ''}</TableCell>
//               <TableCell align="right">{row.nationalid ?? ''}</TableCell>
//               <TableCell align="right">{row.telephone ?? ''}</TableCell>
//               <TableCell align="right">{row.extratelelphone ?? ''}</TableCell>
           
//               <TableCell align="right">
//                 <Button align="right" 
//               //   onClick={()=>{
//               //   axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/deleteStockIn`,{stockInId:row._id,quantity:parseInt(row.quantity)},{headers:{token:accessToken}})
//               //   .then(res=>{
//               //     console.log(res)
//               //     let arr = allStocks.filter((i)=> row._id !== i._id)
//               //     let total = 0
//               //     arr.map(item=>{
//               //       total = total +parseInt(item.quantity) * parseInt(item.price)
//               //     })
//               //     setSum(total)
//               //     setAllStocks(arr)
//               //   })
                

//               //   }
//               // }
//                 >

//    <DeleteIcon/>
//     </Button>
   
//               </TableCell> 
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </div>



  

// </div>
// </div>


// <div className="mx-3">
// <div
//   style={{
//     height: 800,
//     width: "100%",
//     marginTop: "10px",
//     padding: "5px",
//   }}
// >
//   <div >
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 300 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
           
// <div>
// <TableCell align="right">Id</TableCell>
//             <TableCell align="right">MembershipNO</TableCell>
//             <TableCell align="right">Mr</TableCell>
//             <TableCell align="right"> Nationality</TableCell>
//             <TableCell align="right">NationalityID</TableCell>
//             <TableCell align="right">TelePhone</TableCell>
//             <TableCell align="right">ExtraTelePhone</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
          
//           {/* {rows.map((row, id) => ( */}
//           {rows && rows.map((row, id) => (
//             <TableRow key={id}>
//               <TableCell align="right">{id + 1}</TableCell>
//               {/* <TableCell align="right">{row.membershipno ?? ''}</TableCell> */}
//               <TableCell align="right">{row && row.membershipno ? row.membershipno : ''}</TableCell>
//               <TableCell align="right">{row.ownername ?? ''}</TableCell>
//               <TableCell align="right">{row.nationality ?? ''}</TableCell>
//               <TableCell align="right">{row.nationalid ?? ''}</TableCell>
//               <TableCell align="right">{row.telephone ?? ''}</TableCell>
//               <TableCell align="right">{row.extratelelphone ?? ''}</TableCell>
// </div>
//             */}