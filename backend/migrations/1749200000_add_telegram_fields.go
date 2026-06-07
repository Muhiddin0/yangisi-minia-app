package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// Adds the fields that the telegram-auth plugin fills on the `users`
// collection. The plugin writes: name (already present), first_name,
// last_name, telegram_username, telegram_id and language_code.
//
// telegram_id is stored as text (the plugin formats the Telegram id with
// strconv.FormatInt and looks records up by the string value), and gets a
// partial UNIQUE index so one Telegram account maps to exactly one user
// while still allowing pre-existing rows with an empty telegram_id.
func init() {
	const telegramIDIndex = "idx_users_telegram_id"

	textFields := []string{
		"first_name",
		"last_name",
		"telegram_username",
		"telegram_id",
		"language_code",
	}

	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		for _, name := range textFields {
			if collection.Fields.GetByName(name) == nil {
				collection.Fields.Add(&core.TextField{Name: name})
			}
		}

		collection.AddIndex(telegramIDIndex, true, "telegram_id", "telegram_id != ''")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		collection.RemoveIndex(telegramIDIndex)
		for _, name := range textFields {
			collection.Fields.RemoveByName(name)
		}

		return app.Save(collection)
	})
}
