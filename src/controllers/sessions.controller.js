// Estructura inicial: la autenticación se implementa en la próxima entrega.
const notImplemented = (action) => (req, res) => {
  res.status(501).json({
    status: "error",
    message: `${action}: pendiente de implementación`,
  });
};

export const register = notImplemented("Registro");
export const login = notImplemented("Login");
export const current = notImplemented("Usuario actual");
export const logout = notImplemented("Logout");
