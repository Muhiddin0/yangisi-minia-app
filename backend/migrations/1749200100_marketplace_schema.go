package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Marketplace schema: brands, shops, listings, favorites + users.is_seller.
//
// Role / moderation model:
//   - A user becomes a seller by creating a `shops` record (status=pending);
//     a superadmin sets status=approved (a hook then flips users.is_seller).
//   - Listings posted under an approved shop are published directly (active).
//   - Listings posted by a regular user go to moderation until approved.
//   - The status logic and ownership are enforced server-side in hooks.go.
func init() {
	m.Register(func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		// users.is_seller — set by the approval hook.
		if users.Fields.GetByName("is_seller") == nil {
			users.Fields.Add(&core.BoolField{Name: "is_seller"})
			if err := app.Save(users); err != nil {
				return err
			}
		}

		// ── brands ────────────────────────────────────────────────
		brands := core.NewBaseCollection("brands")
		brands.Fields.Add(
			&core.TextField{Name: "name", Required: true},
			&core.TextField{Name: "slug", Required: true},
			&core.FileField{Name: "logo", MaxSelect: 1, MaxSize: 5 << 20},
			&core.AutodateField{Name: "created", OnCreate: true},
			&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
		)
		brands.AddIndex("idx_brands_slug", true, "slug", "")
		brands.ListRule = types.Pointer("")
		brands.ViewRule = types.Pointer("")
		// create/update/delete: superadmin only (nil rules)
		if err := app.Save(brands); err != nil {
			return err
		}

		// ── shops (also the "become a seller" request) ────────────
		shops := core.NewBaseCollection("shops")
		shops.Fields.Add(
			&core.RelationField{Name: "owner", CollectionId: users.Id, MaxSelect: 1, Required: true, CascadeDelete: true},
			&core.TextField{Name: "name", Required: true},
			&core.FileField{Name: "logo", MaxSelect: 1, MaxSize: 5 << 20},
			&core.TextField{Name: "phone"},
			&core.TextField{Name: "telegram"},
			&core.TextField{Name: "location"},
			&core.TextField{Name: "description"},
			&core.SelectField{Name: "status", Values: []string{"pending", "approved", "rejected"}, MaxSelect: 1, Required: true},
			&core.BoolField{Name: "verified"},
			&core.AutodateField{Name: "created", OnCreate: true},
			&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
		)
		shops.AddIndex("idx_shops_owner", true, "owner", "")
		shops.ListRule = types.Pointer("")
		shops.ViewRule = types.Pointer("")
		shops.CreateRule = types.Pointer("@request.auth.id != \"\"")
		// owner can edit shop info but NOT self-approve (status/verified locked).
		shops.UpdateRule = types.Pointer(
			"owner = @request.auth.id" +
				" && (@request.body.status:isset = false || @request.body.status = status)" +
				" && (@request.body.verified:isset = false || @request.body.verified = verified)",
		)
		shops.DeleteRule = types.Pointer("owner = @request.auth.id")
		if err := app.Save(shops); err != nil {
			return err
		}

		// ── listings ──────────────────────────────────────────────
		listings := core.NewBaseCollection("listings")
		listings.Fields.Add(
			&core.RelationField{Name: "owner", CollectionId: users.Id, MaxSelect: 1, Required: true, CascadeDelete: true},
			&core.RelationField{Name: "shop", CollectionId: shops.Id, MaxSelect: 1, CascadeDelete: true},
			&core.RelationField{Name: "brand", CollectionId: brands.Id, MaxSelect: 1},
			&core.TextField{Name: "title", Required: true},
			&core.TextField{Name: "model"},
			&core.NumberField{Name: "price", Required: true, OnlyInt: true, Min: types.Pointer(0.0)},
			&core.SelectField{Name: "condition", Values: []string{"new", "like-new", "used", "refurbished"}, MaxSelect: 1},
			&core.TextField{Name: "memory"},
			&core.TextField{Name: "ram"},
			&core.TextField{Name: "color"},
			&core.NumberField{Name: "battery_health", OnlyInt: true, Min: types.Pointer(0.0), Max: types.Pointer(100.0)},
			&core.TextField{Name: "warranty"},
			&core.TextField{Name: "region"},
			&core.TextField{Name: "city"},
			&core.FileField{
				Name:      "images",
				MaxSelect: 10,
				MaxSize:   50 << 20, // 50 MB (allows short videos too)
				MimeTypes: []string{"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"},
			},
			&core.TextField{Name: "description"},
			&core.SelectField{Name: "status", Values: []string{"moderation", "active", "sold", "rejected"}, MaxSelect: 1, Required: true},
			&core.NumberField{Name: "views", OnlyInt: true},
			&core.NumberField{Name: "saves", OnlyInt: true},
			&core.AutodateField{Name: "created", OnCreate: true},
			&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
		)
		listings.AddIndex("idx_listings_shop", false, "shop", "")
		listings.AddIndex("idx_listings_owner", false, "owner", "")
		listings.AddIndex("idx_listings_status", false, "status", "")
		listings.AddIndex("idx_listings_brand", false, "brand", "")
		// public sees active; owners see their own (any status).
		listings.ListRule = types.Pointer("status = \"active\" || owner = @request.auth.id")
		listings.ViewRule = types.Pointer("status = \"active\" || owner = @request.auth.id")
		listings.CreateRule = types.Pointer("@request.auth.id != \"\"")
		// owner may edit own listing & mark it sold, but not self-approve to active.
		listings.UpdateRule = types.Pointer(
			"owner = @request.auth.id" +
				" && (@request.body.status:isset = false || @request.body.status = \"sold\" || @request.body.status = status)",
		)
		listings.DeleteRule = types.Pointer("owner = @request.auth.id")
		if err := app.Save(listings); err != nil {
			return err
		}

		// ── favorites (saved listings) ────────────────────────────
		favorites := core.NewBaseCollection("favorites")
		favorites.Fields.Add(
			&core.RelationField{Name: "user", CollectionId: users.Id, MaxSelect: 1, Required: true, CascadeDelete: true},
			&core.RelationField{Name: "listing", CollectionId: listings.Id, MaxSelect: 1, Required: true, CascadeDelete: true},
			&core.AutodateField{Name: "created", OnCreate: true},
		)
		favorites.AddIndex("idx_favorites_user_listing", true, "user, listing", "")
		favorites.ListRule = types.Pointer("user = @request.auth.id")
		favorites.ViewRule = types.Pointer("user = @request.auth.id")
		favorites.CreateRule = types.Pointer("@request.auth.id != \"\" && @request.body.user = @request.auth.id")
		favorites.DeleteRule = types.Pointer("user = @request.auth.id")
		if err := app.Save(favorites); err != nil {
			return err
		}

		// ── seed brands ───────────────────────────────────────────
		seed := []struct{ name, slug string }{
			{"Apple", "apple"},
			{"Samsung", "samsung"},
			{"Xiaomi", "xiaomi"},
			{"Redmi", "redmi"},
			{"Honor", "honor"},
			{"Google", "google"},
		}
		for _, b := range seed {
			rec := core.NewRecord(brands)
			rec.Set("name", b.name)
			rec.Set("slug", b.slug)
			if err := app.Save(rec); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		// revert: drop collections (reverse dependency order) + users.is_seller
		for _, name := range []string{"favorites", "listings", "shops", "brands"} {
			if col, err := app.FindCollectionByNameOrId(name); err == nil {
				if err := app.Delete(col); err != nil {
					return err
				}
			}
		}

		if users, err := app.FindCollectionByNameOrId("users"); err == nil {
			users.Fields.RemoveByName("is_seller")
			if err := app.Save(users); err != nil {
				return err
			}
		}

		return nil
	})
}
