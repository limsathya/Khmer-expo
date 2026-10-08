import crypto from 'crypto';
import { getRegistrations, createRegistration, updateRegistrationStatus, checkInRegistration } from '../db';
import { RegistrationClassification, RegistrationStatus, validateRegistrationPayload } from '../schemas';

/**
 * Registration Domain Service
 * Encapsulates attendee accreditation, pass token issuance, and turnstile check-in.
 */
export class RegistrationService {
  /**
   * Registers an attendee, validates payload, and generates secure credentials.
   */
  static async registerAttendee(payload) {
    const validation = validateRegistrationPayload(payload);
    if (!validation.valid) {
      const err = new Error('Invalid attendee registration payload');
      err.validationErrors = validation.errors;
      throw err;
    }

    // Generate unique verification code & digital QR pass token
    const regCode = `EXPO26-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const qrSecret = crypto
      .createHmac('sha256', process.env.AUTH_SECRET || 'expo_qr_secret_2026')
      .update(`${regCode}:${payload.email.toLowerCase()}`)
      .digest('hex');

    const isVipOrOfficial = 
      payload.regType === RegistrationClassification.VIP ||
      payload.regType === RegistrationClassification.OFFICIAL_GUEST;

    const initialStatus = isVipOrOfficial 
      ? RegistrationStatus.PENDING 
      : RegistrationStatus.APPROVED;

    const record = await createRegistration({
      ...payload,
      regCode,
      qrToken: qrSecret,
      status: initialStatus,
      submittedAt: new Date().toISOString(),
    });

    return {
      registration: record,
      regCode,
      qrToken: qrSecret,
    };
  }

  /**
   * Verifies attendee badge at entrance turnstile.
   */
  static async verifyTurnstileCheckIn(identifier) {
    if (!identifier) {
      throw new Error('QR token or registration code is required');
    }

    const checkinResult = await checkInRegistration(identifier);
    return checkinResult;
  }

  /**
   * Retrieves paginated registrations with filter support.
   */
  static async listRegistrations({ status, classification, search, page = 1, limit = 50 } = {}) {
    let list = await getRegistrations();

    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    if (classification && classification !== 'all') {
      list = list.filter((r) => r.regType === classification);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => 
        r.fullName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.organization?.toLowerCase().includes(q) ||
        r.regCode?.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
