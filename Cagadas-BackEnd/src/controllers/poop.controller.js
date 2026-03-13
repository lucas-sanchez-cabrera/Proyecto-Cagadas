import { dbModels } from "../models/index.js";

const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

export const createPoop = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await dbModels.Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Comprobar cooldown: última cagada del usuario hace menos de 10 min
    const lastPoop = await dbModels.Poops.findOne({ "user._id": userId })
      .sort({ date: -1 })
      .lean();

    if (lastPoop) {
      const lastDate = new Date(lastPoop.date).getTime();
      const elapsed = Date.now() - lastDate;
      if (elapsed < COOLDOWN_MS) {
        const cooldownEndsAt = new Date(lastDate + COOLDOWN_MS);
        return res.status(429).json({
          message: `Debes esperar ${COOLDOWN_MINUTES} minutos entre cagadas. Podrás registrar de nuevo a las ${cooldownEndsAt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}.`,
          cooldownEndsAt: cooldownEndsAt.toISOString(),
          remainingSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
        });
      }
    }

    console.log("User found:", user.firstName, user.lastName);

    // Create poop with unified user object
    const newPoop = new dbModels.Poops({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      date: new Date(),
    });

    await newPoop.save();

    console.log("Poop saved with user info:", JSON.stringify(newPoop, null, 2));

    const cooldownEndsAt = new Date(Date.now() + COOLDOWN_MS);

    return res.status(201).json({
      message: "Poop created successfully",
      poop: newPoop,
      cooldownEndsAt: cooldownEndsAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating poop:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllPoops = async (req, res) => {
  try {
    const poops = await dbModels.Poops.find().lean();

    return res.status(200).json({
      data: poops,
      message: poops.length === 0 ? "No poops found" : undefined,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getMyPoops = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    console.log("Buscando poops para el usuario:", userId);

    // Query by user._id
    const poops = await dbModels.Poops.find({ "user._id": userId }).lean();

    console.log("Poops encontrados:", poops.length);

    return res.status(200).json({
      data: poops,
      message: poops.length === 0 ? "No poops found for this user" : undefined,
    });
  } catch (err) {
    console.error("Error en getMyPoops:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getMonthAllPoops = async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Get first day of current month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get first day of next month (to use as upper bound)
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    console.log(
      "Buscando poops del mes:",
      firstDayOfMonth,
      "hasta",
      firstDayOfNextMonth
    );

    // Get all poops for the month (history)
    const history = await dbModels.Poops.find({
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      },
    }).lean();

    // Aggregate poops by user (stats)
    const stats = await dbModels.Poops.aggregate([
      {
        $match: {
          date: {
            $gte: firstDayOfMonth,
            $lt: firstDayOfNextMonth,
          },
        },
      },
      {
        $group: {
          _id: "$user._id",
          user: { $first: "$user" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log("Estadísticas del mes:", stats.length, "usuarios");
    console.log("Historial del mes:", history.length, "registros");

    return res.status(200).json({
      stats: stats,
      history: history,
      message: stats.length === 0 ? "No poops found for this month" : undefined,
    });
  } catch (err) {
    console.error("Error en getMonthAllPoops:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getWeekAllPoops = async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const currentDay = now.getDay();

    // Calculate the first day of the week (Monday)
    const firstDayOfWeek = new Date(now);
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days, otherwise go to Monday
    firstDayOfWeek.setDate(now.getDate() + diff);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // Calculate the first day of next week
    const firstDayOfNextWeek = new Date(firstDayOfWeek);
    firstDayOfNextWeek.setDate(firstDayOfWeek.getDate() + 7);

    console.log(
      "Buscando poops de la semana:",
      firstDayOfWeek,
      "hasta",
      firstDayOfNextWeek
    );

    // Get all poops for the week (history)
    const history = await dbModels.Poops.find({
      date: {
        $gte: firstDayOfWeek,
        $lt: firstDayOfNextWeek,
      },
    }).lean();

    // Aggregate poops by user (stats)
    const stats = await dbModels.Poops.aggregate([
      {
        $match: {
          date: {
            $gte: firstDayOfWeek,
            $lt: firstDayOfNextWeek,
          },
        },
      },
      {
        $group: {
          _id: "$user._id",
          user: { $first: "$user" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log("Estadísticas de la semana:", stats.length, "usuarios");
    console.log("Historial de la semana:", history.length, "registros");

    return res.status(200).json({
      stats: stats,
      history: history,
      message: stats.length === 0 ? "No poops found for this week" : undefined,
    });
  } catch (err) {
    console.error("Error en getWeekAllPoops:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getYearAllPoops = async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Get first day of current year
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    // Get first day of next year (to use as upper bound)
    const firstDayOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    console.log(
      "Buscando poops del año:",
      firstDayOfYear,
      "hasta",
      firstDayOfNextYear
    );

    // Get all poops for the year (history)
    const history = await dbModels.Poops.find({
      date: {
        $gte: firstDayOfYear,
        $lt: firstDayOfNextYear,
      },
    }).lean();

    // Aggregate poops by user (stats)
    const stats = await dbModels.Poops.aggregate([
      {
        $match: {
          date: {
            $gte: firstDayOfYear,
            $lt: firstDayOfNextYear,
          },
        },
      },
      {
        $group: {
          _id: "$user._id",
          user: { $first: "$user" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log("Estadísticas del año:", stats.length, "usuarios");
    console.log("Historial del año:", history.length, "registros");

    return res.status(200).json({
      stats: stats,
      history: history,
      message: stats.length === 0 ? "No poops found for this year" : undefined,
    });
  } catch (err) {
    console.error("Error en getYearAllPoops:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Obtiene la clasificación por puntos: 1 punto por ganar la semana, 0.5 por empate.
 * Se reinicia todos los lunes a las 00:00 (solo se cuentan puntos de la semana actual).
 */
export const getClassificationPoints = async (req, res) => {
  try {
    const now = new Date();
    // Inicio de la semana actual: lunes 00:00:00
    const currentDay = now.getDay(); // 0=Dom, 1=Lun, ...
    const toMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() + toMonday);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const allPoops = await dbModels.Poops.find({
      date: { $gte: startOfCurrentWeek },
    }).lean();

    // Agrupar por semana (lunes a domingo). key = fecha del lunes YYYY-MM-DD
    const getWeekKey = (date) => {
      const d = new Date(date);
      const day = d.getDay(); // 0=Dom, 1=Lun, ...
      const toMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + toMonday);
      monday.setHours(0, 0, 0, 0);
      return monday.toISOString().slice(0, 10); // "YYYY-MM-DD"
    };

    const poopsByWeek = {};
    for (const poop of allPoops) {
      const key = getWeekKey(poop.date);
      if (!poopsByWeek[key]) poopsByWeek[key] = [];
      poopsByWeek[key].push(poop);
    }

    const pointsByUser = new Map();

    for (const weekKey of Object.keys(poopsByWeek)) {
      const poops = poopsByWeek[weekKey];
      const countByUser = new Map();
      for (const p of poops) {
        const uid = p.user._id.toString();
        countByUser.set(uid, (countByUser.get(uid) || 0) + 1);
      }
      if (countByUser.size === 0) continue;
      const maxCount = Math.max(...countByUser.values());
      const winners = [...countByUser.entries()].filter(([, c]) => c === maxCount);
      const pointEach = winners.length > 1 ? 0.5 : 1;
      for (const [uid] of winners) {
        const userEntry = poops.find((p) => p.user._id.toString() === uid)?.user;
        if (!pointsByUser.has(uid)) {
          pointsByUser.set(uid, { user: userEntry, points: 0 });
        }
        pointsByUser.get(uid).points += pointEach;
      }
    }

    // Incluir todos los usuarios, aunque tengan 0 puntos
    const allUsers = await dbModels.Users.find()
      .select("_id firstName lastName")
      .lean();

    const classification = allUsers
      .map((u) => ({
        user: { _id: u._id, firstName: u.firstName, lastName: u.lastName },
        points: pointsByUser.has(u._id.toString())
          ? pointsByUser.get(u._id.toString()).points
          : 0,
      }))
      .sort((a, b) => b.points - a.points);

    return res.status(200).json({
      classification,
      message: classification.length === 0 ? "No hay clasificación aún" : undefined,
    });
  } catch (err) {
    console.error("Error en getClassificationPoints:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
