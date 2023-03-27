/*
  Warnings:

  - You are about to drop the column `screenshotUrl` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_screenshotUrl_fkey`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `screenshotUrl`,
    ADD COLUMN `screenshotId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_screenshotId_fkey` FOREIGN KEY (`screenshotId`) REFERENCES `Files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
