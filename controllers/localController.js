import { LocalOfficial } from "../models/localModel";
import asyncHandler from 'express-async-handler';

// Get all local officials
const all_local_officials = asyncHandler(async(req, res) => {
  try {
    const officials = await LocalOfficial.find().populate('state', 'name');
    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get local official by name (search functionality)
const local_official_by_name = asyncHandler(async(req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a name to search'
      });
    }

    // Using regex for partial name matching, case insensitive
    const officials = await LocalOfficial.find({
      title: { $regex: name, $options: 'i' }
    }).populate('state', 'name');

    if (officials.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No officials found with that name'
      });
    }

    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all LGAs and available positions
const all_lga_and_officials = asyncHandler(async(req, res) => {
  try {
    // Aggregate to get unique LGAs and count officials by position
    const lgaData = await LocalOfficial.aggregate([
      {
        $group: {
          _id: "$lga",
          positions: { 
            $addToSet: "$councilPosition" 
          },
          totalOfficials: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by LGA name
      }
    ]);

    res.status(200).json({
      success: true,
      count: lgaData.length,
      data: lgaData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get local officials by LGA
const local_officials_by_lga = asyncHandler(async(req, res) => {
  try {
    const { lga } = req.params;
    if (!lga) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an LGA'
      });
    }

    const officials = await LocalOfficial.find({ 
      lga: { $regex: lga, $options: 'i' } 
    }).populate('state', 'name');

    if (officials.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No officials found for this LGA'
      });
    }

    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get local officials by position
const local_officials_by_position = asyncHandler(async(req, res) => {
  try {
    const { position } = req.params;
    if (!position || !['chairman', 'vice-chairman', 'councilor'].includes(position)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid position (chairman, vice-chairman, or councilor)'
      });
    }

    const officials = await LocalOfficial.find({ 
      councilPosition: position 
    }).populate('state', 'name');

    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get local officials by tenure
const local_officials_by_tenure = asyncHandler(async(req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both startDate and endDate'
      });
    }

    const officials = await LocalOfficial.find({
      tenure: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('state', 'name');

    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Note: Your schema doesn't have a party field, but I'll implement it assuming it's needed
const local_officials_by_party = asyncHandler(async(req, res) => {
  try {
    // Since party is not in your schema, you might need to add it first
    // Assuming party field exists or will be added
    const { party } = req.params;
    
    if (!party) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a party'
      });
    }

    const officials = await LocalOfficial.find({ 
      party: { $regex: party, $options: 'i' }
    }).populate('state', 'name');

    res.status(200).json({
      success: true,
      count: officials.length,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Advanced filtering
const local_officials_filtered = asyncHandler(async(req, res) => {
  try {
    // Create a query object
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Advanced filtering (gt, gte, lt, lte, etc)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|regex)\b/g, match => `$${match}`);
    
    // Find documents that match the criteria
    let query = LocalOfficial.find(JSON.parse(queryStr));
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort by creation date descending
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Exclude __v field by default
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute the query
    const officials = await query.populate('state', 'name');
    
    // Get total count for pagination info
    const totalCount = await LocalOfficial.countDocuments(JSON.parse(queryStr));
    
    res.status(200).json({
      success: true,
      count: officials.length,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export {
  all_local_officials, 
  local_official_by_name, 
  local_officials_by_lga,
  all_lga_and_officials, 
  local_officials_by_position, 
  local_officials_by_tenure, 
  local_officials_by_party,
  local_officials_filtered
};
