import { dbModels } from "../models/index.js";

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

    return res.status(201).json({
      message: "Poop created successfully",
      poop: newPoop,
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
