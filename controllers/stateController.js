import State from '../models/stateModel.js'
import asyncHandler from 'express-async-handler';

const all_state_officials = asyncHandler (async(req, res) => {
  res.send('all local officials')
});

const state_official_by_name = asyncHandler (async(req, res)=> {
  res.send('state official by name')
})

const all_states = asyncHandler (async(req, res) => {
  res.send('all the states and the positions')
});

const state_officials_by_branch = asyncHandler (async(req, res) => {
  res.send('all state officials by branch')
});

const state_officials_by_tenure = asyncHandler (async(req, res) => {
  res.send('all state officials by tenure / year')
});

const state_officials_by_state = asyncHandler (async(req, res) => {
  res.send('all state officials by state')
});

const state_officials_by_state_branch = asyncHandler (async(req, res) => {
  res.send('Get all officials by branch under a particular state')
});

const state_officials_by_branch_and_tenure =  asyncHandler (async(req, res) => {
  res.send('Get all state officials by branch and tenure')
});

const state_officials_by_party = asyncHandler (async(req, res) => {
  res.send('get officials by party affiliation')
});

const state_officials_by_position = asyncHandler (async(req, res) => {
  res.send('get state officials by position')
});

const state_officials_by_filter = asyncHandler (async(req, res) => {
  res.send('get state officials by unique filters')
})


export {state_official_by_name, state_officials_by_branch, state_officials_by_branch_and_tenure,
  state_officials_by_filter, state_officials_by_party, all_state_officials, all_states, state_officials_by_state_branch,
  state_officials_by_tenure, state_officials_by_position, state_officials_by_state
}
