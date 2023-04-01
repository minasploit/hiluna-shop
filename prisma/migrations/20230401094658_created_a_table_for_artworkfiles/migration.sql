/*
  Warnings:

  - You are about to drop the `_ArtworksAndFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ArtworksAndFiles` DROP FOREIGN KEY `_ArtworksAndFiles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ArtworksAndFiles` DROP FOREIGN KEY `_ArtworksAndFiles_B_fkey`;

-- DropTable
DROP TABLE `_ArtworksAndFiles`;

-- CreateTable
CREATE TABLE `ArtworkFiles` (
    `artworkId` INTEGER NOT NULL,
    `fileId` INTEGER NOT NULL,

    PRIMARY KEY (`artworkId`, `fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArtworkFiles` ADD CONSTRAINT `ArtworkFiles_artworkId_fkey` FOREIGN KEY (`artworkId`) REFERENCES `Artworks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkFiles` ADD CONSTRAINT `ArtworkFiles_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
