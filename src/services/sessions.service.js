import UserDTO from "../dto/user.dto.js";
import AppError from "../utils/appError.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export default class SessionsService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async register({ first_name, last_name, email, password }) {
    AppError.assert(
      first_name && last_name && email && password,
      "Faltan campos obligatorios",
      400,
    );
    AppError.assert(
      [first_name, last_name, email, password].every(
        (field) => typeof field === "string",
      ),
      "Los campos deben ser de tipo string",
      400,
    );
    email = email.trim().toLowerCase();
    AppError.assert(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      "Formato de email inválido",
      400,
    );
    AppError.assert(
      password.length >= 6,
      "La contraseña debe tener al menos 6 caracteres",
      400,
    );
    const existingUser = await this.usersRepository.getByEmail(email);
    AppError.assert(!existingUser, "El email ya está registrado", 409);
    const hashedPassword = await createHash(password);
    const newUser = await this.usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    return new UserDTO(newUser);
  }

  async login({ email, password }) {
    AppError.assert(email && password, "Faltan campos obligatorios", 400);
    AppError.assert(
      [email, password].every((field) => typeof field === "string"),
      "Los campos deben ser de tipo string",
      400,
    );
    email = email.trim().toLowerCase();
    AppError.assert(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      "Formato de email inválido",
      400,
    );
    const existingUser = await this.usersRepository.getByEmail(email);
    AppError.assert(existingUser, "Credenciales inválidas", 401);
    const isPasswordValid = await isValidPassword(password, existingUser.password);
    AppError.assert(isPasswordValid, "Credenciales inválidas", 401);
    const token = generateToken({ id: existingUser._id, email: existingUser.email, role: existingUser.role });
    return { token, user: new UserDTO(existingUser) };
  }
}
