{/* <LocalizationProvider dateAdapter={AdapterDayjs}>
<DatePicker
name="date"
// Adjust the padding value as needed
  sx={{ width: 230 }}
  label="Date"
  value={updatedate}
    onChange={(newValue) => {
      setupdatedate(newValue);
    }}
  renderInput={(params) => (
    <TextField name="date" {...params}      />
  )}
/>
</LocalizationProvider>

<LocalizationProvider dateAdapter={AdapterDayjs}>
<DatePicker
name="date"
  sx={{ width: 500 }}
  label="Date of Microchip implementation"
  value={updateMicrochip}
    onChange={(newValue) => {
      setupdateMicrochip(newValue);
    }}
  renderInput={(params) => (
    <TextField name="date" {...params}      />
  )}
/>
</LocalizationProvider> */}
<MaterialTable
  title="Overriding Export Function Preview"
  columns={[
    { title: 'Date', field: 'date', type: 'date' },
    { title: 'Data', field: 'data' },
  ]}
  data={data}
  onRowClick={(event, rowData) => handleRowClick(event, rowData)}
  options={{
    headerStyle: {
      fontWeight: 'bold',
    },
    exportButton: true,
    paging: false, // Disable pagination
    search: true,
    filtering: true, // Enable custom filtering
  }}
  // Custom filtering logic for the 'Date' column
  components={{
    Toolbar: (props) => (
      <div>
        <MTableToolbar {...props} />
        <DatePicker
          label="Search by Date"
          value={props.dateFilter} // Access the current date filter value
          onChange={(date) => {
            props.onDateFilterChanged(date); // Call the onDateFilterChanged method
          }}
        />
      </div>
    ),
  }}
/>
