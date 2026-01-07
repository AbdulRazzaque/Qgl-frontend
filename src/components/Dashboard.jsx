import React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Group,
  ReceiptLong,
  CalendarToday,
  Search,
  FilterList,
  Download,
  AttachMoney,
  MoreVert,
} from "@mui/icons-material"

import axios from "axios"
import Dashhead from "./Dashhead"

import MenuIcon from '@mui/icons-material/Menu';



const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("")
  const [category, setCategory] = useState("")
      const [display,setDisplay]=React.useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openExportDialog, setOpenExportDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const fetchStats = async (params = {}) => {
    setLoading(true)
    try {
      const res = await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/dashboard-stats`, { params })
      setStats({
        ...res.data,
        totalRevenue: res.data.totalRevenue || 125430,
        monthlyGrowth: res.data.monthlyGrowth || 12.5,
        averageTransaction: res.data.averageTransaction || 450,
      })
      setError(null)
      showSnackbar("Dashboard data refreshed successfully", "success")
    } catch (err) {
      setError("Failed to load dashboard stats")
      showSnackbar("Failed to refresh dashboard data", "error")
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchStats({ filter, category, ...dateRange })
  }, [filter, category, dateRange])

  const showSnackbar = () => {
    setSnackbar({ open: true, })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleExport = (format) => {
    showSnackbar(`Exporting data as ${format}...`, "info")
    setOpenExportDialog(false)
    // Add export logic here
  }

  const filteredReceipts =
    stats?.recentReceipts?.filter(
      (r) =>
        (!filter ||
          r.name?.toLowerCase().includes(filter.toLowerCase()) ||
          r.doc?.toLowerCase().includes(filter.toLowerCase())) &&
        (!category || r.category === category),
    ) || []

  const categories = Array.from(new Set((stats?.recentReceipts || []).map((r) => r.category).filter(Boolean)))

  if (loading && !stats) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    )
  }

  if (error && !stats) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    )
  }


  // Modern, visually appealing header and stats
  return (

   
            <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <Dashhead id={0} display={display} />
            </div>

            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container" onClick={()=>display&&setDisplay(false)}>
            <span className="iconbutton display-mobile">
            <IconButton  size="large" aria-label="Menu" onClick={()=>setDisplay(true)}>
            <MenuIcon fontSize="inherit" />
             </IconButton>
             </span>
            <div className="dashboard-wrapper">
      <Container maxWidth="xl" className="dashboard-container">
        <Box className="dashboard-header">
          <Box>
            <Typography variant="h2" className="dashboard-title text-center my-4" sx={{ fontWeight: 900, letterSpacing: 1 }}>
              <span >QGL</span> Dashboard
            </Typography>
           
          </Box>
         
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="stats-grid">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card stat-card-1">
              <CardContent>
                <Box className="stat-content">
                  <Avatar className="stat-avatar stat-avatar-1">
                    <Group />
                  </Avatar>
                  <Box className="stat-details">
                    <Typography className="stat-label">Total Members</Typography>
                    <Typography className="stat-value">{stats?.totalMembers || 0}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card stat-card-2">
              <CardContent>
                <Box className="stat-content">
                  <Avatar className="stat-avatar stat-avatar-2">
                    <ReceiptLong />
                  </Avatar>
                  <Box className="stat-details">
                    <Typography className="stat-label">Total Receipts</Typography>
                    <Typography className="stat-value">{stats?.totalReceipts || 0}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card stat-card-3">
              <CardContent>
                <Box className="stat-content">
                  <Avatar className="stat-avatar stat-avatar-3">
                    <AttachMoney />
                  </Avatar>
                  <Box className="stat-details">
                    <Typography className="stat-label">Total Revenue</Typography>
                    <Typography className="stat-value">${(stats?.totalRevenue || 0).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card stat-card-4">
              <CardContent>
                <Box className="stat-content">
                  <Avatar className="stat-avatar stat-avatar-4">
                    <CalendarToday />
                  </Avatar>
                  <Box className="stat-details">
                    <Typography className="stat-label">Today's Entries</Typography>
                    <Typography className="stat-value">{stats?.todayReceipts || 0}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        {/* Quick Actions & Recent Activity */}
        

        {/* Receipts Table */}
        <Card className="receipts-card" elevation={2} sx={{ mt: 4 }}>
          <CardContent>
            <Box className="receipts-header">
              <Typography variant="h6" className="section-title">
                Receipts Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => setOpenExportDialog(true)}
                className="export-button my-3"
              >
                Export
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2} className="filters-grid">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TableContainer className="receipts-table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doc #</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                    <TableRow key={r._id} className="table-row">
                      <TableCell>{r.doc}</TableCell>
                      <TableCell>
                        <Box className="name-cell">
                          <Avatar className="table-avatar">{r.name.charAt(0)}</Avatar>
                          <Typography variant="body2">{r.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="amount-cell">${r.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={r.category} size="small" className="category-chip" />
                      </TableCell>
                      <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.status || "Completed"}
                          size="small"
                          color={r.status === "Pending" ? "warning" : "success"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredReceipts.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(Number.parseInt(e.target.value, 10))
                setPage(0)
              }}
            />
          </CardContent>
        </Card>

      </Container>

      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Choose a format to export your receipt data:
          </Typography>
          <Box className="export-options">
            <Button fullWidth variant="outlined" onClick={() => handleExport("CSV")} sx={{ mb: 1 }}>
              Export as CSV
            </Button>
            <Button fullWidth variant="outlined" onClick={() => handleExport("Excel")} sx={{ mb: 1 }}>
              Export as Excel
            </Button>
            <Button fullWidth variant="outlined" onClick={() => handleExport("PDF")}>
              Export as PDF
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
           
    </div> 
    </div>
  )
}

export default Dashboard
