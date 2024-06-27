/*
  Warnings:

  - The primary key for the `cobro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_banco` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `id_cobro` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `id_contrato` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `id_cuenta` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `id_seguridad_social` on the `cobro` table. All the data in the column will be lost.
  - Added the required column `apellidos` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bancoId` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contratoId` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correoElectronico` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuentaBancaria` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documento` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificacionFiscal` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seguridadSocialId` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoCuentaId` to the `Cobro` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Cobro_id_banco_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_id_contrato_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_id_cuenta_fkey` ON `cobro`;

-- DropIndex
DROP INDEX `Cobro_id_seguridad_social_fkey` ON `cobro`;

-- AlterTable
ALTER TABLE `cobro` DROP PRIMARY KEY,
    DROP COLUMN `id_banco`,
    DROP COLUMN `id_cobro`,
    DROP COLUMN `id_contrato`,
    DROP COLUMN `id_cuenta`,
    DROP COLUMN `id_seguridad_social`,
    ADD COLUMN `apellidos` VARCHAR(191) NOT NULL,
    ADD COLUMN `bancoId` INTEGER NOT NULL,
    ADD COLUMN `contratoId` INTEGER NOT NULL,
    ADD COLUMN `correoElectronico` VARCHAR(191) NOT NULL,
    ADD COLUMN `cuentaBancaria` INTEGER NOT NULL,
    ADD COLUMN `direccion` VARCHAR(191) NOT NULL,
    ADD COLUMN `documento` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `identificacionFiscal` INTEGER NOT NULL,
    ADD COLUMN `nombres` VARCHAR(191) NOT NULL,
    ADD COLUMN `seguridadSocialId` INTEGER NOT NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipoCuentaId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id_banco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_tipoCuentaId_fkey` FOREIGN KEY (`tipoCuentaId`) REFERENCES `TipoCuenta`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `Contrato`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_seguridadSocialId_fkey` FOREIGN KEY (`seguridadSocialId`) REFERENCES `SeguridadSocial`(`id_segurida_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
