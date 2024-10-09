import { PrismaClient } from '@prisma/client';

const prismaSeed = new PrismaClient();

async function main() {
  try {
    await prismaSeed.product.createMany({
      data: [
        {
          product: "VHILL 3000 BANANA ICE",
          price: 210.0,
          internalSku: "31009",
          ean: "6975932947232",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 BLACK MINT",
          price: 210.0,
          internalSku: "30965",
          ean: "6975932947485",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 BLUEBERRY RASPBERRY ICE",
          price: 210.0,
          internalSku: "39159",
          ean: "6975932947348",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 CHERRY ICE",
          price: 210.0,
          internalSku: "36516",
          ean: "6975932947492",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 COOL MINT",
          price: 210.0,
          internalSku: "34154",
          ean: "6975932947300",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 GRAPE ICE",
          price: 210.0,
          internalSku: "33799",
          ean: "6975932947454",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 GRAPE STRAWBERRY",
          price: 210.0,
          internalSku: "33782",
          ean: "6975932947447",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 LUSH ICE",
          price: 210.0,
          internalSku: "34215",
          ean: "6975932947409",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 LYCHEE ICE",
          price: 210.0,
          internalSku: "33454",
          ean: "6975932947324",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 STRAWBERRY WATERMELON",
          price: 210.0,
          internalSku: "34116",
          ean: "6975932947461",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 BLUEBERRY KIWI",
          price: 210.0,
          internalSku: "34147",
          ean: "6975932947294",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "VHILL 3000 PEACH ICE",
          price: 210.0,
          internalSku: "36400",
          ean: "6975932947423",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX BLUBERRY STORM",
          price: 268.8,
          internalSku: "13916",
          ean: "6942222314579",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX BLUBERRY MINT",
          price: 268.8,
          internalSku: "14234",
          ean: "6942222314159",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX BLUEBERRY CHERRY",
          price: 268.8,
          internalSku: "14456",
          ean: "6942222313879",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX COCO STRAWBERRY",
          price: 268.8,
          internalSku: "14357",
          ean: "6942222314333",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX COOL MINT",
          price: 268.8,
          internalSku: "14470",
          ean: "6942222314470",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX DARK MINT",
          price: 268.8,
          internalSku: "13879",
          ean: "6942222313916",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX MR PEACH MINT",
          price: 268.8,
          internalSku: "14173",
          ean: "6942222314418",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX PINK LEMONADE",
          price: 268.8,
          internalSku: "14258",
          ean: "6942222314234",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX STRAWBERRY LITCHI BURST",
          price: 268.8,
          internalSku: "14579",
          ean: "6942222314456",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX STRAWBERRY WATERMELON",
          price: 268.8,
          internalSku: "14531",
          ean: "6942222314357",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
        {
          product: "IPLAY BOX DOUBLE APPLE",
          price: 268.8,
          internalSku: "31448",
          ean: "6942222314494",
          userId: "user_2nDNdBES1ULEWhiCitoBnGFKQzi",
        },
      ],
    });

    console.log("Products seeded successfully");
  } catch (error) {
    console.log("Error seeding the db categories", error);
  } finally {
    await prismaSeed.$disconnect();
  }
}

main();
