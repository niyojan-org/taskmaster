export const toDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

export const maskAccountNumber = (value) => {
  const raw = String(value || "");
  if (raw.length <= 4) {
    return raw;
  }
  const lastFour = raw.slice(-4);
  return `**** **** ${lastFour}`;
};

export const formatNumber = (value) => {
  const parsed = Number(value || 0);
  if (Number.isNaN(parsed)) {
    return "0";
  }
  return parsed.toLocaleString();
};

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

export const completionPercent = (stepsCompleted = {}) => {
  const values = Object.values(stepsCompleted);
  if (!values.length) {
    return 0;
  }

  const done = values.filter(Boolean).length;
  return Math.round((done / values.length) * 100);
};
