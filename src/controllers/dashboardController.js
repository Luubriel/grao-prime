const dashboardService = require('../services/dashboardService');

async function show(req, res) {
  const data = await dashboardService.getSummary();

  return res.status(200).json({
    success: true,
    data,
  });
}

module.exports = {
  show,
};

