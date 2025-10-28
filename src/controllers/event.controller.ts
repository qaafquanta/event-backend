import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET semua event (dengan pagination)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const events = await prisma.event.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.event.count();

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalData: total,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//getAll event for filter upcoming event

export const filterAllEvents = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      location = "",
      category = "",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      AND: [],
    };

    // SEARCH BY NAME OR DESCRIPTION
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { description: { contains: String(search), mode: "insensitive" } },
        ],
      });
    }

    // FILTER BY LOCATION
    if (location) {
      where.AND.push({
        location: { contains: String(location), mode: "insensitive" },
      });
    }

    // FILTER BY CATEGORY
    if (category) {
      where.AND.push({
        category: { contains: String(category), mode: "insensitive" },
      });
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.count({ where }),
    ]);

    return res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalData: total,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// GET detail event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id: String(id) } });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// CREATE event baru
export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      organizerId,
      name,
      description,
      category,
      location,
      city,
      address,
      startDate,
      endDate,
      price,
      availableSeats,
      totalSeats,
      imageUrl,
    } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        organizerId,
        name,
        description,
        category,
        location,
        city,
        address,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price,
        availableSeats,
        totalSeats,
        imageUrl,
      },
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// UPDATE event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, imageUrl } = req.body;

    const event = await prisma.event.update({
      where: { id: String(id) },
      data: { name, description, endDate: new Date(date), location, imageUrl },
    });

    res.json({ success: true, data: event });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// DELETE event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({ where: { id: String(id) } });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
