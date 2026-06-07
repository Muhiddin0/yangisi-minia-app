package hooks

import (
	"fmt"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// listingLimitPerUser caps how many active (non-sold) listings an individual
// (non-shop) user may keep at once. Approved shops are not limited.
const listingLimitPerUser = 3

// Register wires the marketplace business rules as PocketBase hooks.
func Register(app core.App) {
	// Mirror a shop's approval onto its owner's users.is_seller flag whenever
	// the shop is created or updated (e.g. superadmin sets status=approved).
	syncSellerFlag := func(e *core.RecordEvent) error {
		approved := e.Record.GetString("status") == "approved"
		if ownerID := e.Record.GetString("owner"); ownerID != "" {
			if user, err := e.App.FindRecordById("users", ownerID); err == nil {
				if user.GetBool("is_seller") != approved {
					user.Set("is_seller", approved)
					if err := e.App.Save(user); err != nil {
						return err
					}
				}
			}
		}
		return e.Next()
	}
	app.OnRecordAfterCreateSuccess("shops").BindFunc(syncSellerFlag)
	app.OnRecordAfterUpdateSuccess("shops").BindFunc(syncSellerFlag)

	// On shop creation, force a pending, unverified request owned by the
	// authenticated user — prevents self-approval through the API.
	app.OnRecordCreateRequest("shops").BindFunc(func(e *core.RecordRequestEvent) error {
		if e.Auth != nil {
			e.Record.Set("owner", e.Auth.Id)
		}
		e.Record.Set("status", "pending")
		e.Record.Set("verified", false)
		return e.Next()
	})

	// On listing creation, decide the publish status server-side:
	//   - posted under the caller's own APPROVED shop -> active (no moderation)
	//   - anything else (an individual user) -> moderation
	// Individual (non-shop) listings are also capped per user.
	app.OnRecordCreateRequest("listings").BindFunc(func(e *core.RecordRequestEvent) error {
		if e.Auth != nil {
			e.Record.Set("owner", e.Auth.Id)
		}
		e.Record.Set("views", 0)
		e.Record.Set("saves", 0)

		status := "moderation"
		if shopID := e.Record.GetString("shop"); shopID != "" && e.Auth != nil {
			shop, err := e.App.FindRecordById("shops", shopID)
			if err == nil &&
				shop.GetString("owner") == e.Auth.Id &&
				shop.GetString("status") == "approved" {
				status = "active"
			} else {
				e.Record.Set("shop", "") // not the caller's approved shop
			}
		}
		e.Record.Set("status", status)

		// Enforce the per-user cap for individual (non-shop) listings.
		if e.Record.GetString("shop") == "" && e.Auth != nil {
			mine, err := e.App.FindRecordsByFilter(
				"listings",
				"owner = {:owner} && status != 'sold'",
				"", 0, 0,
				dbx.Params{"owner": e.Auth.Id},
			)
			if err != nil {
				return err
			}
			individual := 0
			for _, r := range mine {
				if r.GetString("shop") == "" {
					individual++
				}
			}
			if individual >= listingLimitPerUser {
				return apis.NewBadRequestError(
					fmt.Sprintf(
						"E'lon limiti to'ldi: oddiy foydalanuvchilar bir vaqtda ko'pi bilan %d ta e'lon joylashi mumkin.",
						listingLimitPerUser,
					),
					nil,
				)
			}
		}

		return e.Next()
	})
}
