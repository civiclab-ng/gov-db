import express from 'express';
import {
  all_federal_officials,
  federal_official_by_name,
  federal_officials_by_branch,
  federal_officials_by_branch_and_tenure,
  federal_officials_by_tenure,
  federal_officials_by_state_and_branch,
  federal_officials_by_party
} from '../controllers/federalController.js';

const router = express.Router();

// Get all federal officials
router.get('/', all_federal_officials);

// Get federal official by name
router.get('/name/:name', federal_official_by_name);

// Get federal officials by branch
router.get('/branch/:branch', federal_officials_by_branch);

// Get federal officials by branch and tenure period
router.get('/branch/:branch/tenure/:startYear/:endYear?', federal_officials_by_branch_and_tenure);

// Get all federal officials by tenure period
router.get('/tenure/:startYear/:endYear?', federal_officials_by_tenure);

// Get federal officials by state and branch
router.get('/state/:state/branch/:branch', federal_officials_by_state_and_branch);

// Get federal officials by political party
router.get('/party/:partyName', federal_officials_by_party);

export default router;
