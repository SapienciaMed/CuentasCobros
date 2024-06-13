/*
  Warnings:

  - You are about to alter the column `numero_contrato` on the `contrato` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropIndex
DROP INDEX `Cobro_bancoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_contratoId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_seguridadSocialId_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_tipoCuentaId_fkey` ON `cobro`;

-- AlterTable
ALTER TABLE `contrato` MODIFY `numero_contrato` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id_banco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_tipoCuentaId_fkey` FOREIGN KEY (`tipoCuentaId`) REFERENCES `TipoCuenta`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `Contrato`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_seguridadSocialId_fkey` FOREIGN KEY (`seguridadSocialId`) REFERENCES `SeguridadSocial`(`id_segurida_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
