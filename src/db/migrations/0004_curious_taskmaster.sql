ALTER TABLE "products" RENAME COLUMN "categorie_id" TO "category_id";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_categorie_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;