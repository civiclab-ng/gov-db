import Official from "../models/officialModel";
import asyncHandler from "express-async-handler";

const allOfficials = asyncHandler(async (req, res, next) => {
  res.send('display all the officials')
});

const all_officials_by_tenure = asyncHandler (async (req, res) => {
  res.send('all officials by year')
})

export {allOfficials, all_officials_by_tenure};
