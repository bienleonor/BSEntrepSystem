import { getUnitById, getUnitsByIds } from "../models/inventory/unit-model.js";

/**
 * Convert `amount` from fromUnitId -> toUnitId
 * Throws if dimensions don't match.
 */
export async function convertAmount(amount, fromUnitId, toUnitId) {
  if (fromUnitId === toUnitId) return Number(amount);

  const units = await getUnitsByIds([fromUnitId, toUnitId]);
  const from = units[fromUnitId];
  const to = units[toUnitId];

  if (!from || !to) throw new Error("Unit not found for conversion");

  // Ensure same base (e.g., both base_unit = 'ml' or both = 'g')
  if (String(from.base_unit) !== String(to.base_unit)) {
    throw new Error(`Incompatible unit dimensions: ${from.base_unit} vs ${to.base_unit}`);
  }

  const amt = Number(amount);
  if (isNaN(amt)) throw new Error("Invalid amount for conversion");

  // conversion_factor = how many base units = 1 unit
  // Example: teaspoon conversion_factor = 5 (1 tsp = 5 ml), ml conversion_factor = 1
  // To convert amount in "from" to "to":
  // amount_in_base = amount * from.conversion_factor
  // amount_in_to = amount_in_base / to.conversion_factor
  const amountInBase = amt * Number(from.conversion_factor);
  const amountInTo = amountInBase / Number(to.conversion_factor);
  return amountInTo;
}
