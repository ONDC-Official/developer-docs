# Beckn Enabled Deep Links

To facilitate seamless and standardized user interactions across digital ecosystems on ONDC, it is crucial to create a universally recognized and standardized "beckn" URI scheme, similar to what Unified Payments Interface (UPI), and WhatsApp, has achieved for major platforms like Web, Android and iOS, thus enhancing deep linking capabilities for entities using the Beckn protocol. Furthermore, the scheme should have easy integration and accessibility through software languages like Java, Python, among others.

As the first use case, ONDC proposes to enable QR code (with deep link embedded) features for merchants facilitated by their respective BPPs (Seller Apps in this context).

Please refer to the detailed [concept note](https://docs.google.com/document/d/17H8gpY1U2dRiZE6DccWYRh__BuVQ2kiMxEw5ZFJ7ULo/edit) on beckn enabled deep links, which details on the deep link schema and example use cases that could be enabled.

## Steps for generating QR code:

### Install dependencies:

```
pip3 install qrcode
```

### Generate query string based on the use case:

**For the use cases:**

#### Catalog Access through Seller-Generated QR Codes

```
query_string = {
        "context.bpp_id": "webapi.magicpin.in",
        "message.intent.provider.id": "P1",
        "context.domain": "nic2004:52110"
    }
```

#### Category-Specific Browsing via Seller-Generated QR Codes

```
query_string = {
        "context.bpp_id": "sellerapp.com",
        "message.intent.provider.id": "P1",
        "context.domain": "RET10",
        "message.intent.category.id": "Foodgrains"
    }
```

#### And so on for the rest of the use cases...

### Run this utility

```
python3 qr_generate.py '{"context.bpp_id": "sellerapp.com", "message.intent.provider.id": "P1", "context.domain": "RET10", "message.intent.category.id": "Foodgrains"}'
```

## Buyer App Platform Integration

Different platforms have different handling mechanisms, for example, Android uses Intent Filters and iOS uses URL schemes or Universal links to identify which apps can handle which URI schemes or use fallback URLs to redirect the consumer to a fallback web URL, usually prompting them to download the relevant app. If multiple apps have registered the same URI scheme, it will either redirect to the default app or prompt the user to select the app they would like to use. Please refer [detailed guide](https://docs.google.com/document/d/1pmwQvF9G37_KwcFViub7m_qYDUjbGLrwvgkv1XZEc08/edit?usp=sharing) on implementation.