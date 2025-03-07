import Local from "../models/localModel";
import asyncHandler from 'express-async-handler';

const all_local_officials = asyncHandler (async(req, res) => {
  res.send('all local officials')
});

const local_official_by_name = asyncHandler (async(req, res)=> {
  res.send('local official by name')
})

const all_lga_and_officials = asyncHandler (async(req, res) => {
  res.send('all the lgas and the available positions')
});

const local_officials_by_lga = asyncHandler (async(req, res) => {
  res.send('all local officials by lga')
});

const local_officials_by_position = asyncHandler (async(req, res) => {
  res.send('all local officials by position')
});

const local_officials_by_tenure =  asyncHandler (async(req, res) => {
  res.send('all local officials by tenure')
});

const local_officials_by_party = asyncHandler (async(req, res) => {
  res.send('all local officials by party')
});

const local_officials_filtered = asyncHandler (async(req, res) => {
  res.send('local officials by filter')
})

export {all_local_officials, local_official_by_name, local_officials_by_lga,
   all_lga_and_officials, local_officials_by_position, local_officials_by_tenure, local_officials_by_party,
  local_officials_filtered}
