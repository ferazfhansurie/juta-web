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
import { ArrowBack, Refresh as RefreshIcon } from '@material-ui/icons';

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

const Deliveries = () => {
  const classes = useStyles();
  const [deliveriesData, setDeliveriesData] = useState([]);

  useEffect(() => {
    // Replace with your actual fetch call to the deliveries data endpoint
    const fetchDeliveries = async () => {
      try {
        // Update the endpoint as necessary
        const response = await fetch('/api/deliveries');
        const data = await response.json();
        setDeliveriesData(data);
      } catch (error) {
        console.error('Error fetching deliveries data:', error);
      }
    };

    fetchDeliveries();
  }, []);

  const renderDeliveriesTable = () => (
    <Paper className={classes.tableContainer}>
      <Table className={classes.table} aria-label="deliveries table">
        <TableHead className={classes.tableHeader}>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Created On</TableCell>
            <TableCell align="right">Delivery Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Delivery Person</TableCell>
            <TableCell align="right">Drop-Off Address</TableCell>
            <TableCell align="right">Pickup Location</TableCell>
            <TableCell align="right">Recipient Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveriesData.map((delivery) => (
            <TableRow key={delivery.orderId}>
              <TableCell component="th" scope="row">
                {delivery.orderId}
              </TableCell>
              <TableCell align="right">{delivery.cost}</TableCell>
              <TableCell align="right">{new Date(delivery.createdOn).toLocaleString()}</TableCell>
              <TableCell align="right">{delivery.dateDelivery}</TableCell>
              <TableCell align="right">{delivery.timeDelivery}</TableCell>
              <TableCell align="right">{delivery.deliveryPerson}</TableCell>
              <TableCell align="right">{delivery.dropOffAddress}</TableCell>
              <TableCell align="right">{delivery.pickupLocation}</TableCell>
              <TableCell align="right">{delivery.recipientName}</TableCell>
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
          <Typography variant="h6">Deliveries</Typography>
          <div className={classes.toolbarRightIcons}>
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
        {renderDeliveriesTable()}
      </div>
    </>
  );
};

export default Deliveries;
