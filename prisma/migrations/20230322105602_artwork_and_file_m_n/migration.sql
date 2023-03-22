/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `artworks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Artworks` DROP FOREIGN KEY `Artworks_imageUrl_fkey`;

-- AlterTable
ALTER TABLE `Artworks` DROP COLUMN `imageUrl`;

-- CreateTable
CREATE TABLE `_ArtworksAndFiles` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ArtworksAndFiles_AB_unique`(`A`, `B`),
    INDEX `_ArtworksAndFiles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ArtworksAndFiles` ADD CONSTRAINT `_ArtworksAndFiles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artworks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArtworksAndFiles` ADD CONSTRAINT `_ArtworksAndFiles_B_fkey` FOREIGN KEY (`B`) REFERENCES `Files`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
