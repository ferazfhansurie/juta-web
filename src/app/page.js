"use client";
import React, { useState, useEffect } from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link'; // Import Link from Next.js
import { subDays } from 'date-fns';
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Settings, HelpOutline, Translate, DateRange, Refresh as RefreshIcon, Chat as ChatIcon } from '@material-ui/icons'; // Import ChatIcon from Material UI
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';


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
  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: theme.spacing(2), // Rounded corners
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: theme.spacing(2), // Rounded corners
    padding: theme.spacing(2), // Padding
  },
  table: {
    minWidth: 650,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: theme.spacing(2), // Rounded corners
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: theme.spacing(2), // Rounded corners
  },
  tableHeaderCell: {
    color: 'inherit',
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: {
    fontSize: '0.875rem',
  },
}));


const Dashboard = () => {
  const classes = useStyles();
  const [ordersData, setOrdersData] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [materialsNeeded, setMaterialsNeeded] = useState({});
  const [priorityCriteria, setPriorityCriteria] = useState('quantity');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    startOfDay(subDays(new Date(), 30)),
    endOfDay(new Date())
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders and materials simultaneously
        const ordersResponse = await fetch('api/orders');
        const materialsResponse = await fetch('/api/materials');
        const ordersData = await ordersResponse.json();
        const materialsData = await materialsResponse.json();

        // Filter orders based on the selected date range
        const filteredOrders = ordersData.filter((order) => {
          const orderDate = new Date(order.date); // Assuming 'order.date' is the date property of an order
          return orderDate >= dateRange[0] && orderDate <= dateRange[1];
        });

        // Set state with the fetched data
        setOrdersData(filteredOrders);
        setMaterialsData(materialsData); // Assuming no date filtering is required for materials
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dateRange]);
  useEffect(() => {
    const calculateMaterialsNeeded = () => {
      if (ordersData.length === 0 || materialsData.length === 0) {
        return;
      }

      const updatedMaterialsNeeded = {};
      
      ordersData.forEach(order => {
        const { pie, size, quantity } = order;
        
        materialsData.forEach(material => {
          if (material.name === pie) {
            switch (pie) {
              case "Classic Apple Pie":
                handleMaterial(material, size, quantity, "apple", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "cinnamon", updatedMaterialsNeeded);
                handleSauce(material, quantity, updatedMaterialsNeeded);
                break;
              case "Lady Pineapple":
                handleMaterial(material, size, quantity, "pineapple", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "sauce", updatedMaterialsNeeded);
                break;
              case "Johnny Blueberry":
                handleMaterial(material, size, quantity, "blueberry", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "co", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "sauce", updatedMaterialsNeeded);
                break;
              case "Caramel 'O' Pecan":
                handleMaterial(material, size, quantity, "pecan", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "caramel", updatedMaterialsNeeded);
                handleMaterial(material, size, quantity, "spice", updatedMaterialsNeeded);
                break;
              default:
                console.error(`Unhandled pie type: ${pie}`);
            }
          }
        });
      });
      
      setMaterialsNeeded(updatedMaterialsNeeded);
    };

    const handleMaterial = (material, size, quantity, ingredient, updatedMaterialsNeeded) => {
      const { name } = material;
      const materialIngredient = material[ingredient];

      if (materialIngredient) {
        let quantityForIngredient;
        switch (size) {
          case "Regular 5+” (4-5 servings)":
            quantityForIngredient = materialIngredient.regular * quantity;
            break;
          case "Medium 7+” (7-9 servings)":
            quantityForIngredient = materialIngredient.large * quantity;
            break;
          case "Large 9+” (12-14 servings)":
            quantityForIngredient = materialIngredient.large * quantity;
            break;
          default:
            console.error(`Unhandled size for ${name}: ${size}`);
            return;
        }

        if (!updatedMaterialsNeeded[name]) {
          updatedMaterialsNeeded[name] = {};
        }
        updatedMaterialsNeeded[name][ingredient] = quantityForIngredient;
      }
    };

    const handleSauce = (material, quantity, updatedMaterialsNeeded) => {
      const { name } = material;
      const sauceIngredient = material.sauce;

      if (sauceIngredient) {
        const quantityForSauce = sauceIngredient * quantity;
        if (!updatedMaterialsNeeded[name]) {
          updatedMaterialsNeeded[name] = {};
        }
        updatedMaterialsNeeded[name]['sauce'] = quantityForSauce;
      }
    };

    calculateMaterialsNeeded();
  }, [ordersData, materialsData]);

  useEffect(() => {
    const sortedPies = Object.keys(materialsNeeded).sort((a, b) => {
      switch (priorityCriteria) {
        case 'quantity':
          return calculateTotalQuantity(b) - calculateTotalQuantity(a);
        // Add more cases for other prioritization criteria if needed
        default:
          return 0;
      }
    });

    console.log("Sorted Pies:", sortedPies);
  }, [materialsNeeded, priorityCriteria]);

  const calculateTotalQuantity = (pie) => {
    let total = 0;
    for (const ingredient in materialsNeeded[pie]) {
      total += materialsNeeded[pie][ingredient];
    }
    return total;
  };

  const handleDateChange = (date) => {
    setPriorityDate(date);
    setDatePickerOpen(false); // Close the DatePicker after a date is selected
  };

  const handlePriorityChange = (event) => {
    setPriorityCriteria(event.target.value);
  };

  const renderPieQuantitiesTable = () => {
    const pieQuantities = {};
    
    ordersData.forEach(order => {
      const { pie, size, quantity } = order;

      if (!pieQuantities[pie]) {
        pieQuantities[pie] = {};
      }

      if (!pieQuantities[pie][size]) {
        pieQuantities[pie][size] = 0;
      }

      pieQuantities[pie][size] += quantity;
    });
  
    return (
      
      <Paper className={classes.tableContainer}>
          <Typography spacing={3} variant="h6" gutterBottom>
          Orders
        </Typography>
        <Table className={classes.table} aria-label="pie-quantities-table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Pie</TableCell>
              <TableCell className={classes.tableHeaderCell} align="right">Size</TableCell>
              <TableCell className={classes.tableHeaderCell} align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(pieQuantities).map(pie => (
              Object.keys(pieQuantities[pie]).map((size, index) => (
                <TableRow key={`${pie}-${size}`} className={classes.tableRow}>
                  {index === 0 && (
                    <TableCell className={classes.tableCell} rowSpan={Object.keys(pieQuantities[pie]).length}>{pie}</TableCell>
                  )}
                  <TableCell className={classes.tableCell} align="right">{size}</TableCell>
                  <TableCell className={classes.tableCell} align="right">{pieQuantities[pie][size]}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const renderMaterialsTable = () => {
    return (
      <Paper className={classes.tableContainer}>
          <Typography spacing={3}  variant="h6" gutterBottom>
          Material
        </Typography>
        <Table className={classes.table} aria-label="materials-table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Pie</TableCell>
              <TableCell className={classes.tableHeaderCell} align="right">Material</TableCell>
              <TableCell className={classes.tableHeaderCell} align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(materialsNeeded).map(pie => (
              Object.keys(materialsNeeded[pie]).map((material, index) => (
                <TableRow key={`${pie}-${material}`} className={classes.tableRow}>
                  {index === 0 && (
                    <TableCell className={classes.tableCell} rowSpan={Object.keys(materialsNeeded[pie]).length}>{pie}</TableCell>
                  )}
                  <TableCell className={classes.tableCell} align="right">{material}</TableCell>
                  <TableCell className={classes.tableCell} align="right">{materialsNeeded[pie][material]}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const totalPies = Object.keys(ordersData).length;
  const totalOrders = ordersData.reduce((acc, cur) => acc + cur.quantity, 0);
  const handleStartDateChange = (date) => {
    setDateRange([date, dateRange[1]]);
  };
  
  const handleEndDateChange = (date) => {
    setDateRange([dateRange[0], date]);
  };
  return (
    <>
      <AppBar position="static" color="inherit" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Production</Typography>
          <div className={classes.toolbarButtons}>
          <Link href="/convo">

    <IconButton color="inherit">
      <ChatIcon />
    </IconButton>

</Link>
 
      <Link href="/order">

<IconButton color="inherit">
  <ShoppingCartIcon />
</IconButton>

</Link>
   
      <Link href="/delivery">

<IconButton color="inherit">
  <LocalShippingIcon />
</IconButton>

</Link>


            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    
      <div>

</div>
      <div className={classes.root}>
     
        {/* The grid layout for displaying total pies and orders, and the functions for rendering pie quantities and materials table remain unchanged. */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item>
            <DatePicker
              label="Start Date"
              value={dateRange[0]}
              onChange={handleStartDateChange}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="End Date"
              value={dateRange[1]}
              onChange={handleEndDateChange}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
        <Grid container spacing={3} justifyContent="center">
   
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography color="textSecondary">Total Pies</Typography>
                <Typography className={classes.dataValue}>{totalPies}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography color="textSecondary">Total Orders</Typography>
                <Typography className={classes.dataValue}>{totalOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center">
          {/* Ensuring each table takes full width using xs={12} */}
          <Grid item xs={12}>
            {renderPieQuantitiesTable()}
          </Grid>
          <Grid item xs={12}>
            {renderMaterialsTable()}
          </Grid>
        </Grid>

      
      </div>
    </>
  );
};

export default Dashboard;
