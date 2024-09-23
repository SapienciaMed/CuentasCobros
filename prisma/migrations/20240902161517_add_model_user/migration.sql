-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(191) NOT NULL,
    `correoElectronico` VARCHAR(191) NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
