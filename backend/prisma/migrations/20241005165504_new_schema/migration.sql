/*
  Warnings:

  - You are about to drop the column `clubId` on the `RecruitmentRound` table. All the data in the column will be lost.
  - Added the required column `number` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcementId` to the `RecruitmentRound` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecruitmentRound" DROP CONSTRAINT "RecruitmentRound_clubId_fkey";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecruitmentRound" DROP COLUMN "clubId",
ADD COLUMN     "announcementId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_ClubToRecruitmentRound" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToRecruitmentRound_AB_unique" ON "_ClubToRecruitmentRound"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToRecruitmentRound_B_index" ON "_ClubToRecruitmentRound"("B");

-- AddForeignKey
ALTER TABLE "RecruitmentRound" ADD CONSTRAINT "RecruitmentRound_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToRecruitmentRound" ADD CONSTRAINT "_ClubToRecruitmentRound_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToRecruitmentRound" ADD CONSTRAINT "_ClubToRecruitmentRound_B_fkey" FOREIGN KEY ("B") REFERENCES "RecruitmentRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
