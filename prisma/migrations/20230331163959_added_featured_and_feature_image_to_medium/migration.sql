-- AlterTable
ALTER TABLE `Artworks` MODIFY `featured` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Medium` ADD COLUMN `featureImageId` INTEGER NULL,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Medium` ADD CONSTRAINT `Medium_featureImageId_fkey` FOREIGN KEY (`featureImageId`) REFERENCES `Files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
