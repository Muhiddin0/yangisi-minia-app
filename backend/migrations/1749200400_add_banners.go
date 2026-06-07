package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

// banners: editorial hero-carousel slides shown on the user home page. Each
// slide is an image that links to a listing detail page or a shop page (and a
// free-form `url` as a fallback). Slides are created/edited by a superadmin in
// the PocketBase admin UI.
//
// Access: public read (so the home page can fetch them unauthenticated);
// create/update/delete are superadmin-only (nil rules).
func init() {
	m.Register(func(app core.App) error {
		listings, err := app.FindCollectionByNameOrId("listings")
		if err != nil {
			return err
		}
		shops, err := app.FindCollectionByNameOrId("shops")
		if err != nil {
			return err
		}

		banners := core.NewBaseCollection("banners")
		banners.Fields.Add(
			&core.TextField{Name: "title"},
			&core.FileField{
				Name:      "image",
				Required:  true,
				MaxSelect: 1,
				MaxSize:   10 << 20, // 10 MB
				MimeTypes: []string{"image/jpeg", "image/png", "image/webp", "image/gif"},
			},
			// Link target: prefer listing, then shop, then url. All optional.
			&core.RelationField{Name: "listing", CollectionId: listings.Id, MaxSelect: 1, CascadeDelete: true},
			&core.RelationField{Name: "shop", CollectionId: shops.Id, MaxSelect: 1, CascadeDelete: true},
			&core.TextField{Name: "url"},
			&core.BoolField{Name: "active"},
			&core.NumberField{Name: "sort_order", OnlyInt: true},
			&core.AutodateField{Name: "created", OnCreate: true},
			&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
		)
		banners.AddIndex("idx_banners_active_sort", false, "active, sort_order", "")
		banners.ListRule = types.Pointer("")
		banners.ViewRule = types.Pointer("")
		// create/update/delete: superadmin only (nil rules)
		if err := app.Save(banners); err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		if col, err := app.FindCollectionByNameOrId("banners"); err == nil {
			return app.Delete(col)
		}
		return nil
	})
}
