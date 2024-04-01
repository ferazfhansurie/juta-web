"use client";
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@material-ui/lab';
import Link from 'next/link'; // Import Link from Next.js
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
    backgroundColor: '#1A202C', // This is an approximation of Tailwind's bg-gray-900
    color: '#FFFFFF', // White text color
  },

  card: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
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
  const [priorityDate, setPriorityDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const toggle = () => setOpen(!open);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/firebase/orders');
        const data = await response.json();
        setOrdersData(data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/firebase/materials');
        const data = await response.json();
        setMaterialsData(data);
      } catch (error) {
        console.error('Error fetching materials data:', error);
      }
    };

    fetchOrders();
    fetchMaterials();
  }, []);

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
        <Table className={classes.table} aria-label="pie-quantities-table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Pie Type</TableCell>
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
          <IconButton color="inherit" onClick={toggle}>
              <DateRange />
            </IconButton>
        

            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
   
      <div className={classes.root}>
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
          <Grid item xs={12} md={6}>
            {renderPieQuantitiesTable()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderMaterialsTable()}
          </Grid>
        </Grid>

      
      </div>
    </>
  );
};

export default Dashboard;
