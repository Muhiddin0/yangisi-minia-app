package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// Adds dedicated `poster` and `video` fields to listings:
//   - poster: a single image used as the product-card cover (falls back to
//     the first gallery image when empty).
//   - video:  a single short clip (the UI caps duration at 1 minute).
//
// The existing `images` gallery is also narrowed to images only — videos now
// live in their own field. Already-stored gallery videos are untouched; the
// stricter MIME list only applies to new uploads.
func init() {
	imageMimes := []string{"image/jpeg", "image/png", "image/webp", "image/gif"}
	videoMimes := []string{"video/mp4", "video/quicktime"}

	m.Register(func(app core.App) error {
		listings, err := app.FindCollectionByNameOrId("listings")
		if err != nil {
			return err
		}

		if listings.Fields.GetByName("poster") == nil {
			listings.Fields.Add(&core.FileField{
				Name:      "poster",
				MaxSelect: 1,
				MaxSize:   10 << 20, // 10 MB
				MimeTypes: imageMimes,
			})
		}
		if listings.Fields.GetByName("video") == nil {
			listings.Fields.Add(&core.FileField{
				Name:      "video",
				MaxSelect: 1,
				MaxSize:   50 << 20, // 50 MB (≈ 1-minute clip)
				MimeTypes: videoMimes,
			})
		}

		// Gallery is images-only now that video has a dedicated field.
		if f, ok := listings.Fields.GetByName("images").(*core.FileField); ok {
			f.MimeTypes = imageMimes
		}

		return app.Save(listings)
	}, func(app core.App) error {
		listings, err := app.FindCollectionByNameOrId("listings")
		if err != nil {
			return err
		}

		listings.Fields.RemoveByName("poster")
		listings.Fields.RemoveByName("video")

		// Restore the original gallery MIME list (images + short videos).
		if f, ok := listings.Fields.GetByName("images").(*core.FileField); ok {
			f.MimeTypes = append(append([]string{}, imageMimes...), videoMimes...)
		}

		return app.Save(listings)
	})
}
