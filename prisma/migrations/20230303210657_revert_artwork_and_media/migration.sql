/*
  Warnings:

  - You are about to drop the `_artworkandmedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artwork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_artworkandmedia` DROP FOREIGN KEY `_ArtworkAndMedia_A_fkey`;

-- DropForeignKey
ALTER TABLE `_artworkandmedia` DROP FOREIGN KEY `_ArtworkAndMedia_B_fkey`;

-- DropTable
DROP TABLE `_artworkandmedia`;

-- DropTable
DROP TABLE `artwork`;

-- DropTable
DROP TABLE `media`;
