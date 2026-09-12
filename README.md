# Zoo CRM

Interní CRM v Nuxtu pro správu klientů, produktů z e-shopu a jejich kategorií podle druhu zvířete. UI a datové konvence vycházejí z projektu `../zajeci`; data poskytuje REST API `../../php/php-core`.

## Spuštění

```bash
cp .env.example .env
npm install
npm run dev
```

PHP API musí běžet na adrese z `PHP_API_BASE_URL`. Protože je `php-core` multi-tenantní, host z `FRONTEND_HOST` musí být v jeho `FRANCHISE_CODES` namapovaný na tenant `zoo` a databáze musí obsahovat role a administrátora pro tento tenant.

`INTERNAL_API_KEY` musí mít v Nuxtu stejnou serverovou hodnotu jako v `php-core`.
Klíč nikdy nevystavujte v `runtimeConfig.public`, klientském JavaScriptu ani v Git repozitáři.

## Přístup k API

Prohlížeč komunikuje s Nuxt endpointy pod `/api`. Nuxt server následně volá
`php-core`, přidává tenant host z `FRONTEND_HOST` a u všech GET požadavků také
`X-Internal-Key`. Díky tomu mohou read-only stránky Zoo načítat také uživatele,
role a adresy bez uživatelské session.

- GET `/api/admin/**` nevyžaduje Nuxt session; PHP ale stále uplatní pravidla konkrétního modulu.
- POST, PATCH, PUT a DELETE pod `/api/admin/**` vyžadují přihlášeného administrátora a Bearer token.
- Interní klíč v PHP povoluje čtení uživatelů, rolí a adres. Nezpřístupňuje objednávky, faktury, soubory ani náhled šablon.
- Veřejné katalogové GETy (`products`, `categories`, `texts`, `enumerations`) vracejí pouze veřejná/publikovaná data.
- Bez platného tenant hostu vrátí PHP `403`, i když je interní klíč správný.

## Proměnné prostředí

```dotenv
PHP_API_BASE_URL=https://www.charter-agency.com/api
FRONTEND_HOST=https://zoo-crm.netlify.app
INTERNAL_API_KEY=<stejný-serverový-klíč-jako-v-php-core>
NUXT_SESSION_PASSWORD=<náhodná-hodnota-alespoň-32-znaků>
```

Na Netlify nastavte tyto hodnoty jako neveřejné environment variables. Po změně
proměnných je potřeba nový deploy, protože je serverová aplikace načítá při startu.

## Datový model

- Klienti používají modul `users`.
- Definice zákaznických profilů používají modul `customer-profiles`; otázky, námitky a preference jsou samostatná relační data profilu.
- Klient může mít více profilů v M:N tabulce `user_customer_profile`; `priority=1` označuje jeho nejvyšší prioritu.
- Druhy zvířat používají modul `categories`.
- Produkty používají modul `products`; vazbu na druhy zvířat zajišťuje `category_ids`.
- Vhodnost produktu pro profil ukládá `product_customer_profile_probability`; Nuxt pracuje s API polem `profile_probabilities`.
- EAN, značka, hmotnost a jednotka se ukládají do flexibilního JSON pole `product.data`.
- Obrázky produktů používají dvoufázový upload modul `files`.

Databázový diagram, úplný seznam sloupců a význam vazeb jsou v
[`php-core/CUSTOMER_PROFILE_MODEL.md`](https://github.com/suku-kahanamoku/php-core/blob/main/CUSTOMER_PROFILE_MODEL.md).

## Produkční kontrola

Po nasazení ověřte alespoň:

1. anonymní GET seznamů produktů, kategorií, klientů, rolí a adres přes Zoo;
2. přihlášení administrátora a vytvoření, úpravu i smazání testovacího záznamu;
3. že přímé volání PHP bez známého tenant hostu vrací `403`;
4. že zápis bez Bearer tokenu vrací `401`;
5. že `INTERNAL_API_KEY` není přítomný v odpovědích ani v klientském bundle.
