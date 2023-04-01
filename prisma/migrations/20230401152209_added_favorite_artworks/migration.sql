-- CreateTable
CREATE TABLE `_FavoritedArtworks` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FavoritedArtworks_AB_unique`(`A`, `B`),
    INDEX `_FavoritedArtworks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FavoritedArtworks` ADD CONSTRAINT `_FavoritedArtworks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artworks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoritedArtworks` ADD CONSTRAINT `_FavoritedArtworks_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
