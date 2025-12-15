-- CreateTable
CREATE TABLE "public"."WebsiteMetric" (
    "id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "window_end" TIMESTAMP(3) NOT NULL,
    "final_status" "public"."WebsiteStatus" NOT NULL,
    "uptime_percent" DOUBLE PRECISION NOT NULL,
    "avg_response_time_ms" INTEGER,
    "regions_down_count" INTEGER NOT NULL,
    "regions_down_list" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebsiteMetric_website_id_window_start_idx" ON "public"."WebsiteMetric"("website_id", "window_start");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteMetric_website_id_window_start_key" ON "public"."WebsiteMetric"("website_id", "window_start");

-- AddForeignKey
ALTER TABLE "public"."WebsiteMetric" ADD CONSTRAINT "WebsiteMetric_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
