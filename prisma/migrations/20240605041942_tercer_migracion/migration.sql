/*
  Warnings:

  - The primary key for the `cobro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellidos` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `bancoId` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `contratoId` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `correoElectronico` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaBancaria` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `documento` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `identificacionFiscal` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `nombres` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `seguridadSocialId` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `cobro` table. All the data in the column will be lost.
  - You are about to drop the column `tipoCuentaId` on the `cobro` table. All the data in the column will be lost.
  - Added the required column `id_banco` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cobro` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_contrato` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cuenta` to the `Cobro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_seguridad_social` to the `Cobro` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `cobro` DROP PRIMARY KEY,
    DROP COLUMN `apellidos`,
    DROP COLUMN `bancoId`,
    DROP COLUMN `contratoId`,
    DROP COLUMN `correoElectronico`,
    DROP COLUMN `cuentaBancaria`,
    DROP COLUMN `direccion`,
    DROP COLUMN `documento`,
    DROP COLUMN `id`,
    DROP COLUMN `identificacionFiscal`,
    DROP COLUMN `nombres`,
    DROP COLUMN `seguridadSocialId`,
    DROP COLUMN `telefono`,
    DROP COLUMN `tipoCuentaId`,
    ADD COLUMN `id_banco` INTEGER NOT NULL,
    ADD COLUMN `id_cobro` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_contrato` INTEGER NOT NULL,
    ADD COLUMN `id_cuenta` INTEGER NOT NULL,
    ADD COLUMN `id_seguridad_social` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id_cobro`);

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_id_banco_fkey` FOREIGN KEY (`id_banco`) REFERENCES `Banco`(`id_banco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_id_cuenta_fkey` FOREIGN KEY (`id_cuenta`) REFERENCES `TipoCuenta`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_id_contrato_fkey` FOREIGN KEY (`id_contrato`) REFERENCES `Contrato`(`id_contrato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobro` ADD CONSTRAINT `Cobro_id_seguridad_social_fkey` FOREIGN KEY (`id_seguridad_social`) REFERENCES `SeguridadSocial`(`id_segurida_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
