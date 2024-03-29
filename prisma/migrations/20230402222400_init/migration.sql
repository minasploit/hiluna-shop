-- CreateTable
CREATE TABLE `Artworks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dimension` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `availableForSale` BOOLEAN NOT NULL,
    `price` INTEGER NOT NULL,
    `currency` ENUM('ETB', 'USD') NOT NULL DEFAULT 'ETB',
    `rating` DOUBLE NOT NULL DEFAULT 2.5,
    `orientation` ENUM('Portrait', 'Landscape') NULL,
    `collectionId` INTEGER NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `featureImageId` INTEGER NULL,
    `featureOrder` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderedById` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `paymentMethod` ENUM('CashOnDelivery', 'CBE', 'Telebirr', 'Bunna') NOT NULL DEFAULT 'CashOnDelivery',
    `screenshotId` INTEGER NULL,
    `totalPrice` INTEGER NOT NULL,
    `currency` ENUM('ETB', 'USD') NOT NULL DEFAULT 'ETB',
    `orderStatus` ENUM('Ordered', 'OrderedAndPaid', 'Completed', 'Cancelled') NOT NULL,
    `orderedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArtworkOrders` (
    `artworkId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `currency` ENUM('ETB', 'USD') NOT NULL DEFAULT 'ETB',

    PRIMARY KEY (`artworkId`, `orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArtworkFiles` (
    `artworkId` INTEGER NOT NULL,
    `fileId` INTEGER NOT NULL,
    `fileOrder` INTEGER NOT NULL,

    PRIMARY KEY (`artworkId`, `fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` ENUM('Image', 'Video', 'Unknown') NOT NULL,
    `mimeType` VARCHAR(191) NULL,
    `blurHash` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sessions_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationTokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationTokens_token_key`(`token`),
    UNIQUE INDEX `VerificationTokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ArtworksAndMedium` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ArtworksAndMedium_AB_unique`(`A`, `B`),
    INDEX `_ArtworksAndMedium_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FavoritedArtworks` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FavoritedArtworks_AB_unique`(`A`, `B`),
    INDEX `_FavoritedArtworks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Artworks` ADD CONSTRAINT `Artworks_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artworks` ADD CONSTRAINT `Artworks_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medium` ADD CONSTRAINT `Medium_featureImageId_fkey` FOREIGN KEY (`featureImageId`) REFERENCES `Files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_screenshotId_fkey` FOREIGN KEY (`screenshotId`) REFERENCES `Files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkOrders` ADD CONSTRAINT `ArtworkOrders_artworkId_fkey` FOREIGN KEY (`artworkId`) REFERENCES `Artworks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkOrders` ADD CONSTRAINT `ArtworkOrders_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkFiles` ADD CONSTRAINT `ArtworkFiles_artworkId_fkey` FOREIGN KEY (`artworkId`) REFERENCES `Artworks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkFiles` ADD CONSTRAINT `ArtworkFiles_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArtworksAndMedium` ADD CONSTRAINT `_ArtworksAndMedium_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artworks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArtworksAndMedium` ADD CONSTRAINT `_ArtworksAndMedium_B_fkey` FOREIGN KEY (`B`) REFERENCES `Medium`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoritedArtworks` ADD CONSTRAINT `_FavoritedArtworks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artworks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FavoritedArtworks` ADD CONSTRAINT `_FavoritedArtworks_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
