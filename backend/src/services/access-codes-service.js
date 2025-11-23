export function buildAccessCode({ schoolYear, sectionName, groupName }) {
  // e.g. schoolYear = "2024-2025"
  const [year1, year2] = schoolYear.split("-");
  const shortYear = year1.slice(2) + year2.slice(2);

  // sanitize group name
  const cleanGroup = groupName
    .replace(/\s+/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();

  return `${shortYear}-${sectionName}${cleanGroup}`;
}