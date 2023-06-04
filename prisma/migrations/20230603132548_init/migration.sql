-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,
    `PassWord` VARCHAR(191) NOT NULL,
    `Phone` VARCHAR(191) NOT NULL,
    `IsVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_Email_key`(`Email`),
    UNIQUE INDEX `User_UserName_key`(`UserName`),
    UNIQUE INDEX `User_Phone_key`(`Phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
