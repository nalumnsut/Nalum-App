# MinIO

MinIO runs as the private S3-compatible object store for backend uploads.

- S3 API: `http://minio:9000` inside Docker only.
- Console UI: `http://localhost:9001` in the `development` profile only.
- Default local credentials: `minioadmin` / `minioadmin`.

Override local credentials with `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`.
