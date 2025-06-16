-- AlterTable
ALTER TABLE `confeiteira` ADD COLUMN `horarioFim` VARCHAR(191) NULL,
    ADD COLUMN `horarioInicio` VARCHAR(191) NULL,
    MODIFY `imagem` VARCHAR(191) NULL,
    MODIFY `descricao` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `confeiteiraId` INTEGER NOT NULL,
    `estrelas` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Avaliacao_confeiteiraId_idx`(`confeiteiraId`),
    UNIQUE INDEX `Avaliacao_clienteId_confeiteiraId_key`(`clienteId`, `confeiteiraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoPersonalizado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `confeiteiraId` INTEGER NOT NULL,
    `massa` VARCHAR(191) NOT NULL,
    `recheio` VARCHAR(191) NOT NULL,
    `cobertura` VARCHAR(191) NOT NULL,
    `camadas` INTEGER NOT NULL,
    `topo` BOOLEAN NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `dataEntrega` DATETIME(3) NOT NULL,
    `horaEntrega` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PedidoPersonalizado_clienteId_idx`(`clienteId`),
    INDEX `PedidoPersonalizado_confeiteiraId_idx`(`confeiteiraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NumeroPedido` INTEGER NOT NULL,
    `nomeConfeiteira` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `dataPedido` DATETIME(3) NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `pagamento` VARCHAR(191) NOT NULL,
    `confeiteiraId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `boloId` INTEGER NULL,

    INDEX `pedido_clienteId_fkey`(`clienteId`),
    INDEX `pedido_confeiteiraId_fkey`(`confeiteiraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrinho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,
    `sabor` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `pedidoId` INTEGER NOT NULL,

    INDEX `carrinho_clienteId_fkey`(`clienteId`),
    INDEX `carrinho_pedidoId_fkey`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comentario` VARCHAR(191) NULL,
    `data` DATETIME(3) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    INDEX `comentarios_clienteId_fkey`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoritos` (
    `nomeloja` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NULL,
    `confeiteiraId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,

    INDEX `favoritos_clienteId_fkey`(`clienteId`),
    PRIMARY KEY (`confeiteiraId`, `clienteId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bolo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,
    `sabor` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `confeiteiraId` INTEGER NOT NULL,
    `peso` DOUBLE NOT NULL,

    INDEX `Bolo_confeiteiraId_fkey`(`confeiteiraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentariosconfeiteira` (
    `comentario` VARCHAR(191) NOT NULL,
    `comentarioId` INTEGER NOT NULL,
    `confeiteiraId` INTEGER NOT NULL,

    INDEX `comentariosConfeiteira_confeiteiraId_fkey`(`confeiteiraId`),
    PRIMARY KEY (`comentarioId`, `confeiteiraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itenspedido` (
    `quantidade` INTEGER NOT NULL,
    `preco_unitario` DOUBLE NOT NULL,
    `pedidoId` INTEGER NOT NULL,
    `boloId` INTEGER NOT NULL,

    INDEX `ItensPedido_boloId_fkey`(`boloId`),
    PRIMARY KEY (`pedidoId`, `boloId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPersonalizado` ADD CONSTRAINT `PedidoPersonalizado_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoPersonalizado` ADD CONSTRAINT `PedidoPersonalizado_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `carrinho_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `carrinho_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bolo` ADD CONSTRAINT `Bolo_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentariosconfeiteira` ADD CONSTRAINT `comentariosConfeiteira_comentarioId_fkey` FOREIGN KEY (`comentarioId`) REFERENCES `comentarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentariosconfeiteira` ADD CONSTRAINT `comentariosConfeiteira_confeiteiraId_fkey` FOREIGN KEY (`confeiteiraId`) REFERENCES `confeiteira`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itenspedido` ADD CONSTRAINT `ItensPedido_boloId_fkey` FOREIGN KEY (`boloId`) REFERENCES `bolo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itenspedido` ADD CONSTRAINT `ItensPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
