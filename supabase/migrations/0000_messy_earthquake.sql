DO $$ BEGIN
 CREATE TYPE "public"."primary_journal_goal" AS ENUM('Self-Discovery and Growth', 'Emotional Wellness and Resilience', 'Relationships and Behavioral Change');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."prompt_frequency" AS ENUM('daily', 'weekly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."prompt_period" AS ENUM('morning', 'afternoon', 'evening', 'night');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."prompt_tone" AS ENUM('neutral', 'nurturing', 'challenging');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"secret" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_entries" (
	"userId" text NOT NULL,
	"promptId" text NOT NULL,
	"entry" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompts" (
	"userId" text NOT NULL,
	"email" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"promptNumber" integer DEFAULT 0 NOT NULL,
	"prompt" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"name" text,
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"userTimezone" text DEFAULT 'America/New_York',
	"prompt_period" "prompt_period",
	"lastEntryTime" timestamp,
	"prompt_tone" "prompt_tone",
	"primary_journal_goal" "primary_journal_goal",
	"prompt_frequency" "prompt_frequency",
	"created_at" timestamp with time zone DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone,
	"isPaused" boolean DEFAULT false,
	"completedOnboarding" boolean DEFAULT false NOT NULL,
	"pushNotificationsEnabled" boolean DEFAULT false,
	"emailNotificationsEnabled" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_promptId_prompts_id_fk" FOREIGN KEY ("promptId") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "journalEntriesUserIdIndex" ON "journal_entries" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "journalEntryPromptIdIndex" ON "journal_entries" USING btree ("promptId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promptUserIdIndex" ON "prompts" USING btree ("userId","promptNumber");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lastEntryTimeIndex" ON "users" USING btree ("lastEntryTime","isPaused");