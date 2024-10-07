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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPdf = exports.updateRoundStatus = exports.getRegistrations = exports.updateAnnouncement = exports.getAnnouncements = exports.updateClubInfo = exports.getClubInfo = exports.addAnnouncementWithRounds = exports.registerClub = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registerClub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, info } = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        const club = yield prisma.club.create({
            data: {
                name,
                info,
                convenorId: userId,
            },
        });
        res.json(club);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to register club' });
    }
});
exports.registerClub = registerClub;
const addAnnouncementWithRounds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, number, rounds } = req.body; // Announcement number, content, and rounds array
    //@ts-ignore
    const userId = req.id; // User ID from JWT
    try {
        // Fetch the club based on the convenor's user ID
        const club = yield prisma.club.findFirst({
            where: { convenorId: userId },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        // Create the announcement first
        const announcement = yield prisma.announcement.create({
            data: {
                clubId: club.id,
                content,
                // @ts-ignore
                number, // Announcement number
            },
        });
        // Add recruitment rounds associated with this announcement
        if (rounds && Array.isArray(rounds)) {
            for (const round of rounds) {
                yield prisma.recruitmentRound.create({
                    data: {
                        announcementId: announcement.id,
                        roundNumber: round.roundNumber,
                        details: round.details,
                    },
                });
            }
        }
        res.json({ message: 'Announcement and rounds added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add announcement and rounds' });
    }
});
exports.addAnnouncementWithRounds = addAnnouncementWithRounds;
const getClubInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    try {
        const club = yield prisma.club.findFirst({
            where: {
                convenorId: userId
            }
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        res.json(club);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch club info' });
    }
});
exports.getClubInfo = getClubInfo;
const updateClubInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, info } = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        const club = yield prisma.club.update({
            where: {
                convenorId: userId
            },
            data: {
                name,
                info
            }
        });
        res.json(club);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update club info' });
    }
});
exports.updateClubInfo = updateClubInfo;
const getAnnouncements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    try {
        // Fetch the club based on the convenor's user ID
        const club = yield prisma.club.findFirst({
            where: { convenorId: userId },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        // Fetch all announcements for the club
        const announcements = yield prisma.announcement.findMany({
            where: { clubId: club.id },
            include: {
                rounds: true, // Include associated recruitment rounds for each announcement
            },
        });
        res.status(200).json(announcements);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});
exports.getAnnouncements = getAnnouncements;
const updateAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { announcementId, content, number, rounds } = req.body; // Extract details from the request body
    //@ts-ignore
    const userId = req.id;
    try {
        // Fetch the club based on the convenor's user ID
        const club = yield prisma.club.findFirst({
            where: { convenorId: userId },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        // Check if the announcement belongs to the club
        const existingAnnouncement = yield prisma.announcement.findFirst({
            where: { id: announcementId, clubId: club.id },
        });
        if (!existingAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found for this club' });
        }
        // Update the announcement
        const updatedAnnouncement = yield prisma.announcement.update({
            where: { id: announcementId },
            data: {
                content,
                number, // Announcement number
            },
        });
        // Update the associated rounds if provided
        if (rounds && Array.isArray(rounds)) {
            for (const round of rounds) {
                yield prisma.recruitmentRound.updateMany({
                    where: {
                        announcementId: updatedAnnouncement.id,
                        roundNumber: round.roundNumber, // Match the round by roundNumber
                    },
                    data: {
                        details: round.details,
                    },
                });
            }
        }
        res.json({ message: 'Announcement and rounds updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update announcement and rounds' });
    }
});
exports.updateAnnouncement = updateAnnouncement;
const getRegistrations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore    
    const userId = req.id; // Assuming the user ID is attached to the request object
    try {
        // Find the club for which the user is a convenor
        const findClubId = yield prisma.club.findFirst({
            where: { convenorId: userId },
        });
        if (!findClubId) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        const clubId = findClubId.id;
        // Fetch registrations, including user data without the password and roundStatuses
        const registrations = yield prisma.registration.findMany({
            where: {
                clubId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        role: true,
                        // Explicitly exclude password by not selecting it
                    },
                },
                roundStatuses: true,
            },
        });
        res.json(registrations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});
exports.getRegistrations = getRegistrations;
const updateRoundStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roundStatusId, status } = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        // Check if the user is a convenor
        const club = yield prisma.club.findFirst({
            where: { convenorId: userId },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        // Find the round status by ID
        const findRound = yield prisma.roundStatus.findFirst({
            where: { id: roundStatusId },
            include: {
                round: {
                    include: {
                        announcement: true, // To get the announcement and club info
                    },
                },
                registration: true, // To access associated registration
            },
        });
        if (!findRound) {
            return res.status(404).json({ message: 'Round status not found' });
        }
        // Check if this is the last round
        const totalRounds = yield prisma.recruitmentRound.count({
            where: {
                announcementId: findRound.round.announcementId,
            },
        });
        if (findRound.round.roundNumber === totalRounds && status === 'ACCEPTED') {
            // If this is the last round and the status is "ACCEPTED", update the registration status as well
            yield prisma.registration.update({
                where: { id: findRound.registrationId },
                data: { status: 'ACCEPTED' },
            });
        }
        // Update the round status
        const updatedRoundStatus = yield prisma.roundStatus.update({
            where: {
                id: roundStatusId,
            },
            data: {
                status,
            },
        });
        res.json(updatedRoundStatus);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update round status' });
    }
});
exports.updateRoundStatus = updateRoundStatus;
const exportPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.id;
        // Fetch the club based on the convenor ID
        const club = yield prisma.club.findFirst({
            where: {
                convenorId: userId,
            },
        });
        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }
        // Fetch all accepted registrations for this club
        const getAccepted = yield prisma.registration.findMany({
            where: {
                clubId: club.id,
                status: 'ACCEPTED',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true, // Optionally exclude any sensitive information
                        role: true // Fetch role, or any other available field
                    },
                },
            },
        });
        // Initialize a new PDF document
        const doc = new pdfkit_1.default();
        // Set the headers to send a PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=final_selection_${club.name}.pdf`);
        // Pipe the PDF into the response
        doc.pipe(res);
        // Add a title and other details to the PDF
        doc.fontSize(18).text(`Final Selected Candidates for Club: ${club.name}`, { align: 'center' });
        doc.moveDown();
        // Add each accepted candidate to the PDF
        getAccepted.forEach((registration, index) => {
            doc.fontSize(12).text(`${index + 1}. Name: ${registration.user.name}, Email: ${registration.user.email}, Role: ${registration.user.role}`);
            doc.moveDown();
        });
        // Finalize the PDF and send the response
        doc.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});
exports.exportPdf = exportPdf;
