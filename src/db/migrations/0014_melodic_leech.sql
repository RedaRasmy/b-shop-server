CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"label" varchar(50) NOT NULL,
	"city" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "cart_items" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_userId_productId_unique";--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_product_id_unique" UNIQUE("user_id","product_id");