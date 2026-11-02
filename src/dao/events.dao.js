import Event from "../models/Event.js";

export default class EventsDAO {
  async getAll() {
    return await Event.find().lean();
  }
}
