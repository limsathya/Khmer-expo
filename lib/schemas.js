/**
 * Centralized Data Models, Enums, and Entity Validation Schemas
 * Cambodia-China Expo Week 2026
 */

export const UserRole = {
  SUPER_ADMIN: 'super_admin',       // Central Executive Steering Committee
  COMMITTEE_LEAD: 'committee_lead', // Subcommittee Chair
  COMMITTEE_MEMBER: 'committee_member',
  EXHIBITOR_ADMIN: 'exhibitor_admin',
  DELEGATE: 'delegate',
  VISITOR: 'visitor',
};

export const EventCategory = {
  MILESTONE: 'milestone',
  BOOTH: 'booth',
  ACTIVITY: 'activity',
  PLENARY: 'plenary',
  BILATERAL_MEETING: 'bilateral_meeting',
  SIGNING_CEREMONY: 'signing_ceremony',
};

export const EventStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const RegistrationClassification = {
  VISITOR: 'Visitor',
  EXHIBITOR: 'Exhibitor',
  BUSINESS_BUYER: 'Business Buyer',
  EDUCATION: 'University / Education Institution',
  MEDIA: 'Media',
  VIP: 'VIP',
  OFFICIAL_GUEST: 'Official Guest',
};

export const RegistrationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHECKED_IN: 'checked_in',
};

export const BoothZone = {
  ZONE_A: 'Zone A - Main International Pavilion',
  ZONE_B: 'Zone B - B2B Technology & Trade',
  ZONE_C: 'Zone C - Education & Cultural Showcase',
  ZONE_D: 'Zone D - Gastronomy & Agribusiness',
};

/**
 * Validates registration input payload.
 * Returns { valid: boolean, errors: Record<string, string> }
 */
export function validateRegistrationPayload(data) {
  const errors = {};

  if (!data?.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.fullName = 'Full official name is required (minimum 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data?.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'A valid official email address is required for credential delivery.';
  }

  if (!data?.organization || data.organization.trim().length < 2) {
    errors.organization = 'Institution, enterprise, or delegation organization is required.';
  }

  const validClassifications = Object.values(RegistrationClassification);
  if (!data?.regType || !validClassifications.includes(data.regType)) {
    errors.regType = `Classification must be one of: ${validClassifications.join(', ')}`;
  }

  if (data?.regType === RegistrationClassification.EXHIBITOR) {
    if (!data?.companyName || data.companyName.trim().length < 2) {
      errors.companyName = 'Commercial enterprise name is required for exhibitors.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates event creation and modification payload.
 */
export function validateEventPayload(data) {
  const errors = {};

  if (!data?.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  }

  if (!data?.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Date must be formatted as YYYY-MM-DD.';
  }

  if (!data?.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.time = 'Time must be formatted as HH:mm.';
  }

  const validCategories = Object.values(EventCategory);
  if (!data?.category || !validCategories.includes(data.category)) {
    errors.category = `Category must be one of: ${validCategories.join(', ')}`;
  }

  if (!data?.organizer || data.organizer.trim().length < 2) {
    errors.organizer = 'Organizer name or organizing committee is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
