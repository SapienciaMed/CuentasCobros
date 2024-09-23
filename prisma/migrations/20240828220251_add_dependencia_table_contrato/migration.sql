-- CreateTable
CREATE TABLE `Cobro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento` INTEGER NOT NULL,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `correoElectronico` VARCHAR(191) NOT NULL,
    `identificacionFiscal` INTEGER NOT NULL,
    `nro_cuenta` INTEGER NOT NULL,
    `bancoId` INTEGER NOT NULL,
    `tipoCuentaId` INTEGER NOT NULL,
    `contratoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banco` (
    `id_banco` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_banco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoCuenta` (
    `id_cuenta` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_cuenta` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_cuenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contrato` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_contrato` INTEGER NOT NULL,
    `objeto_contrato` VARCHAR(191) NOT NULL,
    `ano_contrato` INTEGER NOT NULL,
    `valor_mes` DOUBLE NOT NULL,
    `dependencia` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actividades` (
    `id_actividades` INTEGER NOT NULL AUTO_INCREMENT,
    `objeto_contractual` VARCHAR(191) NOT NULL,
    `cobroId` INTEGER NOT NULL,

    PRIMARY KEY (`id_actividades`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id_banco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_tipoCuentaId_fkey` FOREIGN KEY (`tipoCuentaId`) REFERENCES `TipoCuenta`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `Contrato`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividades` ADD CONSTRAINT `Actividades_cobroId_fkey` FOREIGN KEY (`cobroId`) REFERENCES `Cobro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
