-- DropIndex
DROP INDEX `Cobro_bancoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_contratoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_seguridadSocialId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_tipoCuentaId_fkey` ON `cobro`;

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
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_seguridadSocialId_fkey` FOREIGN KEY (`seguridadSocialId`) REFERENCES `SeguridadSocial`(`id_segurida_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividades` ADD CONSTRAINT `Actividades_cobroId_fkey` FOREIGN KEY (`cobroId`) REFERENCES `Cobro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
