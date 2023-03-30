/*
  Warnings:

  - Added the required column `shortDescription` to the `Artworks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Artworks` ADD COLUMN `shortDescription` TEXT NOT NULL;
