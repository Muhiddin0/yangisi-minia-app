package main

import (
	"bytes"
	"log"
	"os"
	"strings"

	tgAuthPlugin "github.com/iamelevich/pocketbase-plugin-telegram-auth"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"yangisi-pb/hooks"
	// Registers the Go migrations (auto-applied on `serve`).
	_ "yangisi-pb/migrations"
)

// loadDotEnv loads KEY=VALUE pairs from a .env file into the process
// environment (Go does not read .env automatically). Tolerant of spaces,
// quotes, CRLF and a UTF-8 BOM. Existing environment variables take priority.
func loadDotEnv(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	data = bytes.TrimPrefix(data, []byte{0xEF, 0xBB, 0xBF}) // strip UTF-8 BOM
	for _, raw := range strings.Split(string(data), "\n") {
		line := strings.TrimSpace(raw)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, val, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		val = strings.Trim(strings.TrimSpace(val), `"'`)
		val = strings.TrimSpace(val)
		if key != "" {
			if _, exists := os.LookupEnv(key); !exists {
				_ = os.Setenv(key, val)
			}
		}
	}
}

func main() {
	loadDotEnv(".env")

	app := pocketbase.New()

	// Runs pending Go migrations on serve and adds the `migrate` command.
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true,
	})

	botToken := os.Getenv("BOT_TOKEN")
	if botToken == "" {
		// Local-dev fallback; in production set the BOT_TOKEN env var and
		// keep the real token out of version control.
		botToken = "8691398656:AAFvsHMAvSENj4zm_gOfFaGg3x-o3vYUuM8"
	}

	tgAuthPlugin.MustRegister(app, &tgAuthPlugin.Options{
		BotToken:      botToken,
		CollectionKey: "users",
	})

	// Marketplace business rules (seller approval, listing moderation).
	hooks.Register(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
