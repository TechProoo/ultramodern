-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "loc" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "install" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "dueSort" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "next" TEXT NOT NULL,
    "specs" JSONB NOT NULL DEFAULT '[]',
    "history" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "used" TEXT NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "eqId" TEXT NOT NULL,
    "pri" TEXT NOT NULL,
    "tech" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "by" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldLog" (
    "id" SERIAL NOT NULL,
    "eqId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "tech" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "work" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "parts" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "FieldLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_seq_key" ON "Equipment"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_seq_key" ON "Ticket"("seq");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eqId_fkey" FOREIGN KEY ("eqId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldLog" ADD CONSTRAINT "FieldLog_eqId_fkey" FOREIGN KEY ("eqId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
