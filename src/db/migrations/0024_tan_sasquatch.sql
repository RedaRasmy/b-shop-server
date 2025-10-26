ALTER TABLE "orders" ADD COLUMN "order_token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "order_token_idx" ON "orders" USING btree ("order_token");