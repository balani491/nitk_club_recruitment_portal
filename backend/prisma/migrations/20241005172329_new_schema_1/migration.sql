/*
  Warnings:

  - A unique constraint covering the columns `[convenorId]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Club_convenorId_key" ON "Club"("convenorId");
