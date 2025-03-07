import { 
  FederalExecutiveOfficial, 
  FederalLegislativeOfficial, 
  FederalJudicialOfficial,
  FederalGovernment 
} from '../models/federalModel.js';
import asyncHandler from 'express-async-handler';

/**
 * Get all federal officials across all branches
 * @route GET /api/federal
 * @access Public
 */
const all_federal_officials = asyncHandler(async(req, res) => {
  try {
    // Fetch officials from all three branches
    const executiveOfficials = await FederalExecutiveOfficial.find();
    const legislativeOfficials = await FederalLegislativeOfficial.find();
    const judicialOfficials = await FederalJudicialOfficial.find();
    
    // Combine results
    const allOfficials = {
      executive: executiveOfficials,
      legislative: legislativeOfficials,
      judicial: judicialOfficials,
      totalCount: executiveOfficials.length + legislativeOfficials.length + judicialOfficials.length
    };
    
    res.status(200).json(allOfficials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get federal official by name
 * @route GET /api/federal/name/:name
 * @access Public
 */
const federal_official_by_name = asyncHandler(async(req, res) => {
  try {
    const { name } = req.params;
    const nameRegex = new RegExp(name, 'i'); // Case insensitive search
    
    // Search in all three branches
    const executiveOfficials = await FederalExecutiveOfficial.find({ name: nameRegex });
    const legislativeOfficials = await FederalLegislativeOfficial.find({ name: nameRegex });
    const judicialOfficials = await FederalJudicialOfficial.find({ name: nameRegex });
    
    // Combine results
    const matchingOfficials = {
      executive: executiveOfficials,
      legislative: legislativeOfficials,
      judicial: judicialOfficials,
      totalFound: executiveOfficials.length + legislativeOfficials.length + judicialOfficials.length
    };
    
    if (matchingOfficials.totalFound === 0) {
      return res.status(404).json({ message: `No federal official found with name containing "${name}"` });
    }
    
    res.status(200).json(matchingOfficials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get federal officials by branch (executive, legislative, judicial)
 * @route GET /api/federal/branch/:branch
 * @access Public
 */
const federal_officials_by_branch = asyncHandler(async(req, res) => {
  try {
    const { branch } = req.params;
    
    // Validate branch parameter
    if (!['executive', 'legislative', 'judicial'].includes(branch.toLowerCase())) {
      return res.status(400).json({ message: 'Branch must be one of: executive, legislative, judicial' });
    }
    
    let officials;
    
    // Query the appropriate model based on branch
    switch (branch.toLowerCase()) {
      case 'executive':
        officials = await FederalExecutiveOfficial.find();
        break;
      case 'legislative':
        officials = await FederalLegislativeOfficial.find();
        break;
      case 'judicial':
        officials = await FederalJudicialOfficial.find();
        break;
    }
    
    res.status(200).json({
      branch: branch.toLowerCase(),
      officials,
      count: officials.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get federal officials by branch and tenure period
 * @route GET /api/federal/branch/:branch/tenure/:startYear/:endYear?
 * @access Public
 */
const federal_officials_by_branch_and_tenure = asyncHandler(async(req, res) => {
  try {
    const { branch, startYear, endYear = new Date().getFullYear() } = req.params;
    
    // Validate branch parameter
    if (!['executive', 'legislative', 'judicial'].includes(branch.toLowerCase())) {
      return res.status(400).json({ message: 'Branch must be one of: executive, legislative, judicial' });
    }
    
    // Convert years to dates for querying
    const startDate = new Date(`${startYear}-01-01`);
    const endDate = new Date(`${endYear}-12-31`);
    
    let officials;
    
    // Query for officials who served during the specified period
    const query = {
      tenureStart: { $lte: endDate },
      $or: [
        { tenureEnd: { $gte: startDate } },
        { tenureEnd: null } // Still in office
      ]
    };
    
    // Query the appropriate model based on branch
    switch (branch.toLowerCase()) {
      case 'executive':
        officials = await FederalExecutiveOfficial.find(query);
        break;
      case 'legislative':
        officials = await FederalLegislativeOfficial.find(query);
        break;
      case 'judicial':
        officials = await FederalJudicialOfficial.find(query);
        break;
    }
    
    res.status(200).json({
      branch: branch.toLowerCase(),
      tenurePeriod: `${startYear} to ${endYear}`,
      officials,
      count: officials.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all federal officials by tenure period
 * @route GET /api/federal/tenure/:startYear/:endYear?
 * @access Public
 */
const federal_officials_by_tenure = asyncHandler(async(req, res) => {
  try {
    const { startYear, endYear = new Date().getFullYear() } = req.params;
    
    // Convert years to dates for querying
    const startDate = new Date(`${startYear}-01-01`);
    const endDate = new Date(`${endYear}-12-31`);
    
    // Query for officials who served during the specified period
    const query = {
      tenureStart: { $lte: endDate },
      $or: [
        { tenureEnd: { $gte: startDate } },
        { tenureEnd: null } // Still in office
      ]
    };
    
    // Fetch officials from all three branches
    const executiveOfficials = await FederalExecutiveOfficial.find(query);
    const legislativeOfficials = await FederalLegislativeOfficial.find(query);
    const judicialOfficials = await FederalJudicialOfficial.find(query);
    
    // Combine results
    const officials = {
      tenurePeriod: `${startYear} to ${endYear}`,
      executive: executiveOfficials,
      legislative: legislativeOfficials,
      judicial: judicialOfficials,
      totalCount: executiveOfficials.length + legislativeOfficials.length + judicialOfficials.length
    };
    
    res.status(200).json(officials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get federal officials by state and branch
 * @route GET /api/federal/state/:state/branch/:branch
 * @access Public
 */
const federal_officials_by_state_and_branch = asyncHandler(async(req, res) => {
  try {
    const { state, branch } = req.params;
    
    // Validate branch parameter
    if (!['executive', 'legislative', 'judicial'].includes(branch.toLowerCase())) {
      return res.status(400).json({ message: 'Branch must be one of: executive, legislative, judicial' });
    }
    
    let officials;
    
    // For legislative officials, we can filter by state directly
    if (branch.toLowerCase() === 'legislative') {
      officials = await FederalLegislativeOfficial.find({ state: state });
    } 
    // For executive and judicial, we'll need to check previous positions or other fields
    // This is a simplification and may need to be adjusted based on your data structure
    else if (branch.toLowerCase() === 'executive') {
      officials = await FederalExecutiveOfficial.find({
        $or: [
          { 'previousPositions.organization': new RegExp(state, 'i') },
          { 'education.institution': new RegExp(state, 'i') }
        ]
      });
    } else {
      officials = await FederalJudicialOfficial.find({
        $or: [
          { 'previousPositions.organization': new RegExp(state, 'i') },
          { 'education.institution': new RegExp(state, 'i') }
        ]
      });
    }
    
    res.status(200).json({
      state,
      branch: branch.toLowerCase(),
      officials,
      count: officials.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get federal officials by political party
 * @route GET /api/federal/party/:partyName
 * @access Public
 */
const federal_officials_by_party = asyncHandler(async(req, res) => {
  try {
    const { partyName } = req.params;
    const partyRegex = new RegExp(partyName, 'i'); // Case insensitive search
    
    // Query officials from all branches with the specified party in their political affiliations
    const executiveOfficials = await FederalExecutiveOfficial.find({
      'politicalParty.name': partyRegex
    });
    
    const legislativeOfficials = await FederalLegislativeOfficial.find({
      'politicalParty.name': partyRegex
    });
    
    // Note: Judicial officials typically don't have political party affiliations,
    // but including them here for completeness
    const judicialOfficials = await FederalJudicialOfficial.find({
      'politicalParty.name': partyRegex
    });
    
    // Combine results
    const partyOfficials = {
      party: partyName,
      executive: executiveOfficials,
      legislative: legislativeOfficials,
      judicial: judicialOfficials,
      totalCount: executiveOfficials.length + legislativeOfficials.length + judicialOfficials.length
    };
    
    if (partyOfficials.totalCount === 0) {
      return res.status(404).json({ message: `No federal officials found with party affiliation containing "${partyName}"` });
    }
    
    res.status(200).json(partyOfficials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  all_federal_officials,
  federal_official_by_name,
  federal_officials_by_branch,
  federal_officials_by_branch_and_tenure,
  federal_officials_by_tenure,
  federal_officials_by_state_and_branch,
  federal_officials_by_party
};
