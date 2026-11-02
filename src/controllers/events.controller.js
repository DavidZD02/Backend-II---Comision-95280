export const getEvents = (eventsService) => async (req, res) => {
  const events = await eventsService.getEvents();
  res.status(200).json({ status: "success", payload: events });
};
