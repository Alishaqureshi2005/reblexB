const axios = require('axios');

const checkGroupMembership = async (req, res, next) => {
  try {
    const userId = req.user.robloxId;
    const groupId = '35126206';

    // Make request to Roblox API to check group membership
    const response = await axios.get(`https://groups.roblox.com/v2/users/${userId}/groups/roles`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if user is a member of the specified group
    const isMember = response.data.data.some(group => 
      group.group.id.toString() === groupId && 
      group.role.rank > 0 // Rank > 0 means they are a member
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You must join our Roblox group (ID: 35126206) before making a withdrawal'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking group membership:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying group membership'
    });
  }
};

module.exports = checkGroupMembership; 