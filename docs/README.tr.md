<div align="center">

# ✈️ Preflight

**Vibe coding ile yaptığın uygulama yayına hazır mı? Tek komutla öğren.**

Preflight, projenizi sızan anahtarlar, açık veritabanları, doğrulanmamış ödemeler ve eksik yayın temelleri için tarar, ardından her bulgu için düzeltmesiyle birlikte bir rapor kartı verir.

[![License: MIT](https://img.shields.io/badge/license-MIT-34d399.svg)](../LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-38bdf8.svg)](../package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-fbbf24.svg)](../CONTRIBUTING.md)
[![npm version](https://img.shields.io/npm/v/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![npm downloads](https://img.shields.io/npm/dm/vibe-preflight)](https://www.npmjs.com/package/vibe-preflight)
[![CI](https://github.com/erdellll/preflight/actions/workflows/ci.yml/badge.svg)](https://github.com/erdellll/preflight/actions/workflows/ci.yml)

![Preflight report card](assets/report-card.png)

</div>

```bash
npx vibe-preflight
```

Kurulum yok, hesap yok, ağ çağrısı yok. Kodun makineni asla terk etmez.

## Neden

YZ araçları bir hafta sonunda uygulama yapmayı kolaylaştırdı ve aynı kolaylıkla Stripe gizli anahtarını tarayıcı paketine koymanı ya da herkesin okuyabileceği bir Supabase tablosu oluşturmanı sağladı. Preflight, yayından sonra en çok can yakan hataları, yayına çıkmadan önce denetler.

## Önce bozuk bir uygulamada dene

```bash
npx vibe-preflight --demo
```

Kasıtlı olarak bozulmuş bir demo uygulamayı tara (tüm gizli bilgiler sahtedir), böylece başarısız bir raporun nasıl göründüğünü görebilirsin.

## Neleri denetliyor

Bugün 17 denetim; güvenlik, güvenilirlik ve yayın temellerini kapsıyor. [Tüm denetimlere bak](rules.md).

| | |
|---|---|
| 🔑 İstemci kodundaki canlı gizli bilgiler | 🗄️ Satır düzeyinde güvenliği olmayan Supabase tabloları |
| 📄 Commit edilebilecek `.env` dosyaları | 💳 İmza doğrulaması olmayan Stripe webhook'leri |
| 🌍 Her web sitesine açık CORS | 🚨 Hata izleme yok |
| 🔒 Gizlilik politikası yok | 🔗 Başlık, açıklama veya paylaşım görseli eksik |

## Seçenekler

```bash
npx vibe-preflight [path]          # scan a folder (default: current folder)
npx vibe-preflight --html          # also write a shareable preflight-report.html
npx vibe-preflight --json          # machine-readable output ([JSON format](json.md))
npx vibe-preflight --ignore a,b    # skip checks by id
npx vibe-preflight --fail-on warning   # exit code policy: critical (default) | warning | never
```
Renkli çıktıyı kapatmak için NO_COLOR=1 ayarla.

Bir satıra işaret eden bir bulguyu, o satıra veya üstündeki satıra `// preflight-ignore <check-id>` yazarak sustur. Bütün bir dosyayla ilgili bir bulgu (commit edilmiş bir `.env`, doğrulanmamış bir webhook) aynı yorumu dosyanın ilk beş satırında alır. Proje genelinde kaldırmak istediğin her şey, dosyası olmayan bulgular dahil, `--ignore <check-id>` kullanır.

## CI'da kullan

```yaml
- run: npx vibe-preflight --fail-on critical
```

Bir bulgu `--fail-on` düzeyine ulaştığında komut 1 çıkış koduyla biter, yani sızan bir anahtar birleştirmeyi engeller.

## Claude Code içinde kullan

Preflight, `/preflight` komutuyla birlikte bir Claude Code eklentisi olarak gelir; taramayı çalıştırır, sonuçları açıklar ve kritik sorunları tek tek düzeltmeyi önerir, her değişiklikten önce sorar.

Claude Code'da çalıştır:

```text
/plugin marketplace add erdellll/preflight
/plugin install preflight@preflight
```

Ardından herhangi bir projede `/preflight` yaz.

## 10 dakikada denetim ekle

Her denetim, küçük bir dosya artı iki örnek klasördür; biri işaretlenmeli, biri rahat bırakılmalı. Derleme adımı yok, bağımlılık yok. [CONTRIBUTING.md](../CONTRIBUTING.md) dosyasını oku ya da [`good first issue`](https://github.com/erdellll/preflight/issues?q=is%3Aopen+label%3A%22good+first+issue%22) etiketli issue'lardan birini seç.

## Güvenlik denetimi değildir

Preflight, hızlı desen denetimleriyle yaygın ve etkisi büyük hataları yakalar. Temiz bir rapor, denetimlerinin hiçbirinin tetiklenmediği anlamına gelir, uygulamanın güvenli olduğu anlamına değil. Bunu bir incelemenin yerine değil, emniyet kemeri olarak kullan.

## SSS

**Preflight kodumu bir yere gönderiyor mu?**

Hayır. Preflight tamamen yerel makinenizde çalışır, ağ çağrısı yapmaz ve telemetri toplamaz. Kodun bilgisayarını asla terk etmez.

**100/100 puan uygulamamın güvenli olduğu anlamına mı geliyor?**

Hayır. Yalnızca Preflight denetimlerinin hiçbirinin sorun bulmadığı anlamına gelir. Daha fazla ayrıntı için [Güvenlik denetimi değildir](#güvenlik-denetimi-değildir) bölümüne bak.

**Yanlış pozitifi nasıl sustururum?**

Etkilenen satırda `// preflight-ignore <check-id>` veya Preflight'ı çalıştırırken `--ignore <check-id>` kullan. Denetimin iyileştirilebilmesi için ayrıca "False positive" etiketli veya başlıklı bir GitHub issue'su aç.

**Hangi yığınları anlıyor?**

Preflight herhangi bir projenin dosyalarını tarayabilir, ancak denetimleri Next.js, Vite, Supabase, Stripe, Express ve düz HTML ile en iyi çalışır.

**Sembolik bağlantılı bir dosya neden denetlenmiyor?**

Sembolik bağlantılar, dosyalar da klasörler de, bilerek atlanır. Onları izlemek döngüye girebilir — kendine bağlanan bir klasör asla bitmez — ve Preflight'tan taramasını istediğin projenin dışındaki dosyaları okuyabilir. Bu nedenle başka yerdeki bir dosyaya işaret eden bir `.env` sembolik bağlantısı rapor edilmez; onu içeri kopyala ya da denetimi gerçekten barındıran klasöre yönlendir. `src/project.js` içindeki `walk` ile ilgili yorum da kodun yanında aynısını söyler.

## Lisans

[MIT](../LICENSE). Her türlü kullanım için ücretsizdir.

## Katkıda bulunanlar

Preflight'ı daha iyi yapan herkese teşekkürler! 💛

<a href="https://github.com/erdellll/preflight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=erdellll/preflight" alt="Preflight contributors" />
</a>
