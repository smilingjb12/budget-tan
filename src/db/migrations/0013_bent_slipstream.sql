CREATE TABLE "balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"currentBalance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "balance" ("currentBalance") VALUES (0);
