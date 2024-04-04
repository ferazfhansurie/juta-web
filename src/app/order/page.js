"use client";
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@material-ui/core';
import Link from 'next/link';
import { Settings, HelpOutline, Translate, ArrowBack, Refresh as RefreshIcon, Chat as ChatIcon } from '@material-ui/icons';

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
      fontSize: '1.25rem', // Larger text in table header
      color: theme.palette.common.white, // Ensure text is white
    },
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrdersData(data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    fetchOrders();
  }, []);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {ordersData.map((order) => (
            <TableRow key={order.id}>
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{order.date}</TableCell>
              <TableCell align="right">{order.name}</TableCell>
              <TableCell align="right">{order.pie}</TableCell>
              <TableCell align="right">{order.size}</TableCell>
              <TableCell align="right">{order.quantity}</TableCell>
              <TableCell align="right">{order.type || 'N/A'}</TableCell>
              <TableCell align="right">{order.remarks}</TableCell>
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
            {/* Icons moved inside this div to align them to the right */}
            <IconButton color="inherit">
              <RefreshIcon />
            </IconButton>
            <IconButton color="inherit">
              <Link href="/"><ArrowBack /></Link>
            </IconButton>
         
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        {renderOrdersTable()}
      </div>
    </>
  );
};

export default Orders;
