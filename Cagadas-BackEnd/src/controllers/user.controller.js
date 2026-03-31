import { dbModels } from "../models/index.js";
import bcrypt from "bcryptjs";

const User = dbModels.Users;
const SALT_ROUNDS = 10;

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son requeridos: firstName, lastName, email, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Validar formato de email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Por favor ingrese un email válido",
      });
    }

    // Verificar si el usuario ya existe
    const existUser = await User.findOne({ email: email.toLowerCase() });
    if (existUser) {
      return res.status(409).json({
        message: `El usuario con el email ${email} ya existe`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    };

    const user = new User(newUser);
    await user.save();

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(201).json({
      message: `El usuario con el email ${email} se ha creado correctamente.`,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    return res.status(200).json({
      data: users,
      message: users.length === 0 ? "No users found" : undefined,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${id} not found`,
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      user.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return res.status(200).json({
      message: `User with ID ${id} updated successfully`,
      user: userResponse,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Validar contraseña con hash seguro
    let isValidPassword = await bcrypt.compare(password, user.password);

    // Compatibilidad temporal: migra contraseñas antiguas en texto plano al nuevo hash
    if (!isValidPassword && user.password === password) {
      user.password = await bcrypt.hash(password, SALT_ROUNDS);
      await user.save();
      isValidPassword = true;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Respuesta exitosa sin incluir la contraseña
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login exitoso",
      user: userResponse,
      token: user._id.toString(), // Token simple (más adelante puedes usar JWT)
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//PONER EL GET INFO USER PARA MAS ADELANTE VERIFICAR EL TOKEN Y OBTENER SUS DATOS USUARIO
