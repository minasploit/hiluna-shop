/*
  Warnings:

  - You are about to alter the column `imageUrl` on the `artwork` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `screenshotUrl` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Artwork` MODIFY `imageUrl` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `screenshotUrl` INTEGER NULL;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` ENUM('Image', 'Video', 'Unknown') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Artwork` ADD CONSTRAINT `Artwork_imageUrl_fkey` FOREIGN KEY (`imageUrl`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_screenshotUrl_fkey` FOREIGN KEY (`screenshotUrl`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
