-- shipany-tanstack e23c403 (guest posts): order.reference and the guest_post table.
-- ALTER TABLE ADD COLUMN is not re-runnable: run once per database.
-- New permissions (admin.guest-posts.read/review/reject): run `pnpm rbac:init`.
ALTER TABLE `order` ADD COLUMN `reference` text;
CREATE TABLE IF NOT EXISTS `guest_post` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `post_id` text NOT NULL,
  `product_id` text NOT NULL,
  `status` text NOT NULL,
  `review_note` text,
  `order_no` text,
  `submitted_at` integer,
  `published_at` integer,
  `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS `guest_post_post_id_unique` ON `guest_post` (`post_id`);
CREATE INDEX IF NOT EXISTS `idx_guest_post_user` ON `guest_post` (`user_id`);
CREATE INDEX IF NOT EXISTS `idx_guest_post_status` ON `guest_post` (`status`);
