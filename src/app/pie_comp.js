import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableRow, Button } from '@material-ui/core';

const PieDetailCard = () => {
  const pieSizes = [
    { size: 'Small', quantity: 0 },
    { size: 'Regular', quantity: 2 },
    { size: 'Large', quantity: 0 },
  ];

  const ingredients = [
    { name: 'Apple', quantity: 0 },
    { name: 'Cinnamon', quantity: 0.0 },
    { name: 'Sauce', quantity: 0.0 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Classic Apple Pie
        </Typography>
        <Table>
          <TableBody>
            {pieSizes.map((pieSize, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {pieSize.size}
                </TableCell>
                <TableCell align="right">{pieSize.quantity}</TableCell>
              </TableRow>
            ))}
            {ingredients.map((ingredient, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {ingredient.name}
                </TableCell>
                <TableCell align="right">{ingredient.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button fullWidth>{'Tap to edit priorities'}</Button>
      </CardContent>
    </Card>
  );
};

export default PieDetailCard;