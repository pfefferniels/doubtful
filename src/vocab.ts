/**
 * CIDOC-CRM extension CRMinf vocabulary for modeling arguments and beliefs
 * @see http://www.cidoc-crm.org/extensions/crminf/
 */
export const crminf = {
  Argumentation: 'http://www.cidoc-crm.org/extensions/crminf/I1_Argumentation',
  Belief: 'http://www.cidoc-crm.org/extensions/crminf/I2_Belief',
  concludedThat: 'http://www.cidoc-crm.org/extensions/crminf/J2_concluded_that',
  holdsToBe: 'http://www.cidoc-crm.org/extensions/crminf/J5_holds_to_be',
  that: 'http://www.cidoc-crm.org/extensions/crminf/J4_that',
} as const;

/**
 * Core CIDOC-CRM vocabulary
 * @see http://www.cidoc-crm.org/cidoc-crm/
 */
export const crm = {
  hasNote: 'http://www.cidoc-crm.org/cidoc-crm/P3_has_note',
  hasTimeSpan: 'http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span',
  carriedOutBy: 'http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by',
} as const;