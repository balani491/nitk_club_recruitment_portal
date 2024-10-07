"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationStatus = exports.deRegisterFromRecruitment = exports.registerForRecruitment = exports.getAnnouncements = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAnnouncements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id; // Assuming the user ID is attached to the request object
    try {
        const announcements = yield prisma.announcement.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                rounds: true, // Include recruitment rounds associated with the announcement
                club: {
                    select: {
                        name: true, // Include the club name for each announcement
                    },
                },
                Registration: {
                    where: {
                        userId: userId, // Filter registrations by the logged-in user
                    },
                    select: {
                        id: true, // Select the ID if registration exists
                    },
                },
            },
        });
        // Structure the response to include registration status (true/false)
        const response = announcements.map((announcement) => ({
            id: announcement.id,
            content: announcement.content,
            number: announcement.number,
            createdAt: announcement.createdAt,
            club: announcement.club.name,
            rounds: announcement.rounds.map((round) => ({
                roundNumber: round.roundNumber,
                details: round.details,
            })),
            isRegistered: announcement.Registration.length > 0, // Check if user has registered
        }));
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});
exports.getAnnouncements = getAnnouncements;
const registerForRecruitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { announcementId } = req.body;
    //@ts-ignore
    const userId = req.id; // Assuming the user ID is attached to the request object
    try {
        // Check if the user is already registered for this announcement
        const existingRegistration = yield prisma.registration.findFirst({
            where: {
                userId: userId,
                announcementId: announcementId,
            },
        });
        if (existingRegistration) {
            return res.status(400).json({ message: 'User already registered for this announcement' });
        }
        // Fetch the clubId associated with the announcement
        const announcement = yield prisma.announcement.findUnique({
            where: {
                id: announcementId,
            },
            select: {
                clubId: true,
            },
        });
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        // Create a new registration with a default status of 'PENDING'
        const registration = yield prisma.registration.create({
            data: {
                userId: userId,
                announcementId: announcementId,
                status: 'PENDING',
                clubId: announcement.clubId, // Associate with the club
            },
        });
        // Fetch the recruitment rounds associated with this announcement
        const recruitmentRounds = yield prisma.recruitmentRound.findMany({
            where: {
                announcementId: announcementId,
            },
        });
        // Create round statuses for each recruitment round
        const roundStatuses = recruitmentRounds.map((round) => ({
            registrationId: registration.id,
            roundId: round.id,
            status: 'PENDING',
        }));
        // Insert round statuses in bulk
        yield prisma.roundStatus.createMany({
            data: roundStatuses,
        });
        return res.status(201).json({ message: 'User registered for recruitment and round statuses created successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to register for recruitment' });
    }
});
exports.registerForRecruitment = registerForRecruitment;
const deRegisterFromRecruitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { announcementId } = req.body;
    //@ts-ignore
    const userId = req.id; // Assuming the user ID is attached to the request object
    try {
        // Check if the user is registered for this announcement
        const existingRegistration = yield prisma.registration.findFirst({
            where: {
                userId: userId,
                announcementId: announcementId,
            },
        });
        if (!existingRegistration) {
            return res.status(400).json({ message: 'User is not registered for this announcement' });
        }
        // Delete round statuses associated with this registration
        yield prisma.roundStatus.deleteMany({
            where: {
                registrationId: existingRegistration.id,
            },
        });
        // Delete the registration
        yield prisma.registration.delete({
            where: {
                id: existingRegistration.id,
            },
        });
        return res.status(200).json({ message: 'User successfully deregistered from recruitment' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to deregister from recruitment' });
    }
});
exports.deRegisterFromRecruitment = deRegisterFromRecruitment;
const registrationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id; // Assuming user ID is attached to the request object
    try {
        const registrations = yield prisma.registration.findMany({
            where: {
                userId: userId
            },
            include: {
                roundStatuses: {
                    include: {
                        round: true // Include details about each recruitment round
                    }
                },
                announcement: {
                    include: {
                        club: {
                            select: {
                                name: true // Include club name
                            }
                        }
                    }
                }
            }
        });
        const response = registrations.map(reg => ({
            registrationId: reg.id,
            status: reg.status,
            clubName: reg.announcement.club.name,
            announcementContent: reg.announcement.content,
            rounds: reg.roundStatuses.map(roundStatus => ({
                roundNumber: roundStatus.round.roundNumber,
                roundDetails: roundStatus.round.details,
                roundStatus: roundStatus.status // Status of the round (e.g., 'PENDING', 'PASSED', etc.)
            }))
        }));
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch registration status' });
    }
});
exports.registrationStatus = registrationStatus;
