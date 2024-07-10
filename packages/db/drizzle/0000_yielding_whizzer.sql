CREATE TABLE IF NOT EXISTS "prompts" (
	"userId" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "responses" (
	"userId" text NOT NULL,
	"promptId" text NOT NULL,
	"response" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"isPaused" boolean DEFAULT false NOT NULL,
	"preferredHourUTC" integer NOT NULL,
	"timezone" text NOT NULL,
	"lastResponseAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_promptId_prompts_id_fk" FOREIGN KEY ("promptId") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promptUserIdIndex" ON "prompts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "responseUserIdIndex" ON "responses" USING btree ("userId","isDeleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "responsePromptIdIndex" ON "responses" USING btree ("promptId","isDeleted");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "preferredHourIndex" ON "users" USING btree ("preferredHourUTC","isPaused");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lastResponseAtIndex" ON "users" USING btree ("lastResponseAt","isPaused");