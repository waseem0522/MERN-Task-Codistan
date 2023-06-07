import express from 'express';
// const fs = require('fs');
import cors from 'cors'

import fs from 'fs'
const app = express();
app.use(cors());
// const parentData = JSON.parse(fs.readFileSync('Parent.json'));
// const childData = JSON.parse(fs.readFileSync('Child.json'));
const parentData = JSON.parse(fs.readFileSync('Parent.json')).data;
const childData = JSON.parse(fs.readFileSync('Child.json')).data;
const pageSize = 2;

// Task 1: Fetch parent transactions with server-side pagination and sorting
app.get('/parents', (req, res) => {
  console.log('I am Called')
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'id';

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const sortedData = [...parentData].sort((a, b) => a[sort] - b[sort]);
  const parents = sortedData.slice(startIndex, endIndex);

  const parentIds = parents.map(parent => parent.id);

  // Calculate the total paid amount for each parent
  const totalPaidAmounts = parentIds.reduce((acc, parentId) => {
    const childAmounts = childData
      .filter(child => child.parentId === parentId)
      .map(child => child.paidAmount);

    const totalPaidAmount = childAmounts.reduce((sum, amount) => sum + amount, 0);

    return { ...acc, [parentId]: totalPaidAmount };
  }, {});

  // Add the total paid amount to the parent objects
  const parentsWithPaidAmount = parents.map(parent => ({
    ...parent,
    totalPaidAmount: totalPaidAmounts[parent.id] || 0,
  }));
debugger
  res.json(parentsWithPaidAmount);
});

// Task 2: Fetch child data for a specific parent
app.get('/children/:parentId', (req, res) => {
  const parentId = parseInt(req.params.parentId);

  const children = childData.filter(child => child.parentId === parentId);

  res.json(children);
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
