/*
  Warnings:

  - Added the required column `featureOrder` to the `Medium` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Medium` ADD COLUMN `featureOrder` INTEGER NOT NULL;
