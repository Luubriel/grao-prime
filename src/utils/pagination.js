function buildPagination({ page, limit, total }) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
  };
}

function getOffset(page, limit) {
  return (page - 1) * limit;
}

module.exports = {
  buildPagination,
  getOffset,
};

