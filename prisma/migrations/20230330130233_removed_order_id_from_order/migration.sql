/*
  Warnings:

  - You are about to drop the column `orderId` on the `Orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Orders_orderId_key` ON `Orders`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `orderId`;
