# syntax=docker/dockerfile:1

# ---- build stage --------------------------------------------------------
# Builds the custom PocketBase (module "yangisi-pb") for Linux. The project
# uses modernc.org/sqlite (pure Go), so no CGO/gcc is needed → static binary.
FROM golang:1.26-alpine AS build
WORKDIR /src

# Build settings. proxy.golang.org sometimes drops large module downloads on
# slow/unstable links ("unexpected EOF"). A PIPED GOPROXY (`|`) falls through to
# the next entry on ANY error — mirror, then direct. go.sum still verifies every
# module hash, so a mirror cannot inject code. Override with --build-arg GOPROXY=...
ARG GOPROXY="https://proxy.golang.org|https://goproxy.cn|direct"
ENV GOPROXY=$GOPROXY \
    GOTOOLCHAIN=auto \
    CGO_ENABLED=0 \
    GOOS=linux

# Download dependencies first for better layer caching, retrying to ride out
# transient drops (modernc sqlite/libc are large).
COPY go.mod go.sum ./
RUN for i in 1 2 3 4 5; do \
      go mod download && s=ok && break || s=fail; \
      echo "go mod download attempt $i failed; retrying in 5s..."; \
      sleep 5; \
    done; [ "$s" = ok ]

# Build the static binary.
COPY . .
RUN go build -trimpath -ldflags="-s -w" -o /out/yangisi-pb .

# ---- runtime stage ------------------------------------------------------
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata wget
WORKDIR /pb

COPY --from=build /out/yangisi-pb /pb/yangisi-pb

# DB, uploaded files and backups live here — mount a volume to persist them.
VOLUME ["/pb/pb_data"]
EXPOSE 8090

# Migrations auto-apply on `serve` (migratecmd Automigrate). BOT_TOKEN is read
# from the environment and overrides the source fallback.
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8090/api/health >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/pb/yangisi-pb"]
CMD ["serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
