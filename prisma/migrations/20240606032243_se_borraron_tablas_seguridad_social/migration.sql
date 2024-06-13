/*
  Warnings:

  - You are about to drop the column `seguridadSocialId` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the `seguridadsocial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Actividades_cobroId_fkey` ON `actividades`;

-- DropIndex
DROP INDEX `Cobro_bancoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_contratoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_seguridadSocialId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_tipoCuentaId_fkey` ON `cobro`;

-- AlterTable
ALTER TABLE `cobro` DROP COLUMN `seguridadSocialId`;

-- DropTable
DROP TABLE `seguridadsocial`;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id_banco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_tipoCuentaId_fkey` FOREIGN KEY (`tipoCuentaId`) REFERENCES `TipoCuenta`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `Contrato`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actividades` ADD CONSTRAINT `Actividades_cobroId_fkey` FOREIGN KEY (`cobroId`) REFERENCES `Cobro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
