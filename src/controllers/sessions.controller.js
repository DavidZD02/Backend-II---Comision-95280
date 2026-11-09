const notImplemented = (action) => (req, res) => {
  res.status(501).json({
    status: "error",
    message: `${action}: pendiente de implementación`,
  });
};

export const register = (sessionsService) => async (req, res) => {
  const user = await sessionsService.register(req.body);
  res.status(201).json({ status: "success", payload: user });
};

export const login = notImplemented("Login");
export const current = notImplemented("Usuario actual");
export const logout = notImplemented("Logout");