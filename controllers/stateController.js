import { State, ExecutiveOfficial, LegislativeOfficial, JudicialOfficial } from '../models/stateModel.js';
import asyncHandler from 'express-async-handler';

// Get all state officials across all branches
const all_state_officials = asyncHandler(async(req, res) => {
  try {
    // Use Promise.all to fetch officials from all branches simultaneously
    const [executives, legislators, judges] = await Promise.all([
      ExecutiveOfficial.find().populate('state', 'name'),
      LegislativeOfficial.find().populate('state', 'name'),
      JudicialOfficial.find().populate('state', 'name')
    ]);

    const allOfficials = {
      executive: executives,
      legislative: legislators,
      judicial: judges,
      totalCount: executives.length + legislators.length + judges.length
    };

    res.status(200).json({
      success: true,
      data: allOfficials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get state official by name (search across all branches)
const state_official_by_name = asyncHandler(async(req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a name to search'
      });
    }

    // Use regex for partial, case-insensitive name matching
    const nameRegex = { $regex: name, $options: 'i' };
    
    // Search in all three branches
    const [executives, legislators, judges] = await Promise.all([
      ExecutiveOfficial.find({ name: nameRegex }).populate('state', 'name'),
      LegislativeOfficial.find({ name: nameRegex }).populate('state', 'name'),
      JudicialOfficial.find({ name: nameRegex }).populate('state', 'name')
    ]);

    // Also check governor and deputy governor names
    const statesWithMatchingGovernors = await State.find({
      $or: [
        { 'governor.name': nameRegex },
        { 'deputyGovernor.name': nameRegex }
      ]
    });
    
    // Combine all results
    const results = {
      executives,
      legislators,
      judges,
      governors: statesWithMatchingGovernors.map(state => ({
        stateName: state.name,
        governor: state.governor,
        deputyGovernor: state.deputyGovernor
      })).filter(item => 
        item.governor.name.toLowerCase().includes(name.toLowerCase()) || 
        (item.deputyGovernor && item.deputyGovernor.name && 
          item.deputyGovernor.name.toLowerCase().includes(name.toLowerCase()))
      ),
      totalCount: executives.length + legislators.length + judges.length + statesWithMatchingGovernors.length
    };

    if (results.totalCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'No officials found with that name'
      });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all states with basic info
const all_states = asyncHandler(async(req, res) => {
  try {
    const states = await State.find()
      .select('name capital governor deputyGovernor')
      .lean();
    
    // Add officials count for each state
    const statesWithCounts = await Promise.all(states.map(async (state) => {
      const [executiveCount, legislativeCount, judicialCount, localCount] = await Promise.all([
        ExecutiveOfficial.countDocuments({ state: state._id }),
        LegislativeOfficial.countDocuments({ state: state._id }),
        JudicialOfficial.countDocuments({ state: state._id }),
        state.localOfficials ? state.localOfficials.length : 0
      ]);
      
      return {
        ...state,
        officialCounts: {
          executive: executiveCount,
          legislative: legislativeCount,
          judicial: judicialCount,
          local: localCount,
          total: executiveCount + legislativeCount + judicialCount + localCount
        }
      };
    }));
    
    res.status(200).json({
      success: true,
      count: states.length,
      data: statesWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get state officials by branch (executive, legislative, judicial)
const state_officials_by_branch = asyncHandler(async(req, res) => {
  try {
    const { branch } = req.params;
    
    if (!branch || !['executive', 'legislative', 'judicial'].includes(branch.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid branch (executive, legislative, or judicial)'
      });
    }
    
    let officials;
    
    switch(branch.toLowerCase()) {
      case 'executive':
        officials = await ExecutiveOfficial.find().populate('state', 'name');
        break;
      case 'legislative':
        officials = await LegislativeOfficial.find().populate('state', 'name');
        break;
      case 'judicial':
        officials = await JudicialOfficial.find().populate('state', 'name');
        break;
      default:
        officials = [];
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

// Get state officials by tenure/year
const state_officials_by_tenure = asyncHandler(async(req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both startDate and endDate'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Find officials whose tenure overlaps with the given date range
    const tenureFilter = {
      $and: [
        { tenureStart: { $lte: end } },
        { 
          $or: [
            { tenureEnd: { $gte: start } },
            { tenureEnd: null } // For officials without end date (still in office)
          ]
        }
      ]
    };
    
    // Search across all branches
    const [executives, legislators, judges] = await Promise.all([
      ExecutiveOfficial.find(tenureFilter).populate('state', 'name'),
      LegislativeOfficial.find(tenureFilter).populate('state', 'name'),
      JudicialOfficial.find(tenureFilter).populate('state', 'name')
    ]);
    
    // Also check governors and deputy governors
    const governorFilter = {
      $and: [
        { 'governor.tenureStart': { $lte: end } },
        {
          $or: [
            { 'governor.tenureEnd': { $gte: start } },
            { 'governor.tenureEnd': null }
          ]
        }
      ]
    };
    
    const statesWithGovernors = await State.find(governorFilter)
      .select('name governor deputyGovernor');
    
    const results = {
      executives,
      legislators,
      judges,
      governors: statesWithGovernors.map(state => ({
        stateName: state.name,
        governor: state.governor,
        deputyGovernor: state.deputyGovernor
      })),
      totalCount: executives.length + legislators.length + judges.length + statesWithGovernors.length
    };
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get state officials by state
const state_officials_by_state = asyncHandler(async(req, res) => {
  try {
    const { stateName } = req.params;
    
    if (!stateName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a state name'
      });
    }
    
    // Find the state first
    const state = await State.findOne({ 
      name: { $regex: new RegExp(`^${stateName}$`, 'i') }
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        error: 'State not found'
      });
    }
    
    // Find all officials for this state
    const [executives, legislators, judges] = await Promise.all([
      ExecutiveOfficial.find({ state: state._id }),
      LegislativeOfficial.find({ state: state._id }),
      JudicialOfficial.find({ state: state._id })
    ]);
    
    // Fetch the local officials if they exist
    let localOfficials = [];
    if (state.localOfficials && state.localOfficials.length > 0) {
      // Dynamically import LocalOfficial model since it's not directly exported here
      const { LocalOfficial } = await import('./local.js');
      localOfficials = await LocalOfficial.find({ 
        _id: { $in: state.localOfficials }
      });
    }
    
    const results = {
      state: {
        name: state.name,
        capital: state.capital,
        governor: state.governor,
        deputyGovernor: state.deputyGovernor
      },
      executives,
      legislators,
      judges,
      localOfficials,
      counts: {
        executive: executives.length,
        legislative: legislators.length,
        judicial: judges.length,
        local: localOfficials.length,
        total: executives.length + legislators.length + judges.length + localOfficials.length
      }
    };
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get officials by branch under a particular state
const state_officials_by_state_branch = asyncHandler(async(req, res) => {
  try {
    const { stateName, branch } = req.params;
    
    if (!stateName || !branch) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both state name and branch'
      });
    }
    
    if (!['executive', 'legislative', 'judicial', 'local'].includes(branch.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Branch must be one of: executive, legislative, judicial, or local'
      });
    }
    
    // Find the state first
    const state = await State.findOne({ 
      name: { $regex: new RegExp(`^${stateName}$`, 'i') }
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        error: 'State not found'
      });
    }
    
    let officials = [];
    
    switch(branch.toLowerCase()) {
      case 'executive':
        officials = await ExecutiveOfficial.find({ state: state._id });
        break;
      case 'legislative':
        officials = await LegislativeOfficial.find({ state: state._id });
        break;
      case 'judicial':
        officials = await JudicialOfficial.find({ state: state._id });
        break;
      case 'local':
        if (state.localOfficials && state.localOfficials.length > 0) {
          const { LocalOfficial } = await import('./local.js');
          officials = await LocalOfficial.find({ 
            _id: { $in: state.localOfficials }
          });
        }
        break;
    }
    
    res.status(200).json({
      success: true,
      count: officials.length,
      state: state.name,
      branch,
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get officials by branch and tenure
const state_officials_by_branch_and_tenure = asyncHandler(async(req, res) => {
  try {
    const { branch } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!branch || !['executive', 'legislative', 'judicial'].includes(branch.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid branch (executive, legislative, or judicial)'
      });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both startDate and endDate'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Find officials whose tenure overlaps with the given date range
    const tenureFilter = {
      $and: [
        { tenureStart: { $lte: end } },
        { 
          $or: [
            { tenureEnd: { $gte: start } },
            { tenureEnd: null } // For officials without end date (still in office)
          ]
        }
      ]
    };
    
    let officials;
    
    switch(branch.toLowerCase()) {
      case 'executive':
        officials = await ExecutiveOfficial.find(tenureFilter).populate('state', 'name');
        break;
      case 'legislative':
        officials = await LegislativeOfficial.find(tenureFilter).populate('state', 'name');
        break;
      case 'judicial':
        officials = await JudicialOfficial.find(tenureFilter).populate('state', 'name');
        break;
      default:
        officials = [];
    }
    
    res.status(200).json({
      success: true,
      count: officials.length,
      branch,
      dateRange: { startDate, endDate },
      data: officials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get officials by party affiliation
const state_officials_by_party = asyncHandler(async(req, res) => {
  try {
    const { party } = req.params;
    
    if (!party) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a party name'
      });
    }
    
    const partyRegex = { $regex: party, $options: 'i' };
    
    // Search in executive and legislative branches (judicial typically doesn't have party affiliations)
    const [executives, legislators] = await Promise.all([
      ExecutiveOfficial.find({ 
        'politicalParty.name': partyRegex 
      }).populate('state', 'name'),
      LegislativeOfficial.find({ 
        'politicalParty.name': partyRegex 
      }).populate('state', 'name')
    ]);
    
    // Also check governors and deputy governors
    const statesWithPartyOfficials = await State.find({
      $or: [
        { 'governor.politicalParty.name': partyRegex },
        { 'deputyGovernor.politicalParty.name': partyRegex }
      ]
    }).select('name governor deputyGovernor');
    
    const results = {
      executives,
      legislators,
      governors: statesWithPartyOfficials.map(state => ({
        stateName: state.name,
        governor: state.governor.politicalParty.some(p => 
          new RegExp(party, 'i').test(p.name)) ? state.governor : null,
        deputyGovernor: state.deputyGovernor && 
          state.deputyGovernor.politicalParty &&
          state.deputyGovernor.politicalParty.some(p => 
            new RegExp(party, 'i').test(p.name)) ? state.deputyGovernor : null
      })).filter(item => item.governor || item.deputyGovernor),
      totalCount: executives.length + legislators.length + statesWithPartyOfficials.length
    };
    
    res.status(200).json({
      success: true,
      party,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get state officials by position
const state_officials_by_position = asyncHandler(async(req, res) => {
  try {
    const { position } = req.params;
    
    if (!position) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a position'
      });
    }
    
    const positionRegex = { $regex: position, $options: 'i' };
    
    // Search across all branches
    const [executives, legislators, judges] = await Promise.all([
      ExecutiveOfficial.find({ position: positionRegex }).populate('state', 'name'),
      LegislativeOfficial.find({ position: positionRegex }).populate('state', 'name'),
      JudicialOfficial.find({ position: positionRegex }).populate('state', 'name')
    ]);
    
    // Check for governors if position is "Governor"
    let governors = [];
    if (/governor/i.test(position)) {
      const states = await State.find().select('name governor');
      governors = states.map(state => ({
        stateName: state.name,
        position: 'Governor',
        ...state.governor
      }));
    }
    
    // Check for deputy governors if position is "Deputy Governor"
    let deputyGovernors = [];
    if (/deputy\s+governor/i.test(position)) {
      const states = await State.find().select('name deputyGovernor');
      deputyGovernors = states
        .filter(state => state.deputyGovernor && state.deputyGovernor.name)
        .map(state => ({
          stateName: state.name,
          position: 'Deputy Governor',
          ...state.deputyGovernor
        }));
    }
    
    const results = {
      executives,
      legislators,
      judges,
      governors: position.toLowerCase() === 'governor' ? governors : [],
      deputyGovernors: position.toLowerCase() === 'deputy governor' ? deputyGovernors : [],
      totalCount: executives.length + legislators.length + judges.length + 
                 (position.toLowerCase() === 'governor' ? governors.length : 0) +
                 (position.toLowerCase() === 'deputy governor' ? deputyGovernors.length : 0)
    };
    
    res.status(200).json({
      success: true,
      position,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get state officials by filter (advanced filtering)
const state_officials_by_filter = asyncHandler(async(req, res) => {
  try {
    const { branch, state: stateName, position, ministry, party, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Create base query objects for each model
    let executiveQuery = {};
    let legislativeQuery = {};
    let judicialQuery = {};
    let stateQuery = {};
    
    // Apply state filter if provided
    if (stateName) {
      // Find the state ID first
      const state = await State.findOne({ 
        name: { $regex: new RegExp(`^${stateName}$`, 'i') }
      });
      
      if (state) {
        const stateId = state._id;
        executiveQuery.state = stateId;
        legislativeQuery.state = stateId;
        judicialQuery.state = stateId;
      } else {
        // If state doesn't exist, return empty results
        return res.status(200).json({
          success: true,
          count: 0,
          data: { executives: [], legislators: [], judges: [], governors: [] }
        });
      }
    }
    
    // Apply position filter if provided
    if (position) {
      const positionRegex = { $regex: position, $options: 'i' };
      executiveQuery.position = positionRegex;
      legislativeQuery.position = positionRegex;
      judicialQuery.position = positionRegex;
    }
    
    // Apply ministry filter for executive officials
    if (ministry) {
      executiveQuery.ministry = { $regex: ministry, $options: 'i' };
    }
    
    // Apply party filter
    if (party) {
      const partyFilter = { 'politicalParty.name': { $regex: party, $options: 'i' } };
      executiveQuery = { ...executiveQuery, ...partyFilter };
      legislativeQuery = { ...legislativeQuery, ...partyFilter };
      
      // For state query (governors/deputy governors)
      stateQuery = {
        $or: [
          { 'governor.politicalParty.name': { $regex: party, $options: 'i' } },
          { 'deputyGovernor.politicalParty.name': { $regex: party, $options: 'i' } }
        ]
      };
    }
    
    // Apply date range filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const tenureFilter = {
        $and: [
          { tenureStart: { $lte: end } },
          { 
            $or: [
              { tenureEnd: { $gte: start } },
              { tenureEnd: null }
            ]
          }
        ]
      };
      
      executiveQuery = { ...executiveQuery, ...tenureFilter };
      legislativeQuery = { ...legislativeQuery, ...tenureFilter };
      judicialQuery = { ...judicialQuery, ...tenureFilter };
      
      // For governors/deputy governors
      const governorTenureFilter = {
        $and: [
          { 'governor.tenureStart': { $lte: end } },
          {
            $or: [
              { 'governor.tenureEnd': { $gte: start } },
              { 'governor.tenureEnd': null }
            ]
          }
        ]
      };
      
      stateQuery = { ...stateQuery, ...governorTenureFilter };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pageOptions = {
      skip,
      limit: parseInt(limit)
    };
    
    // Execute queries based on branch filter
    let executives = [];
    let legislators = [];
    let judges = [];
    let governors = [];
    let totalCount = 0;
    
    // Determine which branches to query
    const shouldQueryExecutive = !branch || branch.toLowerCase() === 'executive';
    const shouldQueryLegislative = !branch || branch.toLowerCase() === 'legislative';
    const shouldQueryJudicial = !branch || branch.toLowerCase() === 'judicial';
    const shouldQueryGovernors = !branch || branch.toLowerCase() === 'executive';
    
    // Execute relevant queries in parallel
    const queryPromises = [];
    
    if (shouldQueryExecutive) {
      queryPromises.push(
        ExecutiveOfficial.find(executiveQuery)
          .populate('state', 'name')
          .sort({ tenureStart: -1 })
          .skip(pageOptions.skip)
          .limit(pageOptions.limit)
          .then(results => { executives = results; })
      );
      
      queryPromises.push(
        ExecutiveOfficial.countDocuments(executiveQuery)
          .then(count => { totalCount += count; })
      );
    }
    
    if (shouldQueryLegislative) {
      queryPromises.push(
        LegislativeOfficial.find(legislativeQuery)
          .populate('state', 'name')
          .sort({ tenureStart: -1 })
          .skip(pageOptions.skip)
          .limit(pageOptions.limit)
          .then(results => { legislators = results; })
      );
      
      queryPromises.push(
        LegislativeOfficial.countDocuments(legislativeQuery)
          .then(count => { totalCount += count; })
      );
    }
    
    if (shouldQueryJudicial) {
      queryPromises.push(
        JudicialOfficial.find(judicialQuery)
          .populate('state', 'name')
          .sort({ tenureStart: -1 })
          .skip(pageOptions.skip)
          .limit(pageOptions.limit)
          .then(results => { judges = results; })
      );
      
      queryPromises.push(
        JudicialOfficial.countDocuments(judicialQuery)
          .then(count => { totalCount += count; })
      );
    }
    
    if (shouldQueryGovernors && Object.keys(stateQuery).length > 0) {
      queryPromises.push(
        State.find(stateQuery)
          .select('name governor deputyGovernor')
          .sort({ 'governor.tenureStart': -1 })
          .skip(pageOptions.skip)
          .limit(pageOptions.limit)
          .then(results => {
            governors = results.map(state => ({
              stateName: state.name,
              governor: state.governor,
              deputyGovernor: state.deputyGovernor
            }));
          })
      );
      
      queryPromises.push(
        State.countDocuments(stateQuery)
          .then(count => { totalCount += count; })
      );
    }
    
    await Promise.all(queryPromises);
    
    // Prepare response
    const results = {
      executives: shouldQueryExecutive ? executives : [],
      legislators: shouldQueryLegislative ? legislators : [],
      judges: shouldQueryJudicial ? judges : [],
      governors: shouldQueryGovernors ? governors : [],
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    };
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export {
  state_official_by_name,
  state_officials_by_branch,
  state_officials_by_branch_and_tenure,
  state_officials_by_filter,
  state_officials_by_party,
  all_state_officials,
  all_states,
  state_officials_by_state_branch,
  state_officials_by_tenure,
  state_officials_by_position,
  state_officials_by_state
};
