import express from 'express';
import {
  all_state_officials,
  state_official_by_name,
  all_states,
  state_officials_by_branch,
  state_officials_by_tenure,
  state_officials_by_state,
  state_officials_by_state_branch,
  state_officials_by_branch_and_tenure,
  state_officials_by_party,
  state_officials_by_position,
  state_officials_by_filter
} from '../controllers/stateController.js';

const router = express.Router();

// GET all state officials across all branches
router.get('/', all_state_officials);

// GET state official by name (search across all branches)
router.get('/search', state_official_by_name);

// GET all states with basic info
router.get('/states', all_states);

// GET state officials by branch (executive, legislative, judicial)
router.get('/branch/:branch', state_officials_by_branch);

// GET state officials by tenure/year
router.get('/tenure', state_officials_by_tenure);

// GET state officials by state
router.get('/state/:stateName', state_officials_by_state);

// GET officials by branch under a particular state
router.get('/state/:stateName/:branch', state_officials_by_state_branch);

// GET officials by branch and tenure
router.get('/branch/:branch/tenure', state_officials_by_branch_and_tenure);

// GET officials by party affiliation
router.get('/party/:party', state_officials_by_party);

// GET state officials by position
router.get('/position/:position', state_officials_by_position);

// GET state officials by filter (advanced filtering)
router.get('/filter', state_officials_by_filter);

export default router;
