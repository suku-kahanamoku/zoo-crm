# Zoo CRM

Interní CRM v Nuxtu pro správu klientů, produktů z e-shopu a jejich kategorií podle druhu zvířete. UI a datové konvence vycházejí z projektu `../zajeci`; data poskytuje REST API `../../php/php-core`.

## Spuštění

```bash
cp .env.example .env
npm install
npm run dev
```

PHP API musí běžet na adrese z `PHP_API_BASE_URL`. Protože je `php-core` multi-tenantní, host z `FRONTEND_HOST` musí být v jeho `FRANCHISE_CODES` namapovaný na tenant `zoo` a databáze musí obsahovat role a administrátora pro tento tenant.

## Datový model

- Klienti používají modul `users`.
- Druhy zvířat používají modul `categories`.
- Produkty používají modul `products`; vazbu na druhy zvířat zajišťuje `category_ids`.
- EAN, značka, hmotnost a jednotka se ukládají do flexibilního JSON pole `product.data`.
- Obrázky produktů používají dvoufázový upload modul `files`.
