package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// Seeds two demo home-carousel banners so the slider isn't empty after a fresh
// setup: one linking to the demo shop, one to a featured listing. Tolerant of
// missing demo data and failed image downloads (such banners are skipped).
//
// Reuses imgBase, demoOwnerEmail and fetchFiles from the demo-data seed (same
// package), which runs before this migration.
func init() {
	m.Register(func(app core.App) error {
		bannersCol, err := app.FindCollectionByNameOrId("banners")
		if err != nil {
			return err
		}

		// Resolve the demo shop via its owner (created by the demo-data seed).
		var shopID string
		if owner, err := app.FindFirstRecordByData("users", "email", demoOwnerEmail); err == nil {
			if shop, err := app.FindFirstRecordByData("shops", "owner", owner.Id); err == nil {
				shopID = shop.Id
			}
		}

		// Resolve a featured listing to deep-link into.
		var listingID string
		if rec, err := app.FindFirstRecordByData("listings", "title", "iPhone 15 Pro Max 256GB"); err == nil {
			listingID = rec.Id
		}

		type seedBanner struct {
			title     string
			shopID    string
			listingID string
			sortOrder int
			imageURL  string
		}
		seeds := []seedBanner{
			{
				title:     "TechnoShop — original smartfonlar",
				shopID:    shopID,
				sortOrder: 1,
				imageURL:  imgBase + "AB6AXuCTFTUg7Wigv-BmLZ4_e-PmPt-ic1MH4dmfjsELKX2ariu7DZ5w4O44WNL57TR-O6TzjLkpqcsZQDourAppxpAk6EMDzTrd_Lu1XP-e-VdjItdkCVdskuGZkjZ2cmeP1zYXi0pRsDtgxmEWPAxMVvY-a0jpkql1rEKZ93POaPINm3A6jx-r6EIVfMOFWAt93qxqecb3_6--GkpemygU_-nPjb7ED35COmzdthc4u6TZsL4q2K5XNbxCEiTXImh6Rh-sWpCtVaQbRmU",
			},
			{
				title:     "iPhone 15 Pro Max — eng so'nggi narxlar",
				listingID: listingID,
				sortOrder: 2,
				imageURL:  imgBase + "AB6AXuB19Egn5haLmZeC-CGYbH1pjp5cv7OUwkvoQcbzN_daIAauqv6dFrPMIjT-a-I6w882Xn5RCIwdyET45uenWae9G5yJzedZs247CWYwb9MNZDqVqnAXUJB6ZIgPIhhQvPZfmTCoKdjZT9Bi__fzeFWLGLJA2ORyPT0O9yyIL2xxLQqc15eVIreHoCRc_pYri_9nPefwAWNWL-5bCUnS-c8A1C0nm4rXy2JHCx2ZSVDNxQDJJanbBQ8gDutkESeVsIG1hdF0_ruxxrE",
			},
		}

		for _, b := range seeds {
			imgs := fetchFiles(b.imageURL)
			if len(imgs) == 0 {
				continue // image is required; skip if the download failed
			}
			rec := core.NewRecord(bannersCol)
			rec.Set("title", b.title)
			if b.listingID != "" {
				rec.Set("listing", b.listingID)
			}
			if b.shopID != "" {
				rec.Set("shop", b.shopID)
			}
			rec.Set("active", true)
			rec.Set("sort_order", b.sortOrder)
			rec.Set("image", imgs)
			if err := app.Save(rec); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		// Remove all seeded banner records.
		if recs, err := app.FindAllRecords("banners"); err == nil {
			for _, r := range recs {
				if err := app.Delete(r); err != nil {
					return err
				}
			}
		}
		return nil
	})
}
