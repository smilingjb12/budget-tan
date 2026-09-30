CREATE TABLE "appSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'night-ledger' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
