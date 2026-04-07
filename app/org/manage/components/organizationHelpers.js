export const DEFAULT_FILTERS = {
  search: "",
  category: "",
  verified: "",
  isBlocked: "",
  riskLevel: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const CATEGORY_OPTIONS = [
  "startup",
  "government",
  "nonprofit",
  "ngo",
  "college",
  "corporate",
  "educational",
];

export function getInitialFilters(searchParams) {
  return {
    search: searchParams.get("search") || DEFAULT_FILTERS.search,
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    verified: searchParams.get("verified") || DEFAULT_FILTERS.verified,
    isBlocked: searchParams.get("isBlocked") || DEFAULT_FILTERS.isBlocked,
    riskLevel: searchParams.get("riskLevel") || DEFAULT_FILTERS.riskLevel,
    sortBy: searchParams.get("sortBy") || DEFAULT_FILTERS.sortBy,
    sortOrder: searchParams.get("sortOrder") || DEFAULT_FILTERS.sortOrder,
    page: Number(searchParams.get("page") || DEFAULT_FILTERS.page),
    limit: Number(searchParams.get("limit") || DEFAULT_FILTERS.limit),
  };
}

export function buildQueryString(filters) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
}

export function normalizeOrganizationsResponse(payload) {
  const organizations = Array.isArray(payload?.docs)
    ? payload.docs
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const rawPagination = payload?.pagination || {};

  const page = Number(payload?.page || rawPagination.page || 1);
  const limit = Number(payload?.limit || rawPagination.limit || 10);
  const totalDocs = Number(
    payload?.totalDocs ||
      rawPagination.total ||
      rawPagination.totalItems ||
      organizations.length ||
      0,
  );
  const totalPages = Number(
    payload?.totalPages ||
      rawPagination.totalPages ||
      Math.max(1, Math.ceil(totalDocs / limit)),
  );

  const hasPrevPage =
    typeof payload?.hasPrevPage === "boolean"
      ? payload.hasPrevPage
      : typeof rawPagination.hasPrevPage === "boolean"
        ? rawPagination.hasPrevPage
        : page > 1;

  const hasNextPage =
    typeof payload?.hasNextPage === "boolean"
      ? payload.hasNextPage
      : typeof rawPagination.hasNextPage === "boolean"
        ? rawPagination.hasNextPage
        : page < totalPages;

  const prevPageSource =
    payload?.prevPage ??
    rawPagination.prevPage ??
    (hasPrevPage ? page - 1 : null);
  const nextPageSource =
    payload?.nextPage ??
    rawPagination.nextPage ??
    (hasNextPage ? page + 1 : null);

  return {
    organizations,
    pagination: {
      page,
      limit,
      totalDocs,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: prevPageSource === null ? null : Number(prevPageSource),
      nextPage: nextPageSource === null ? null : Number(nextPageSource),
    },
  };
}

export function computeSummary(organizations) {
  return organizations.reduce(
    (acc, org) => {
      if (org?.verified) acc.verified += 1;
      if (org?.isBlocked) acc.blocked += 1;
      acc.events += Number(org?.stats?.totalEventsHosted || 0);
      acc.avgTrust += Number(org?.trustScore || 0);
      return acc;
    },
    { verified: 0, blocked: 0, events: 0, avgTrust: 0 },
  );
}

export function getSafeOrgId(org) {
  return org?._id || org?.id;
}
