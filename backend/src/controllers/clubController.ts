import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerClub = async (req: Request, res: Response) => {
    const { name ,info} = req.body;
    //@ts-ignore
    const userId = req.id;
    try {
        const club = await prisma.club.create({
            data: {
                name,
                info,
                convenorId: userId,
            },
        });
        res.json(club);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register club' });
    }
};

export const addAnnouncementWithRounds = async (req: Request, res: Response) => {
    const { content, number, rounds } = req.body; // Announcement number, content, and rounds array
    //@ts-ignore
    const userId = req.id; // User ID from JWT


    try {
        // Fetch the club based on the convenor's user ID
        const club = await prisma.club.findFirst({
            where: { convenorId: userId },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        // Create the announcement first
        const announcement = await prisma.announcement.create({
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
                await prisma.recruitmentRound.create({
                    data: {
                        announcementId: announcement.id,
                        roundNumber: round.roundNumber,
                        details: round.details,
                    },
                });
            }
        }

        res.json({ message: 'Announcement and rounds added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add announcement and rounds' });
    }
};

export const getClubInfo=async(req:Request,res:Response)=>{
    //@ts-ignore
    const userId=req.id;
    try{
        const club=await prisma.club.findFirst({
            where:{
                convenorId:userId
            }
        });
        if(!club){
            return res.status(404).json({message:'Club not found for this convenor'});
        }
        res.json(club);
    }catch(error){
        return res.status(500).json({error:'Failed to fetch club info'});
    }
}

export const updateClubInfo=async(req:Request,res:Response)=>{
    const {name,info}=req.body;
    //@ts-ignore
    const userId=req.id;
    try{
        const club=await prisma.club.update({
            where:{
                convenorId:userId
            },
            data:{
                name,
                info
            }
        });
        res.json(club);
    }catch(error){
        res.status(500).json({error:'Failed to update club info'});
    }
}

export const getAnnouncements = async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.id;

    try {
        // Fetch the club based on the convenor's user ID
        const club = await prisma.club.findFirst({
            where: { convenorId: userId },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        // Fetch all announcements for the club
        const announcements = await prisma.announcement.findMany({
            where: { clubId: club.id },
            include: {
                rounds: true, // Include associated recruitment rounds for each announcement
            },
        });

        res.status(200).json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    const { announcementId, content, number, rounds } = req.body; // Extract details from the request body
    //@ts-ignore
    const userId = req.id;

    try {
        // Fetch the club based on the convenor's user ID
        const club = await prisma.club.findFirst({
            where: { convenorId: userId },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        // Check if the announcement belongs to the club
        const existingAnnouncement = await prisma.announcement.findFirst({
            where: { id: announcementId, clubId: club.id },
        });

        if (!existingAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found for this club' });
        }

        // Update the announcement
        const updatedAnnouncement = await prisma.announcement.update({
            where: { id: announcementId },
            data: {
                content,
                number, // Announcement number
            },
        });

        // Update the associated rounds if provided
        if (rounds && Array.isArray(rounds)) {
            for (const round of rounds) {
                await prisma.recruitmentRound.updateMany({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update announcement and rounds' });
    }
};


export const getRegistrations = async (req: Request, res: Response) => {
    //@ts-ignore    
    const userId = req.id; // Assuming the user ID is attached to the request object

    try {
        // Find the club for which the user is a convenor
        const findClubId = await prisma.club.findFirst({
            where: { convenorId: userId },
        });

        if (!findClubId) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        const clubId = findClubId.id;

        // Fetch registrations, including user data without the password and roundStatuses
        const registrations = await prisma.registration.findMany({
            where: {
                clubId,
            },
            include: {
                user: {
                    select: {
                        name:true,
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
};


export const updateRoundStatus = async (req: Request, res: Response) => {
    const { roundStatusId, status } = req.body;
    //@ts-ignore
    const userId = req.id;

    try {
        // Check if the user is a convenor
        const club = await prisma.club.findFirst({
            where: { convenorId: userId },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        // Find the round status by ID
        const findRound = await prisma.roundStatus.findFirst({
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
        const totalRounds = await prisma.recruitmentRound.count({
            where: {
                announcementId: findRound.round.announcementId,
            },
        });

        if (findRound.round.roundNumber === totalRounds && status === 'ACCEPTED') {
            // If this is the last round and the status is "ACCEPTED", update the registration status as well
            await prisma.registration.update({
                where: { id: findRound.registrationId },
                data: { status: 'ACCEPTED' },
            });
        }

        // Update the round status
        const updatedRoundStatus = await prisma.roundStatus.update({
            where: {
                id: roundStatusId,
            },
            data: {
                status,
            },
        });

        res.json(updatedRoundStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update round status' });
    }
};


export const exportPdf = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.id;

        // Fetch the club based on the convenor ID
        const club = await prisma.club.findFirst({
            where: {
                convenorId: userId,
            },
        });

        if (!club) {
            return res.status(404).json({ message: 'Club not found for this convenor' });
        }

        // Fetch all accepted registrations for this club
        const getAccepted = await prisma.registration.findMany({
            where: {
                clubId: club.id,
                status: 'ACCEPTED',
            },
            include: {
                user: {
                    select: {
                        name:true,
                        email: true,  // Optionally exclude any sensitive information
                        role: true    // Fetch role, or any other available field
                    },
                },
            },
        });

        // Initialize a new PDF document
        const doc = new PDFDocument();

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};
