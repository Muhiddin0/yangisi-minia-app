package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// Telegram accounts have no email, so the telegram-auth plugin can't create a
// user while `users.email` is required. Make email optional.
func init() {
	m.Register(func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		if f, ok := users.Fields.GetByName("email").(*core.EmailField); ok {
			f.Required = false
		}
		return app.Save(users)
	}, func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		if f, ok := users.Fields.GetByName("email").(*core.EmailField); ok {
			f.Required = true
		}
		return app.Save(users)
	})
}
