"use client";
import React, { useState, useEffect } from 'react';
import {
  makeStyles, AppBar, Toolbar, Typography, IconButton, Table,
  TableHead, TableRow, TableCell, TableBody, Paper, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl
} from '@material-ui/core';
import Link from 'next/link';
import { Refresh as RefreshIcon, ArrowBack, AddCircleOutline, Edit, Save, Cancel, LocalShipping, Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBar: {
    marginBottom: theme.spacing(3),
    backgroundColor: '#1A202C',
    color: '#FFFFFF',
  },
  toolbarRightIcons: {
    marginLeft: 'auto',
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '& th': {
      fontSize: '1.25rem',
      color: theme.palette.common.white,
    },
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  addButton: {
    marginLeft: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [ordersData, setOrdersData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    date: '', name: '', pie: '', size: '', quantity: '', type: '', remarks: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [deliveryFormData, setDeliveryFormData] = useState({
    cost: '',
    createdOn: '',
    dateDelivery: '',
    deliveryPerson: '',
    dropOffAddress: '',
    orderId: '',
    pickupLocation: '',
    recipientName: '',
    timeDelivery: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrdersData(data);
    } catch (error) {
      console.error('Error fetching orders data:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewOrder({
      date: '', name: '', pie: '', size: '', quantity: '', type: '', remarks: ''
    });
  };

  const handleOpenDeliveryDialog = (order) => {
    setOpenDeliveryDialog(true);
    setDeliveryFormData(prevState => ({
      ...prevState,
      recipientName: order.name,
    }));
  };
  const handleCloseDeliveryDialog = async () => {
    try {
      await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryFormData),
      });
      setOpenDeliveryDialog(false);
      // Reset delivery form data after successful submission
      setDeliveryFormData({
        cost: '',
        createdOn: '',
        dateDelivery: '',
        deliveryPerson: '',
        dropOffAddress: '',
        orderId: '',
        pickupLocation: '',
        recipientName: '',
        timeDelivery: '',
      });
      // Fetch updated orders after adding delivery
      fetchOrders();
    } catch (error) {
      console.error('Error submitting delivery information:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitNewOrder = async () => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });
      handleCloseAddDialog();
      fetchOrders();
    } catch (error) {
      console.error('Error submitting new order:', error);
    }
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setEditFormData(order);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEdit = async () => {
    try {
      await fetch(`/api/orders?id=${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      console.error('Error saving order edits:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const renderOrdersTable = () => (
    <Paper className={classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableHeader}>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Pie</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Remarks</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordersData.map((order) => (
            <TableRow key={order.id}>
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="date" type="date" value={editFormData.date || ''} onChange={handleEditChange} InputLabelProps={{ shrink: true }} /> : order.date}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="name" value={editFormData.name || ''} onChange={handleEditChange} /> : order.name}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="pie" value={editFormData.pie || ''} onChange={handleEditChange} /> : order.pie}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="size" value={editFormData.size || ''} onChange={handleEditChange} /> : order.size}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="quantity" type="number" value={editFormData.quantity || ''} onChange={handleEditChange} /> : order.quantity}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="type" value={editFormData.type || ''} onChange={handleEditChange} /> : order.type}</TableCell>
              <TableCell align="right">{editingId === order.id ? <TextField name="remarks" value={editFormData.remarks || ''} onChange={handleEditChange} /> : order.remarks}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleOpenDeliveryDialog(order)}>
                  <LocalShipping />
                </IconButton>
                {editingId === order.id ? (
                  <>
                    <IconButton size="small" onClick={saveEdit}>
                      <Save />
                    </IconButton>
                    <IconButton size="small" onClick={cancelEdit}>
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton size="small" onClick={() => startEdit(order)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteOrder(order.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Orders</Typography>
          <div className={classes.toolbarRightIcons}>
            <IconButton color="inherit" onClick={fetchOrders}>
              <RefreshIcon />
            </IconButton>
            <IconButton color="inherit">
              <Link href="/"><ArrowBack /></Link>
            </IconButton>
            <IconButton color="inherit" onClick={handleOpenAddDialog}>
              <AddCircleOutline />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            id="date"
            label="Date"
            type="date"
            name="date"
            className={classes.dateField}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={handleChange}
            value={newOrder.date}
          />
          <TextField name="name" label="Name" type="text" fullWidth onChange={handleChange} margin="dense" />
          <FormControl className={classes.formControl}>
            <InputLabel id="pie-label">Pie</InputLabel>
            <Select
              labelId="pie-label"
              id="pie"
              name="pie"
              value={newOrder.pie}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Classic Apple Pie">Classic Apple Pie</MenuItem>
              <MenuItem value="Johnny Blueberry">Johnny Blueberry</MenuItem>
              <MenuItem value="Lady Pineapple">Lady Pineapple</MenuItem>
              <MenuItem value="Caramel 'O' Pecan">Caramel 'O' Pecan</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="size-label">Size</InputLabel>
            <Select
              labelId="size-label"
              id="size"
              name="size"
              value={newOrder.size}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Regular 5+” (4-5 servings)">Regular 5+” (4-5 servings)</MenuItem>
              <MenuItem value="Medium 7+” (7-9 servings)">Medium 7+” (7-9 servings)</MenuItem>
              <MenuItem value="Large 9+” (12-14 servings)">Large 9+” (12-14 servings)</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={newOrder.type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Delivery">Delivery</MenuItem>
              <MenuItem value="Pick Up">Pick Up</MenuItem>
            </Select>
          </FormControl>
          <TextField name="quantity" label="Quantity" type="number" fullWidth onChange={handleChange} margin="dense" />
          <TextField name="remarks" label="Remarks" type="text" fullWidth onChange={handleChange} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">Cancel</Button>
          <Button onClick={submitNewOrder} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeliveryDialog} onClose={handleCloseDeliveryDialog}>
        <DialogTitle>Add to Delivery</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient Name"
            type="text"
            name="recipientName"
            fullWidth
            onChange={handleDeliveryChange}
            value={deliveryFormData.recipientName}
          />
          <TextField
            label="Drop Off Address"
            type="text"
            name="dropOffAddress"
            fullWidth
            onChange={handleDeliveryChange}
            value={deliveryFormData.dropOffAddress}
          />
          <TextField
            label="Cost"
            type="number"
            name="cost"
            fullWidth
            onChange={handleDeliveryChange}
            value={deliveryFormData.cost}
          />
          <TextField
            label="Time Delivery"
            type="time"
            name="createdOn"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDeliveryChange}
            value={deliveryFormData.createdOn}
          />
          <TextField
            label="Date Delivery"
            type="date"
            name="dateDelivery"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDeliveryChange}
            value={deliveryFormData.dateDelivery}
          />
          <TextField
            label="Delivery Person"
            type="text"
            name="deliveryPerson"
            fullWidth
            onChange={handleDeliveryChange}
            value={deliveryFormData.deliveryPerson}
          />
          <TextField
            label="Pickup Location"
            type="text"
            name="pickupLocation"
            fullWidth
            onChange={handleDeliveryChange}
            value={deliveryFormData.pickupLocation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeliveryDialog} color="primary">Submit</Button>
          {/* Implement submit button for delivery form */}
        </DialogActions>
      </Dialog>
      <div className={classes.root}>
        {renderOrdersTable()}
      </div>
    </>
  );
};

export default Orders;