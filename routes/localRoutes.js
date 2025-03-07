import express from 'express';
import {
  all_local_officials,
  local_official_by_name,
  all_lga_and_officials,
  local_officials_by_lga,
  local_officials_by_position,
  local_officials_by_tenure,
  local_officials_by_party,
  local_officials_filtered
} from '../controllers/localController.js';

const router = express.Router();

// GET all local officials
router.get('/', all_local_officials);

// GET local official by name (search functionality)
router.get('/search', local_official_by_name);

// GET all LGAs and available positions
router.get('/lgas', all_lga_and_officials);

// GET local officials by LGA
router.get('/lga/:lga', local_officials_by_lga);

// GET local officials by position
router.get('/position/:position', local_officials_by_position);

// GET local officials by tenure (using query parameters)
router.get('/tenure', local_officials_by_tenure);

// GET local officials by party
router.get('/party/:party', local_officials_by_party);

// GET local officials with advanced filtering
router.get('/filter', local_officials_filtered);

export default router;
