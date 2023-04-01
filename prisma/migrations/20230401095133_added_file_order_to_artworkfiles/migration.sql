/*
  Warnings:

  - Added the required column `fileOrder` to the `ArtworkFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ArtworkFiles` ADD COLUMN `fileOrder` INTEGER NOT NULL;
