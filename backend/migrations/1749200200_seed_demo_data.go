package migrations

import (
	"context"
	"time"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const imgBase = "https://lh3.googleusercontent.com/aida-public/"

const demoOwnerEmail = "demo@yangisi.uz"

// Downloads each URL and returns the successfully fetched files. Tolerant: a
// failed download (offline, dead URL) is skipped, never fails the migration.
// Uploaded files land in the configured storage (local or S3).
func fetchFiles(urls ...string) []any {
	files := make([]any, 0, len(urls))
	for _, u := range urls {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		f, err := filesystem.NewFileFromURL(ctx, u)
		cancel()
		if err == nil {
			files = append(files, f)
		}
	}
	return files
}

// Seeds a demo approved shop ("TechnoShop") and a catalog of active listings,
// so the frontend renders real PocketBase data before Telegram auth lands.
func init() {
	type seedListing struct {
		title, brandSlug, model           string
		price                             int
		condition, memory, ram, color     string
		battery                           int
		warranty, region, city, descr     string
		images                            []string
	}

	listings := []seedListing{
		{
			title: "iPhone 15 Pro Max 256GB", brandSlug: "apple", model: "15 Pro Max",
			price: 15_000_000, condition: "like-new", memory: "256 GB", ram: "8 GB",
			color: "Natural Titanium", battery: 100, warranty: "Official 11 months remaining",
			region: "Tashkent", city: "Yunusobod",
			descr:  "Personal iPhone 15 Pro Max in perfect condition, used with a case and screen protector from day one. Box and all accessories included.",
			images: []string{
				imgBase + "AB6AXuB19Egn5haLmZeC-CGYbH1pjp5cv7OUwkvoQcbzN_daIAauqv6dFrPMIjT-a-I6w882Xn5RCIwdyET45uenWae9G5yJzedZs247CWYwb9MNZDqVqnAXUJB6ZIgPIhhQvPZfmTCoKdjZT9Bi__fzeFWLGLJA2ORyPT0O9yyIL2xxLQqc15eVIreHoCRc_pYri_9nPefwAWNWL-5bCUnS-c8A1C0nm4rXy2JHCx2ZSVDNxQDJJanbBQ8gDutkESeVsIG1hdF0_ruxxrE",
				imgBase + "AB6AXuCUyRUn38Y-Lr30AJTHP1hML_-5fTYcbG4kik62WDTyuWRUNfpOX0NioUbY4BZYYARTR-4hbQ6AXdrmRpQMa_4CKJj_oP2ubryoHJjVwBu2qNwc9ZG1yi_f0WJOFMUhT5A0xVgovY_fmrEUiATUu-pXPJ91GIRkr2rA-MYE8c2ZobAhIn_t0Guqh-8KDrhxSOanElbbmn4w8xEC9Jmt4chDobkwqs7Z25MOp7ttfWaCa63PCsLsoY7ylejFH47x9o9NfzTFpdqn54E",
			},
		},
		{
			title: "iPhone 15 Pro", brandSlug: "apple", model: "15 Pro",
			price: 12_500_000, condition: "new", memory: "128 GB", ram: "8 GB",
			color: "Blue Titanium", warranty: "Official 1 year", region: "Tashkent", city: "Chilonzor",
			descr:  "Brand new, sealed iPhone 15 Pro with full official warranty.",
			images: []string{imgBase + "AB6AXuAr7ngDwgZfuyCngPRPnChWl9eVwGf54n4v8XT61JW0tD9gi8hPSRfJ_YROTPJPZIZtexfb8Jhx5UrLA3ihYH87muNPCGpUpHmRAHn50nnaqLReNZ0ngYLrcvMhmTE80q2038OlkEQXgB03ikBR5ujIwqfbrTqFAaGv1FADgaoLJSMt3gfVpGqOdKnZo0ySAdjdtL-0MN-mXGZ3hVtyHwWctC7LYbnsvGmamy0cEOLuttghdzKBD3ZR_VA6Ox0iYv3zdd3kHET5HpE"},
		},
		{
			title: "Samsung S23 Ultra", brandSlug: "samsung", model: "Galaxy S23 Ultra",
			price: 9_800_000, condition: "used", memory: "256 GB", ram: "12 GB",
			color: "Phantom Black", battery: 94, region: "Tashkent", city: "Mirzo Ulug'bek",
			descr:  "Galaxy S23 Ultra in great condition, S-Pen included. Minor frame wear, flawless screen.",
			images: []string{imgBase + "AB6AXuD46VO7LlLqduzTOT76VoZUpEJZJaABCZCs5Nohs-8bAWUWR_7ZA7CQcnDne61TETEF9GZZCQBt-hz3wOvz-duNc_q0ekDw3ou3GgDxPo_E3PVBhVf4593ziEfgqxUm5JRAcT2saCbMlOvVyEqpnZnf6H9mqxJGjDGRzS2XJbWb4GHiCNB2cCgL_C6RRpUxMyYE8yZEy29D-aRxSgadD7zxT6xQL0RJoIaYPUSuUOmrLNYFwAofaO4ojy1ElOoszkZUODodVp0o8gc"},
		},
		{
			title: "Xiaomi 14 5G", brandSlug: "xiaomi", model: "Xiaomi 14",
			price: 7_200_000, condition: "new", memory: "256 GB", ram: "12 GB",
			color: "Jade Green", warranty: "Official 1 year", region: "Tashkent", city: "Yakkasaroy",
			descr:  "Flagship Xiaomi 14 with Leica optics. Sealed, official warranty.",
			images: []string{imgBase + "AB6AXuA08xX4eGJgtTt2iI1y-EVI5oPCkawGjXRrdfP-E-KaXVy3HrMMhe4kxZ01XPFiQLLbAZiKGZk5vqIKJU48JBKRGMt3CEvYSu61v9PaLHP-wFzt_roJDGr83kf1Ig1gBmku1Tw8aILeEtm5xoaGQ80_iQiK2NK3OMHA334DbH4-BT1mpqATnujT5ikNIyV7ujpCEKt6NRYU3xToz2FO8idce-2XO-gfEqz-cxh7GINpm5ShZpVC3EiHD--wGmxCEfNhtRICJNPPNno"},
		},
		{
			title: "Honor Magic 6 Pro", brandSlug: "honor", model: "Magic 6 Pro",
			price: 6_500_000, condition: "used", memory: "512 GB", ram: "12 GB",
			color: "Epi Green", battery: 97, region: "Tashkent", city: "Sergeli",
			descr:  "Honor Magic 6 Pro, barely used. Original charger and case included.",
			images: []string{imgBase + "AB6AXuBJjINxD1opEfHc_4_eJyzkNP2PWwSAYMddZM-V2kHqzBB6IGHOHd5bGPN5JHGloUfZWpTLkl1RJsTo7akx3cGflPGOznJnqXEOa3lg78tWSd65VG2FPD4kkorfI39DIYDh-pKVGh9RtD03aOnxmwwLhYt5wi3zs43XEFwOfGE4tezVoMSMkI6qfpTXTG6TNEXOSN6KvUTqjfygzKg4hVcVg_F0Pex8FIcMY-odhCNgbayq7Af8pwRV_9CEwdI32EXg9Ui4jWnexb8"},
		},
		{
			title: "Google Pixel 7 Pro", brandSlug: "google", model: "Pixel 7 Pro",
			price: 5_200_000, condition: "used", memory: "128 GB", ram: "12 GB",
			color: "Obsidian", battery: 90, region: "Tashkent", city: "Yunusobod",
			descr:  "Pixel 7 Pro with stock Android. Clean condition, fully unlocked.",
			images: []string{imgBase + "AB6AXuASMp7r87C90Ubron6_Uu1WW4jmEO1Ytoc49qMt1MPZbFkOynmzuXLFCctHrX4bJT_caCfggEdhSc_n64HP3sM7h0drX87pWXIU-xknlMP3ofIDkEXdmOs3aFXOlX6K4MlpFkXI5MmkUmkjEStPJ_xGf4XSlW6_jxZrQbMNdDlP3e0VZcNxrKI9rn0jhs3lIUse5J3IM-Sm94To39sdlnJXovlpCr4EzgTl_8xcIZDee_7MZd8n6Sa3kUypMpIScb3Y0GW5BBx9Jh8"},
		},
		{
			title: "iPhone 12 128GB", brandSlug: "apple", model: "iPhone 12",
			price: 3_900_000, condition: "used", memory: "128 GB", ram: "4 GB",
			color: "White", battery: 86, region: "Tashkent", city: "Olmazor",
			descr:  "Reliable iPhone 12, everyday condition with light marks. Battery still strong.",
			images: []string{imgBase + "AB6AXuAwcnN22ND0Cr1zUW6kzniML9gc19H-YZ5nh5WxSlnNsjHSNu_XBJFJIT3w8MG8mFUk3N945Z_smtjhhch3281B_sAL0ktDa3fxqX6r99SklT_UZbNp_lmGhmtQ-Hzikxe7UBFOpKWL-Rg2o3Wu4Xxdp-pywO9qPQChrhgPiiMubvSPRgwPNhaKgUtqyg6QL9wBpfzFMOZnX4eb01ShAtK91hR0IQvQHI32kxqkN2kRJAnFxB4vUST97PZaJMT52QkAoLvJF2qSnyw"},
		},
		{
			title: "Xiaomi 13 Ultra", brandSlug: "xiaomi", model: "13 Ultra",
			price: 6_800_000, condition: "new", memory: "512 GB", ram: "16 GB",
			color: "Black", warranty: "Official 1 year", region: "Tashkent", city: "Chilonzor",
			descr:  "Xiaomi 13 Ultra with pro-grade Leica camera system. Sealed unit.",
			images: []string{imgBase + "AB6AXuCdsADYBxRdw-wpk3w4I-tdE867-3VtXJZW9jsed2IUUHFzefP344f1CqMSkif9PcxOIutPVQS53z7HgB_MO49vnAVaXlT9E5yT0crbG-t3d3MiaKa4GMM2O6KM4jrKGcRpWHqzF9YWFPt7Wxd-pJz7FBOOr0iJS4J2yxeMxvjHThUn99EMr9jnwjcMK4okJeWPteCKCCfnj-JBeBr6NFGcUuemAtE0PWK1loVwFakFujzYJSOUbquuuHUOo5YqGOxzcEYLOC8gIYE"},
		},
	}

	m.Register(func(app core.App) error {
		usersCol, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		shopsCol, err := app.FindCollectionByNameOrId("shops")
		if err != nil {
			return err
		}
		listingsCol, err := app.FindCollectionByNameOrId("listings")
		if err != nil {
			return err
		}

		// demo seller account
		owner := core.NewRecord(usersCol)
		owner.SetEmail(demoOwnerEmail)
		owner.SetPassword("demo12345678")
		owner.SetVerified(true)
		owner.Set("name", "TechnoShop")
		owner.Set("is_seller", true)
		if err := app.Save(owner); err != nil {
			return err
		}

		// approved shop
		shop := core.NewRecord(shopsCol)
		shop.Set("owner", owner.Id)
		shop.Set("name", "TechnoShop")
		shop.Set("phone", "+998 90 555 11 22")
		shop.Set("telegram", "@yangisi_uz")
		shop.Set("location", "Tashkent, Yunusobod, 4-mavze")
		shop.Set("description", "Eng sifatli va original smartfonlar faqat bizda. 1 yillik kafolat va servis xizmati bilan.")
		shop.Set("status", "approved")
		shop.Set("verified", true)
		if logo := fetchFiles(imgBase + "AB6AXuCTFTUg7Wigv-BmLZ4_e-PmPt-ic1MH4dmfjsELKX2ariu7DZ5w4O44WNL57TR-O6TzjLkpqcsZQDourAppxpAk6EMDzTrd_Lu1XP-e-VdjItdkCVdskuGZkjZ2cmeP1zYXi0pRsDtgxmEWPAxMVvY-a0jpkql1rEKZ93POaPINm3A6jx-r6EIVfMOFWAt93qxqecb3_6--GkpemygU_-nPjb7ED35COmzdthc4u6TZsL4q2K5XNbxCEiTXImh6Rh-sWpCtVaQbRmU"); len(logo) > 0 {
			shop.Set("logo", logo)
		}
		if err := app.Save(shop); err != nil {
			return err
		}

		// active listings
		for _, l := range listings {
			rec := core.NewRecord(listingsCol)
			rec.Set("owner", owner.Id)
			rec.Set("shop", shop.Id)
			if brand, err := app.FindFirstRecordByData("brands", "slug", l.brandSlug); err == nil {
				rec.Set("brand", brand.Id)
			}
			rec.Set("title", l.title)
			rec.Set("model", l.model)
			rec.Set("price", l.price)
			rec.Set("condition", l.condition)
			rec.Set("memory", l.memory)
			rec.Set("ram", l.ram)
			rec.Set("color", l.color)
			if l.battery > 0 {
				rec.Set("battery_health", l.battery)
			}
			if l.warranty != "" {
				rec.Set("warranty", l.warranty)
			}
			rec.Set("region", l.region)
			rec.Set("city", l.city)
			rec.Set("description", l.descr)
			rec.Set("status", "active")
			if imgs := fetchFiles(l.images...); len(imgs) > 0 {
				rec.Set("images", imgs)
			}
			if err := app.Save(rec); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		// Deleting the demo owner cascades to its shop and listings.
		if owner, err := app.FindFirstRecordByData("users", "email", demoOwnerEmail); err == nil {
			return app.Delete(owner)
		}
		return nil
	})
}
