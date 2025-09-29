CREATE TYPE "public"."entity_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "entity_status" NOT NULL;