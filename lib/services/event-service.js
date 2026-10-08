import { getAllEvents, getEventById, createEvent, updateEventStatus } from '../data';
import { EventStatus, validateEventPayload } from '../schemas';

/**
 * Event Domain Service
 * Encapsulates all event business rules, capacity validation, and scheduling logic.
 */
export class EventService {
  /**
   * Retrieves events matching structured criteria with optional pagination.
   */
  static async listEvents({ status, category, date, committee, search, page = 1, limit = 50 } = {}) {
    let events = await getAllEvents();

    if (status && status !== 'all') {
      events = events.filter((e) => e.status === status);
    }
    if (category && category !== 'all') {
      events = events.filter((e) => e.category === category);
    }
    if (date && date !== 'all') {
      events = events.filter((e) => e.date === date);
    }
    if (committee && committee !== 'all') {
      events = events.filter((e) => String(e.subCommittee || '').toLowerCase() === String(committee).toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      events = events.filter((e) => 
        e.title?.toLowerCase().includes(q) || 
        e.description?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q)
      );
    }

    const total = events.length;
    const startIndex = (page - 1) * limit;
    const paginated = events.slice(startIndex, startIndex + limit);

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

  /**
   * Submits a new event and enforces business validation.
   */
  static async submitEvent(payload, actor) {
    const validation = validateEventPayload(payload);
    if (!validation.valid) {
      const err = new Error('Invalid event payload');
      err.validationErrors = validation.errors;
      throw err;
    }

    const newEvent = await createEvent({
      ...payload,
      status: actor?.role === 'super_admin' ? EventStatus.APPROVED : EventStatus.PENDING,
      submittedBy: actor?.name || payload.organizer || 'System',
    });

    return newEvent;
  }

  /**
   * Approves or rejects an event with formal triage rationale.
   */
  static async reviewEvent(id, decision, reason, reviewer) {
    const event = await getEventById(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }

    const updated = await updateEventStatus(id, decision, reason);
    return updated;
  }
}
