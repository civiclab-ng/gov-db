import Federal from '../models/federalModel';
import asyncHandler from 'express-async-handler';

const all_federal_officials = asyncHandler (async(req, res) => {
  res.send(' all federal officials')
});

const federal_official_by_name = asyncHandler (async(req, res)=> {
  res.send('state official by name')
});

const federal_officials_by_branch = asyncHandler (async(req, res) => {
  res.send('federal officials by branch')
});

const federal_officials_by_branch_and_tenure =  asyncHandler (async(req, res) => {
  res.send('Get all federal officials by branch and tenure')
});

const federal_officials_by_tenure = asyncHandler (async(req, res) => {
  res.send('all federal officials by tenure / year')
});

const federal_officials_by_state_and_branch = asyncHandler (async(req, res) => {
  res.send('Get all federal officials by state under a particular branch')
});

const federal_officials_by_party = asyncHandler (async(req, res) => {
  res.send('get  federal officials by party affiliation')
});
