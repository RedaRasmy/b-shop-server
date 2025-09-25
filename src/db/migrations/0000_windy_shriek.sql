-- CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'completed', 'canceled');--> statement-breakpoint
-- CREATE TYPE "public"."payment_method" AS ENUM('COD', 'card');--> statement-breakpoint
-- CREATE TABLE "categories" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"name" text NOT NULL,
-- 	"slug" text NOT NULL,
-- 	"isActive" boolean NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
-- );
--> statement-breakpoint
-- CREATE TABLE "product_images" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"product_id" uuid NOT NULL,
-- 	"url" text NOT NULL,
-- 	"public_id" varchar(255),
-- 	"alt" text NOT NULL,
-- 	"position" integer NOT NULL,
-- 	"width" integer,
-- 	"height" integer,
-- 	"format" varchar(10),
-- 	"size" integer,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL
-- );
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" integer,
	"product_id" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price_at_purchase" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total" integer NOT NULL,
	"shipping_address" text NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- CREATE TABLE "products" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"name" text NOT NULL,
-- 	"slug" text NOT NULL,
-- 	"description" text NOT NULL,
-- 	"price" integer NOT NULL,
-- 	"stock" integer NOT NULL,
-- 	"categorie_id" uuid NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	CONSTRAINT "products_slug_unique" UNIQUE("slug")
-- );
--> statement-breakpoint
-- CREATE TABLE "refresh_tokens" (
-- 	"id" serial PRIMARY KEY NOT NULL,
-- 	"token" varchar(128) NOT NULL,
-- 	"user_id" uuid NOT NULL,
-- 	"expires_at" timestamp NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
-- );
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"user_id" uuid,
	"rating" integer NOT NULL,
	"comment" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- CREATE TABLE "users" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"email" varchar(255) NOT NULL,
-- 	"password" varchar(255) NOT NULL,
-- 	"role" varchar(20) DEFAULT 'customer' NOT NULL,
-- 	"is_email_verified" boolean DEFAULT false NOT NULL,
-- 	"created_at" timestamp DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp DEFAULT now() NOT NULL,
-- 	CONSTRAINT "users_email_unique" UNIQUE("email")
-- );
--> statement-breakpoint
-- ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "products" ADD CONSTRAINT "products_categorie_id_categories_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- CREATE INDEX "idx_refresh_tokens_token" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
-- CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
-- CREATE INDEX "idx_refresh_tokens_expires_at" ON "refresh_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_product_user_idx" ON "reviews" USING btree ("product_id","user_id");